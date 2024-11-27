import sql from 'mssql'
const config = {
    "server": "DESKTOP-DPH71MT",
    "authentication": {
        "type": "default",
        "options": {
            "userName": "admin",
            "password": "Shadommc613@",
        }
    },
    "options": {
        "port": 1433,
        "database": "QuanLyDonHang"
    },
    "trustServerCertificate": true,
};
export function query(query, callback) {
    sql.connect(config, err => {
        if (err)
            callback(err, null);
        else
            sql.query(query, callback)
    })
}