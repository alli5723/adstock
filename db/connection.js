var mysql = require('mysql');
var connection = mysql.createConnection({
        host: 'localhost',
        user: 'root',
        password: '',
        database: 'adcash_stock'
});
connection.connect();

module.exports = connection;
