import { getauth, query } from './sql-helper.js';

function isEmpty(input){
    return (typeof input == 'undefined' || input == undefined || input == null || input == "");
}

function deal_with_error(query_str, response, error) {
    if (error) {
        if (error.code == "ELOGIN")
            response.status(401).json({
                success: false,
                message: "Tài khoản không hợp lệ",
            });
        else if (error.code == "EREQUEST")
            response.status(400).json({
                success: false,
                query: query_str,
                message: "Input không hợp lệ : " + error.originalError.info.message,
            });
        else
            response.status(500).json({
                success: false,
                query: query_str,
                message: "Lỗi chưa xác định",
                error: error
            });
    }
}

export function direct_query(request, response) {
    var auth = getauth(request.headers);
    var query_str = request.body.query;
    console.log("QUERY : " + query_str);
    query(query_str, auth, (error, rows) => {
        if (error) {
            deal_with_error(query_str, response, error);
        }
        else {
            response.json(rows);
        }
    });
}

export function login(request, response) {
    var auth = getauth(request.headers);
    var query_str = "SELECT 1";
    query(query_str, auth, (error, rows) => {
        if (error) {
            deal_with_error(query_str, response, error);
        }
        else {
            response.json({
                success: true,
                message: "Đăng nhập thành công",
            });
        }
    });
}

export function get_hang_san_xuat(request, response) {
    var auth = getauth(request.headers)
    var query_str = "SELECT * FROM HangSanXuat";
    query(query_str, auth, (error, rows) => {
        if (error) {
            deal_with_error(query_str, response, error);
        }
        else
            response.json({
                success: true,
                message: "Lấy dữ liệu thành công",
                query: query_str,
                data: rows.recordset
            });
    });
}

export function get_hang_hoa(request, response) {
    var auth = getauth(request.headers)

    var query_str = "SELECT hh.*, hsx.TenHangSanXuat as 'hsx.TenHangSanXuat', hsx.DiaChi as 'hsx.DiaChi' FROM HangHoa as hh INNER JOIN HangSanXuat as hsx ON hsx.MaHangSanXuat = hh.MaHangSanXuat";
    query_str += " WHERE '' = ''"
    // Lọc tên hàng hoá
    if (!isEmpty(request.query.hanghoa_ten)) {
        query_str += ` AND LOWER(hh.Ten) LIKE '%${request.query.hanghoa_ten}%'`
    }
    // Lọc ID
    if (!isEmpty(request.query.hanghoa_id)) {
        query_str += ` AND LOWER(hh.MaHangHoa) LIKE '%${request.query.hanghoa_id}%'`
    }
    // Lọc mô tả hàng hoá
    if (!isEmpty(request.query.hanghoa_mota)) {
        query_str += ` AND LOWER(hh.MoTa) LIKE '%${request.query.hanghoa_mota}%'`
    }
    // Lọc tên hãng sản xuất
    if (!isEmpty(request.query.hangsanxuat_ten)) {
        query_str += ` AND LOWER(hsx.TenHangSanXuat) LIKE '%${request.query.hangsanxuat_ten}%'`
    }
    // Lọc địa chỉ hãng sản xuất
    if (!isEmpty(request.query.hangsanxuat_diachi)) {
        query_str += ` AND LOWER(hsx.DiaChi) LIKE '%${request.query.hangsanxuat_diachi}%'`
    }
    // Lọc sao đánh giá
    if (!isEmpty(request.query.hanghoa_danhgia_min)|| !isEmpty(request.query.hanghoa_danhgia_max)) {
        var danhgia_min = !isEmpty(request.query.hanghoa_danhgia_min) ? request.query.hanghoa_danhgia_min : 0;
        var danhgia_max = !isEmpty(request.query.hanghoa_danhgia_max )? request.query.hanghoa_danhgia_max : 5;
        if (danhgia_min.length !== 0 && danhgia_max.length !== 0)
            query_str += ` AND hh.SoSaoDanhGia BETWEEN ${danhgia_min} AND ${danhgia_max}`;
    }
    // Lọc giá mua vào
    if (!isEmpty(request.query.hanghoa_giamua_min)|| !isEmpty(request.query.hanghoa_giamua_max)) {
        var giamua_min = !isEmpty(request.query.hanghoa_giamua_min) ? request.query.hanghoa_giamua_min : 0;
        var giamua_max = !isEmpty(request.query.hanghoa_giamua_max) ? request.query.hanghoa_giamua_max : 999999999;
        if (giamua_min.length !== 0 && giamua_max.length !== 0)
            query_str += ` AND hh.GiaMuaVao BETWEEN ${giamua_min} AND ${giamua_max}`;
    }
    // Lọc giá bán ra
    if (!isEmpty(request.query.hanghoa_giaban_min)|| !isEmpty(request.query.hanghoa_giaban_max)) {
        var giaban_min = !isEmpty(request.query.hanghoa_giaban_min)? request.query.hanghoa_giaban_min : 0;
        var giaban_max = !isEmpty(request.query.hanghoa_giaban_max)? request.query.hanghoa_giaban_max : 999999999;
        if (giaban_min.length !== 0 && giaban_max.length !== 0)
            query_str += ` AND hh.GiaBanNiemYet BETWEEN ${giaban_min} AND ${giaban_max}`;
    }
    // Lọc tồn kho
    if (!isEmpty(request.query.hanghoa_tonkho_min)|| !isEmpty(request.query.hanghoa_tonkho_max)) {
        var tonkho_min = !isEmpty(request.query.hanghoa_tonkho_min)? request.query.hanghoa_tonkho_min : 0;
        var tonkho_max = !isEmpty(request.query.hanghoa_tonkho_max)? request.query.hanghoa_tonkho_max : 999999999;
        if (tonkho_min.length !== 0 && tonkho_max.length !== 0)
            query_str += ` AND hh.TonKho BETWEEN ${tonkho_min} AND ${tonkho_max}`;
    }

    if (!isEmpty(request.query.sort_by)) {
        var sort_by = request.query.sort_by;
        if (!sort_by.includes("hsx."))
            sort_by = "hh." + sort_by;

        var sort_dir = "ASC";
        if (!isEmpty(request.query.sort_dir))
            sort_dir = request.query.sort_dir;

        if (sort_by.length !== 0 && sort_dir.length !== 0)
            query_str += ` ORDER BY ${sort_by} ${sort_dir}`;
    }

    query(query_str, auth, (error, rows) => {
        if (error) {
            deal_with_error(query_str, response, error);
        }
        else
            response.json({
                success: true,
                message: "Lấy dữ liệu thành công",
                query: query_str,
                data: rows.recordset
            });
    });
};

export function create_hang_hoa(request, response) {
    var auth = getauth(request.headers)
    var body = request.body;

    const insert_hanghoa = () => {
        var query_str = `INSERT INTO HangHoa(MaHangSanXuat, Ten, GiaMuaVao, GiaBanNiemYet, MoTa) VALUES (${body.MaHangSanXuat}, '${body.Ten}', ${body.GiaMuaVao}, ${body.GiaBanNiemYet}, '${body.MoTa}');
            SELECT SCOPE_IDENTITY() as MaHangHoa;`;
        query(query_str, auth, (error, rows) => {
            if (error) {
                deal_with_error(query_str, response, error);
            }
            else
                response.json({
                    success: true,
                    message: "Thêm dữ liệu thành công",
                    query: query_str,
                    data: rows.recordset
                });
        });
    }

    if (body.MaHangSanXuat == -1) {
        var query_str = `INSERT INTO HangSanXuat (TenHangSanXuat, DiaChi) VALUES ('${body.TenHangSanXuatMoi}', '${body.DiaChiHangSanXuatMoi}'); 
        SELECT CAST(scope_identity() AS int) as new_id;`;
        query(query_str, auth, (error, rows) => {
            if (error) {
                deal_with_error(query_str, response, error);
            }
            else
                body.MaHangSanXuat = rows.recordset[0].new_id
            insert_hanghoa();
        });
    }
    else {
        insert_hanghoa();
    }
};

export function update_hang_hoa(request, response) {
    var auth = getauth(request.headers)
    var body = request.body;
    var set_query = "";
    if (!isEmpty(body.MaHangSanXuat))
        set_query += `MaHangSanXuat='${body.MaHangSanXuat}',`;
    if (!isEmpty(body.Ten))
        set_query += `Ten='${body.Ten}',`;
    if (!isEmpty(body.GiaMuaVao))
        set_query += `GiaMuaVao='${body.GiaMuaVao}',`;
    if (!isEmpty(body.GiaBanNiemYet))
        set_query += `GiaBanNiemYet='${body.GiaBanNiemYet}',`;
    if (!isEmpty(body.TonKho))
        set_query += `TonKho='${body.TonKho}',`;
    if (!isEmpty(body.MoTa))
        set_query += `MoTa='${body.MoTa}',`;
    if (!isEmpty(body.SoSaoDanhGia))
        set_query += `SoSaoDanhGia='${body.SoSaoDanhGia}',`;
    if (set_query.length == 0) {
        response.status(400).json({
            success: false,
            message: "Bạn không chọn thay đổi bất kì thông tin nào"
        });
        return;
    }
    set_query = set_query.substring(0, set_query.length - 1);
    var query_str = `UPDATE HangHoa SET ${set_query} WHERE MaHangHoa = ${body.MaHangHoa}; 
        SELECT hh.*, hsx.TenHangSanXuat as 'hsx.TenHangSanXuat', hsx.DiaChi as 'hsx.DiaChi' FROM HangHoa as hh INNER JOIN HangSanXuat as hsx ON hsx.MaHangSanXuat = hh.MaHangSanXuat WHERE MaHangHoa = ${body.MaHangHoa};`;
    query(query_str, auth, (error, rows) => {
        if (error) {
            deal_with_error(query_str, response, error);
        }
        else
            response.json({
                success: true,
                message: "Cập nhật dữ liệu thành công",
                query: query_str,
                data: rows.recordset
            });
    });
};

export function delete_hang_hoa(request, response) {
    var auth = getauth(request.headers)
    var body = request.body;
    var query_str = `DELETE HangHoa WHERE MaHangHoa = ${body.MaHangHoa}`;
    query(query_str, auth, (error, rows) => {
        if (error) {
            deal_with_error(query_str, response, error);
        }
        else
            response.json({
                success: true,
                message: "Xoá dữ liệu thành công",
                query: query_str,
                data: rows
            });
    });
};

export function get_average_rating(request, response) {
    var auth = getauth(request.headers)

    const MaHangHoa = request.body.MaHangHoa;
    const query_str = `UPDATE HangHoa SET SoSaoDanhGia=dbo.GetAverageRatingForProduct(HangHoa.MaHangHoa) WHERE MaHangHoa = ${MaHangHoa}; SELECT hh.*, hsx.TenHangSanXuat as 'hsx.TenHangSanXuat', hsx.DiaChi as 'hsx.DiaChi' FROM HangHoa as hh INNER JOIN HangSanXuat as hsx ON hsx.MaHangSanXuat = hh.MaHangSanXuat WHERE hh.MaHangHoa = ${MaHangHoa};`;

    query(query_str, auth, (error, rows) => {
        if (error) {
            deal_with_error(query_str, response, error);
        }
        else
            response.json({
                success: true,
                message: "Cập nhật dữ liệu thành công",
                query: query_str,
                data: rows.recordset
            });
    });
};


export function create_danh_gia(request, response) {
    var auth = getauth(request.headers)
    var body = request.body;
    var query_str = `INSERT INTO DanhGiaSanPham VALUES (${body.MaDonHang}, ${body.MaKhachHang}, ${body.MaHangHoa}, N'${body.NoiDung}', ${body.SoSao}, '${body.Anh_Video}');`;
    query(query_str, auth, (error, rows) => {
        if (error) {
            deal_with_error(query_str, response, error);
        }
        else
            response.json({
                success: true,
                message: "Thêm dữ liệu thành công",
                query: query_str,
                data: rows
            });
    });
}

export function get_danh_gia(request, response){
    var auth = getauth(request.headers)
    var query_str = `SELECT dg.*,kh.CapBac,nd.* FROM DanhGiaSanPham AS dg
        JOIN HangHoa AS hh ON dg.MaHangHoa = hh.MaHangHoa
        JOIN KhachHang AS kh ON dg.MaKhachHang = kh.MaNguoiDung
        JOIN NguoiDung AS nd ON dg.MaKhachHang = nd.MaNguoiDung`;
    if (!isEmpty(request.query.MaHangHoa))
        query_str += ` WHERE dg.MaHangHoa = ${request.query.MaHangHoa}`;
    query(query_str, auth, (error, rows) => {
        if (error) {
            deal_with_error(query_str, response, error);
        }
        else
            response.json({
                success: true,
                message: "Lấy dữ liệu thành công",
                query: query_str,
                data: rows.recordset
            });
    });
}


export function create_user(request, response) {
    var auth = getauth(request.headers)
    const { Ten, Ho, email, sdt, diaChi, LoaiNguoiDung, matkhau } = request.body;

    const sqlQuery = `
        INSERT INTO NguoiDung (Ten, Ho, email, sdt, diaChi, LoaiNguoiDung, matkhau)
        VALUES (N'${Ten}', N'${Ho}', '${email}', '${sdt}', N'${diaChi}', ${LoaiNguoiDung}, '${matkhau}');
        SELECT SCOPE_IDENTITY() as MaNguoiDung;
    `;

    query(sqlQuery, auth, (error, result) => {
        if (error) {
            deal_with_error(sqlQuery, response, error);
        } else {
            response.json({
                success: true,
                message: "Tạo người dùng thành công",
                MaNguoiDung: result.recordset[0].MaNguoiDung
            });
        }
    });
}

export function read_user(request, response) {
    var auth = getauth(request.headers);
    const sqlQuery = `
        SELECT *
        FROM NguoiDung
    `;
    if (!isEmpty(request.query.MaNguoiDung))
        sqlQuery += `WHERE MaNguoiDung=${request.query.MaNguoiDung}`;

    query(sqlQuery, auth, (error, result) => {
        if (error) {
            deal_with_error(sqlQuery, response, error);
        } else {
            if (result.recordset.length > 0) {
                response.json({
                    success: true,
                    data: result.recordset
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

export function update_user(request, response) {
    var auth = getauth(request.headers)
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

    query(sqlQuery, auth, (error, result) => {
        if (error) {
            deal_with_error(sqlQuery, response, error);
        } else {
            response.json({
                success: true,
                message: "Cập nhật thông tin người dùng thành công"
            });
        }
    });
}

export function delete_user(request, response) {
    var auth = getauth(request.headers)
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

    query(sqlQuery, auth, (error, result) => {
        if (error) {
            deal_with_error(sqlQuery, response, error);
        } else {
            response.json({
                success: true,
                message: "Xóa người dùng và dữ liệu liên quan thành công"
            });
        }
    });
}
