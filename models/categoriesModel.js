const db = require("../db/db");
const tableName = "Categories";
module.exports = {
    async findAll() {
        const result=await db.query(`select * from ${tableName}`);
        return result.rows;
    },
    async findAllWithCount() {
        const result=await db.query(`select c.*, count(p.productid) as total from ${tableName} c left join products p on c.categoryid=p.categoryid group by c.categoryid order by c.categoryid`);
        return result.rows;
    }
}