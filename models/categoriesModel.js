const db = require("../db/db");
const tableName = "Categories";
module.exports = {
    findAll() {
        return db.query(`select * from ${tableName}`);
    },
    findAllWithCount() {
        return db.query(`select c.*, count(p.productid) as total from ${tableName} c left join products p on c.categoryid=p.categoryid group by c.categoryid order by c.categoryid`);
    }
}