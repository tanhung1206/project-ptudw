const db = require("../db/db");
const tableName = "Manufactures"
module.exports = {
    findAll() {
        return db.query(`select * from ${tableName}`);
    }
}