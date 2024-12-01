import sql from 'mssql'

export function getauth(body){
    return {
        username: body.username,
        password: body.password,
    }
}
export function query(query, auth, callback) {
    const config = {
        "server": process.env.SQL_SERVER,
        "authentication": {
            "type": "default",
            "options": {
                "userName": auth.username,
                "password": auth.password,
            }
        },
        "options": {
            "port": parseInt(process.env.SQL_PORT),
            "database": process.env.SQL_DATABASE
        },
        "trustServerCertificate": true,
    };
    sql.connect(config, err => {
        if (err)
            callback(err, null);
        else
            sql.query(query, (error, rows) =>{
                sql.close();
                callback(error, rows);
            });
    })
}