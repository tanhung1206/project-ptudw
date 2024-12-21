const db = require("../db/db");
const tableName = "Users";
module.exports = {
    async findById(id) {
        const result = await db.query(`select * from ${tableName} where userid='${id}'`);
        return result.rows;
    },
    async findByUserName(username) {
        const result = await db.query(`select * from ${tableName} where username='${username}'`);
        return result.rows;
    },
    async findByEmail(email) {
        const result = await db.query(`select * from ${tableName} where email='${email}'`);
        return result.rows;
    },
    async insertUser(username, password, email) {
        const result = db.query(`insert into users (username, password, email, avatar) values ($1, $2, $3, $4)`, [username, password, email, '/img/default-avatar.png']);
        return result.rowCount;
    }
}