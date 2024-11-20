const db = require("../db/db");
const tableName = "Products";
module.exports = {
    findAll() {
        return db.query(`select * from ${tableName}`);
    },
    findOne(id) {
        return db.query(`select * from ${tableName} where productid=${id}`);
    },
    findByCatId(id) {
        return db.query(`select * from ${tableName} where categoryid=${id}`);
    },
    filterByCondition(condition, limit, offset) {
        if (condition) return db.query(`select * from ${tableName} where ${condition} limit ${limit} offset ${offset}`);
        return db.query(`select * from ${tableName} limit ${limit} offset ${offset}`);
    },
    countAll() {
        return db.query(`select count(*) as total from ${tableName}`);
    },
    countByCondition(codition) {
        if (codition) return db.query(`select count(*) as total from ${tableName} where ${codition}`);
        else return db.query(`select count(*) as total from ${tableName}`);
    },
    findRelated(id, categoryId, limit) {
        return db.query(`select * from ${tableName} where productid<>${id} and categoryid=${categoryId} order by random() limit ${limit}`);
    }
}