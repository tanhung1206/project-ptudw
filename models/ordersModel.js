const db = require("../db/db");
const tableName = "orders";

module.exports = {
    async add(order) {
        const query = `
        INSERT INTO ${tableName} (userid, addressid, total)
        VALUES ($1, $2, $3)
        RETURNING orderid
        `;
        const result = await db.query(query, [order.userid, order.addressid, order.total]);
        return result.rows[0].orderid;
    },
    async addOrderDetail(orderid, productid, quantity) {
        const query = `
        INSERT INTO orderdetails (orderid, productid, quantity)
        VALUES ($1, $2, $3)
        `;
        const result = await db.query(query, [orderid, productid, quantity]);
        return result.rowCount;
    }
}