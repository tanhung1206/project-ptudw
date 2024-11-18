const db = require("../db/db");
const tableName = "Manufacturers"
module.exports = {
    findAll() {
        return db.query(`select * from ${tableName}`);
    }
}