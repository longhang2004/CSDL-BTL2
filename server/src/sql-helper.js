import sql from 'mssql'
const config = {
    "server": process.env.SQL_SERVER,
    "authentication": {
        "type": "default",
        "options": {
            "userName": process.env.SQL_USERNAME,
            "password": process.env.SQL_PASSWORD,
        }
    },
    "options": {
        "port": parseInt(process.env.SQL_PORT),
        "database": process.env.SQL_DATABASE
    },
    "trustServerCertificate": true,
};
export function query(query, callback) {
    console.log(config);
    sql.connect(config, err => {
        if (err)
            callback(err, null);
        else
            sql.query(query, callback)
    })
}