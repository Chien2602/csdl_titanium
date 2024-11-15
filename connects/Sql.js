const sql = require('mssql/msnodesqlv8');
require('dotenv').config();

const config = {
    server: process.env.DB_SERVER,
    user: process.env.DB_USER,
    password: process.env.DB_PASSWORD,
    database: process.env.DB_DATABASE,
    driver: process.env.DB_DRIVER
};

const conn = new sql.ConnectionPool(config);

conn.connect()
    .then(() => {
        console.log("Kết nối SQL Server thành công");
    })
    .catch(err => {
        console.error("Kết nối SQL Server thất bại: ", err);
    });

module.exports = conn;
