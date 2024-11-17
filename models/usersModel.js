const db = require("../db/db");
const tableName = "Users";
module.exports = {
    findByUserName(username) {
        return db.query(`select * from ${tableName} where username='${username}'`);
    }
    ,
    findByEmail(email) {
        return db.query(`select * from ${tableName} where email='${email}'`);
    },
    insertUser(username, password, email) {
        return db.query(`insert into users (username, password, email) values ($1, $2, $3)`, [username, password, email]);
    }
}