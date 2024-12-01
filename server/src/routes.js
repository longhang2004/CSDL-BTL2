import { getauth, query } from './sql-helper.js';

function deal_with_error(query_str, response, error){
    if (error) {
        if (error.code == "ELOGIN")
            response.send({
                success: false,
                message: "Tài khoản không hợp lệ",
            });
        else if (error.code == "EREQUEST")
            response.send({
                success: false,
                query : query_str,
                message: "Input không hợp lệ : " + error.originalError.info.message,
            });
        else
            response.send({
                success: false,
                query : query_str,
                message: "Lỗi chưa xác định",
                error: error
            });
    }
}
export function login(request, response) {
    var auth = getauth(request.body)
    query("select * from Admin", auth, (error, rows) => {
        if (error) {
            deal_with_error(query_str, response, error);
        }
        else {
            response.send({
                success: true,
                message: "Đăng nhập thành công",
            });
        }
    });
}

export function get_hang_san_xuat(request, response){
    var auth = getauth(request.body)
    var body = request.body;
    var query_str = "SELECT * FROM HangSanXuat";
    query(query_str, auth, (error, rows) => {
        if (error) {
            deal_with_error(query_str, response, error);
        }
        else
            response.send({
                success: true,
                message: "Lấy dữ liệu thành công",
                query: query_str,
                data: rows.recordset
            });
    });
}

export function get_hang_hoa(request, response) {
    var auth = getauth(request.body)

    var query_str = "SELECT hh.*, hsx.TenHangSanXuat as 'hsx.TenHangSanXuat', hsx.DiaChi as 'hsx.DiaChi' FROM HangHoa as hh INNER JOIN HangSanXuat as hsx ON hsx.MaHangSanXuat = hh.MaHangSanXuat";
    query_str += " WHERE '' = ''"
    // Lọc tên hàng hoá
    if (typeof request.query.hanghoa_ten !== 'undefined') {
        query_str += ` AND LOWER(hh.Ten) LIKE '%${request.query.hanghoa_ten}%'`
    }
    // Lọc mô tả hàng hoá
    if (typeof request.query.hanghoa_mota !== 'undefined') {
        query_str += ` AND LOWER(hh.MoTa) LIKE '%${request.query.hanghoa_mota}%'`
    }
    // Lọc tên hãng sản xuất
    if (typeof request.query.hangsanxuat_ten !== 'undefined') {
        query_str += ` AND LOWER(hsx.TenHangSanXuat) LIKE '%${request.query.hangsanxuat_ten}%'`
    }
    // Lọc địa chỉ hãng sản xuất
    if (typeof request.query.hangsanxuat_diachi !== 'undefined') {
        query_str += ` AND LOWER(hsx.DiaChi) LIKE '%${request.query.hangsanxuat_diachi}%'`
    }
    // Lọc sao đánh giá
    if (typeof request.query.hanghoa_danhgia_min !== 'undefined' || typeof request.query.hanghoa_danhgia_max !== 'undefined') {
        var danhgia_min = typeof request.query.hanghoa_danhgia_min !== 'undefined' ? request.query.hanghoa_danhgia_min : 0;
        var danhgia_max = typeof request.query.hanghoa_danhgia_max !== 'undefined' ? request.query.hanghoa_danhgia_max : 5;
        if (danhgia_min.length !== 0 && danhgia_max.length !== 0)
            query_str += ` AND hh.SoSaoDanhGia BETWEEN ${danhgia_min} AND ${danhgia_max}`;
    }
    // Lọc giá mua vào
    if (typeof request.query.hanghoa_giamua_min !== 'undefined' || typeof request.query.hanghoa_giamua_max !== 'undefined') {
        var giamua_min = typeof request.query.hanghoa_giamua_min !== 'undefined' ? request.query.hanghoa_giamua_min : 0;
        var giamua_max = typeof request.query.hanghoa_giamua_max !== 'undefined' ? request.query.hanghoa_giamua_max : 999999999;
        if (giamua_min.length !== 0 && giamua_max.length !== 0)
            query_str += ` AND hh.GiaMuaVao BETWEEN ${giamua_min} AND ${giamua_max}`;
    }
    // Lọc giá bán ra
    if (typeof request.query.hanghoa_giaban_min !== 'undefined' || typeof request.query.hanghoa_giaban_max !== 'undefined') {
        var giaban_min = typeof request.query.hanghoa_giaban_min !== 'undefined' ? request.query.hanghoa_giaban_min : 0;
        var giaban_max = typeof request.query.hanghoa_giaban_max !== 'undefined' ? request.query.hanghoa_giaban_max : 999999999;
        if (giaban_min.length !== 0 && giaban_max.length !== 0)
            query_str += ` AND hh.GiaBanNiemYet BETWEEN ${giaban_min} AND ${giaban_max}`;
    }
    // Lọc tồn kho
    if (typeof request.query.hanghoa_tonkho_min !== 'undefined' || typeof request.query.hanghoa_tonkho_max !== 'undefined') {
        var tonkho_min = typeof request.query.hanghoa_tonkho_min !== 'undefined' ? request.query.hanghoa_tonkho_min : 0;
        var tonkho_max = typeof request.query.hanghoa_tonkho_max !== 'undefined' ? request.query.hanghoa_tonkho_max : 999999999;
        if (tonkho_min.length !== 0 && tonkho_max.length !== 0)
            query_str += ` AND hh.TonKho BETWEEN ${tonkho_min} AND ${tonkho_max}`;
    }

    if (typeof request.query.sort_by !== 'undefined') {
        var sort_by = request.query.sort_by;
        if (!sort_by.includes("hsx."))
            sort_by = "hh." + sort_by;

        var sort_dir = "ASC";
        if (typeof request.query.sort_dir !== 'undefined')
            sort_dir = request.query.sort_dir;

        if (sort_by.length !== 0 && sort_dir.length !== 0)
            query_str += ` ORDER BY ${sort_by} ${sort_dir}`;
    }

    query(query_str, auth, (error, rows) => {
        if (error) {
            deal_with_error(query_str, response, error);
        }
        else
            response.send({
                success: true,
                message: "Lấy dữ liệu thành công",
                query: query_str,
                data: rows.recordset
            });
    });
};

export function create_hang_hoa(request, response) {
    var auth = getauth(request.body)
    var body = request.body;
    var query_str = `INSERT INTO HangHoa VALUES (${body.MaHangHoa}, ${body.MaHangSanXuat}, '${body.Ten}', ${body.GiaMuaVao}, ${body.GiaBanNiemYet}, ${body.TonKho}, '${body.MoTa}', ${body.SoSaoDanhGia});`;
    query(query_str, auth, (error, rows) => {
        if (error) {
            deal_with_error(query_str, response, error);
        }
        else
            response.send({
                success: true,
                message: "Thêm dữ liệu thành công",
                query: query_str,
                data: rows
            });
    });
};

export function update_hang_hoa(request, response) {
    var auth = getauth(request.body)
    var body = request.body;
    var query_str = `UPDATE HangHoa SET MaHangSanXuat='${body.MaHangSanXuat}',Ten='${body.Ten}',GiaMuaVao='${body.GiaMuaVao}',GiaBanNiemYet='${body.GiaBanNiemYet}',TonKho='${body.TonKho}',MoTa=N'${body.MoTa}',SoSaoDanhGia='${body.SoSaoDanhGia}' WHERE MaHangHoa = ${body.MaHangHoa}`;
    query(query_str, auth, (error, rows) => {
        if (error) {
            deal_with_error(query_str, response, error);
        }
        else
            response.send({
                success: true,
                message: "Cập nhật dữ liệu thành công",
                query: query_str,
                data: rows
            });
    });
};

export function delete_hang_hoa(request, response) {
    var auth = getauth(request.body)
    var body = request.body;
    var query_str = `DELETE HangHoa WHERE MaHangHoa = ${body.MaHangHoa}`;
    query(query_str, auth, (error, rows) => {
        if (error) {
            deal_with_error(query_str, response, error);
        }
        else
            response.send({
                success: true,
                message: "Xoá dữ liệu thành công",
                query: query_str,
                data: rows
            });
    });
};

export function get_average_rating(request, response) {
    var auth = getauth(request.body)

    const MaHangHoa = request.body.MaHangHoa;
    const query_str = `UPDATE HangHoa SET SoSaoDanhGia=dbo.GetAverageRatingForProduct(HangHoa.MaHangHoa) WHERE MaHangHoa = ${MaHangHoa}; SELECT * FROM HangHoa WHERE MaHangHoa = ${MaHangHoa};`;

    query(query_str, auth, (error, rows) => {
        if (error) {
            deal_with_error(query_str, response, error);
        }
        else
            response.send({
                success: true,
                message: "Cập nhật dữ liệu thành công",
                query: query_str,
                data: rows.recordset
            });
    });
};

export function create_danh_gia(request, response){
    var auth = getauth(request.body)
    var body = request.body;
    var query_str = `INSERT INTO DanhGiaSanPham VALUES (${body.MaDonHang}, ${body.MaKhachHang}, ${body.MaHangHoa}, N'${body.NoiDung}', ${body.SoSao}, '${body.Anh_Video}');`;
    query(query_str, auth, (error, rows) => {
        if (error) {
            deal_with_error(query_str, response, error);
        }
        else
            response.send({
                success: true,
                message: "Thêm dữ liệu thành công",
                query: query_str,
                data: rows
            });
    });
}