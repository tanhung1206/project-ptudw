const db = require("../db/db");
const { findById } = require("./usersModel");
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
    },
    async findById(orderid) {
        const query = `
        SELECT p.name, p.price, o.quantity, (p.price * o.quantity) AS totalprice
        FROM orderdetails o
        JOIN products p ON o.productid = p.productid
        WHERE orderid = $1
        `;
        const result = await db.query(query, [orderid]);
        return result.rows;
    },
    async findAll(userid) {
        const query = `
        SELECT o.orderid, o.createdat, 
        CASE 
            WHEN o.status = 0 THEN 'Pending'
            WHEN o.status = 1 THEN 'Processing'
            WHEN o.status = 2 THEN 'Completed'
            WHEN o.status = 3 THEN 'Cancelled'
            ELSE 'Unknown'
        END AS status, 
        o.total
        FROM orders o
        JOIN users u ON o.userid = u.userid
        WHERE u.userid = $1
        ORDER BY o.createdat DESC
        `;
        const result = await db.query(query, [userid]);
        return result.rows;
    },
}