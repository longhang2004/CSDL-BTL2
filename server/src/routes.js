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

export {read_nguoi_dung, read_hang_hoa}
