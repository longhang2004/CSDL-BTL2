import { query } from './sql-helper.js'

function read_nguoi_dung(request, response) {
    query("select * from NguoiDung", (error, rows) => {
        if (error)
            response.send(error)
        else
            response.send(rows);
    });
};

function read_hang_hoa(request, response) {
    query("select * from HangHoa", (error, rows) => {
        if (error)
            response.send(error)
        else
            response.send(rows);
    });
};

function get_average_rating(request, response) {
    const maHangHoa = request.params.maHangHoa;
    const sqlQuery = `SELECT dbo.GetAverageRatingForProduct(${maHangHoa}) AS AverageRating`;

    query(sqlQuery, (error, result) => {
        if (error) {
            response.send(error)
        } else {
            response.send(result);
        }
    });
}

function check_login(request, response) {
    const { username, password } = request.body;
    
    if (username === process.env.SQL_USERNAME && password === process.env.SQL_PASSWORD) {
        response.json({
            success: true,
            message: "Đăng nhập thành công"
        });
    } else {
        response.json({
            success: false,
            message: "Tên đăng nhập hoặc mật khẩu không đúng"
        });
    }
}

function create_user(request, response) {
    const { Ten, Ho, email, sdt, diaChi, LoaiNguoiDung, matkhau } = request.body;
    
    const sqlQuery = `
        INSERT INTO NguoiDung (Ten, Ho, email, sdt, diaChi, LoaiNguoiDung, matkhau)
        VALUES (N'${Ten}', N'${Ho}', '${email}', '${sdt}', N'${diaChi}', ${LoaiNguoiDung}, '${matkhau}');
        SELECT SCOPE_IDENTITY() as MaNguoiDung;
    `;

    query(sqlQuery, (error, result) => {
        if (error) {
            response.status(500).json({
                success: false,
                message: "Lỗi khi tạo người dùng",
                error: error
            });
        } else {
            response.json({
                success: true,
                message: "Tạo người dùng thành công",
                MaNguoiDung: result.recordset[0].MaNguoiDung
            });
        }
    });
}

function read_user(request, response) {
    const { MaNguoiDung } = request.params;
    
    const sqlQuery = `
        SELECT Ten, Ho, email, sdt, diaChi, LoaiNguoiDung
        FROM NguoiDung
        WHERE MaNguoiDung = ${MaNguoiDung}
    `;

    query(sqlQuery, (error, result) => {
        if (error) {
            response.status(500).json({
                success: false,
                message: "Lỗi khi đọc thông tin người dùng",
                error: error
            });
        } else {
            if (result.recordset.length > 0) {
                response.json({
                    success: true,
                    data: result.recordset[0]
                });
            } else {
                response.status(404).json({
                    success: false,
                    message: "Không tìm thấy người dùng"
                });
            }
        }
    });
}

function update_user(request, response) {
    const { MaNguoiDung } = request.params;
    const { Ten, Ho, email, sdt, diaChi, LoaiNguoiDung, matkhau } = request.body;
    
    const sqlQuery = `
        UPDATE NguoiDung
        SET Ten = N'${Ten}',
            Ho = N'${Ho}',
            email = '${email}',
            sdt = '${sdt}',
            diaChi = N'${diaChi}',
            LoaiNguoiDung = ${LoaiNguoiDung}
            ${matkhau ? `, matkhau = '${matkhau}'` : ''}
        WHERE MaNguoiDung = ${MaNguoiDung}
    `;

    query(sqlQuery, (error, result) => {
        if (error) {
            response.status(500).json({
                success: false,
                message: "Lỗi khi cập nhật thông tin người dùng",
                error: error
            });
        } else {
            response.json({
                success: true,
                message: "Cập nhật thông tin người dùng thành công"
            });
        }
    });
}

function delete_user(request, response) {
    const { MaNguoiDung } = request.params;
    
    // We need to delete in the correct order to avoid foreign key constraints
    const sqlQuery = `
        -- Delete from GioHang first
        DELETE FROM GioHang WHERE MaNguoiDung = ${MaNguoiDung};

        -- Delete from DanhGiaSanPham
        DELETE FROM DanhGiaSanPham WHERE MaKhachHang = ${MaNguoiDung};

        -- Delete from SuDungVoucher and related DonHang
        DELETE FROM SuDungVoucher WHERE MaDonHang IN (
            SELECT MaDonHang FROM DonHang WHERE MaKhachHang = ${MaNguoiDung}
        );

        -- Delete from ChiTietDonHang
        DELETE FROM ChiTietDonHang WHERE MaDonHang IN (
            SELECT MaDonHang FROM DonHang WHERE MaKhachHang = ${MaNguoiDung}
        );

        -- Delete from DonHang
        DELETE FROM DonHang WHERE MaKhachHang = ${MaNguoiDung};

        -- Delete from TinNhan
        DELETE FROM TinNhan WHERE MaKhachHang = ${MaNguoiDung} OR MaAdmin = ${MaNguoiDung};

        -- Delete from LichSuThayDoi
        DELETE FROM LichSuThayDoi WHERE MaNguoiDung = ${MaNguoiDung};

        -- Delete from DangTaiHangHoa
        DELETE FROM DangTaiHangHoa WHERE MaAdmin = ${MaNguoiDung};

        -- Delete from Admin or KhachHang tables
        DELETE FROM Admin WHERE MaNguoiDung = ${MaNguoiDung};
        DELETE FROM KhachHang WHERE MaNguoiDung = ${MaNguoiDung};

        -- Finally delete from NguoiDung
        DELETE FROM NguoiDung WHERE MaNguoiDung = ${MaNguoiDung};
    `;

    query(sqlQuery, (error, result) => {
        if (error) {
            response.status(500).json({
                success: false,
                message: "Lỗi khi xóa người dùng",
                error: error
            });
        } else {
            response.json({
                success: true,
                message: "Xóa người dùng và dữ liệu liên quan thành công"
            });
        }
    });
}

export {
    read_nguoi_dung, read_hang_hoa, get_average_rating, check_login,
    create_user, read_user, update_user, delete_user
}
