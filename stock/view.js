const db = require('../db/database');

module.exports = (request, response, next)=>{
    let stockDbQuery = `SELECT * FROM ${db.tables.stock} `;

    return db.connection.query(stockDbQuery, (err, rows) => {
        if (rows) {
            response.send({code : 200, "response":rows});
        }
        if (err) {
            response.send({code : 400, "response":err});
        }
    });
}