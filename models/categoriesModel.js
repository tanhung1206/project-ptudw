const db = require("../db/db");
const tableName = "Categories";
module.exports = {
    findAll() {
        return db.query(`select * from ${tableName}`);
    }
    
}