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

export {read_nguoi_dung, read_hang_hoa, get_average_rating, check_login}
