const db = require('../db/database');
const common = require('../common');

module.exports = (request, response, next)=>{

    if(request[db.columns.company_id] == undefined){
        response.send({code : 400, "response":"Missing parameter company_id"});
        return;
    }

    values = "";
    if(request[common.param.bid] != undefined)
        values += ` ${db.columns.bid} = ${request[common.param.bid]} `;

    if(request[db.columns.budget] != undefined && values != ""){
        values += ` AND ${db.columns.budget} = ${request[db.columns.budget]}`;
    }else if(request[db.columns.budget] != undefined && values == ""){
        values += ` ${db.columns.budget} = ${request[db.columns.budget]}`;
    }

    if(values == ""){
        response.send({code : 400, "response":"Nothing to update"});
        return;
    }

    let stockDbUpdate = `UPDATE ${db.tables.stock} SET ${values} WHERE ${db.columns.company_id}
        = '${request[db.columns.company_id]}'`;

    return db.connection.query(stockDbUpdate, (err, rows) => {
        if (rows) {
            response.send({code : 200, "response":rows});
        }
        if (err) {
            console.log(err);
            response.send({code : 400, "response":err});
        }
    });
}