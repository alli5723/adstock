const db = require('../db/database');

module.exports = (request, response, next)=>{
    let logQuery = `SELECT * FROM ${db.tables.log} order by ${db.columns.log_id} desc`;

    return db.connection.query(logQuery, (err, rows) => {
        if (rows) {
            response.send({code : 200, "response":rows});
        }
        if (err) {
            response.send({code : 400, "response":err});
        }
    });
}