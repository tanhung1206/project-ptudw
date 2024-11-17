const db = require("../db/db");
const tableName = "Products";
module.exports = {
    findAll() {
        return db.query(`select * from ${tableName}`);
    },
    findOne(id) {
        return db.query(`select * from ${tableName} where id=${id}`);
    },
    findByCatId(id) {
        return db.query(`select * from ${tableName} where categoryid=${id}`);
    }
}