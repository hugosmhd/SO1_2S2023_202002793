const mysql = require('mysql2/promise')

const pool = mysql.createPool({
    host: 'localhost',
    user: 'root',
    password: 'secret',
    port: 3306,
    database: 'proyecto1'
});

module.exports = pool;