const db = require('./db/database');

module.exports = (content)=>{
    console.log(content);
    let insertLog = `INSERT into ${db.tables.log}(${db.columns.log_content}) VALUES('${content}')`;
    db.connection.query(insertLog);
}