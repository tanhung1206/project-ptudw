const db = require("../db/db");
const tableName = "Cart";
module.exports = {
    async addOrUpdate(userId, productId, quantity) {
        const selectQuery = `
        SELECT quantity FROM cartproducts
        WHERE userid = $1 AND productid = $2
        `;
        const selectResult = await db.query(selectQuery, [userId, productId]);
        if (selectResult.rowCount > 0) {
            const updateQuery = `
            UPDATE cartproducts
            SET quantity = quantity + $3
            WHERE userid = $1 AND productid = $2
        `;
            const updateResult = await db.query(updateQuery, [userId, productId, quantity]);
            return updateResult.rowCount;
        } else {
            const insertQuery = `
            INSERT INTO cartproducts (userid, productid, quantity)
            VALUES ($1, $2, $3)
        `;
            const insertResult = await db.query(insertQuery, [userId, productId, quantity]);
            return insertResult.rowCount;
        }
    },
    async findByUserId(userid) {
        const result = await db.query(`
            SELECT cp.productid, cp.quantity, p.price,p.imagepath,p.name
            FROM cartproducts cp
            JOIN products p ON cp.productid = p.productid
            WHERE cp.userid = $1`, [userid]);
        return result.rows;
    },
    async update(userId, productId, quantity) {
        const updateQuery = `
        UPDATE cartproducts
        SET quantity = $3
        WHERE userid = $1 AND productid = $2`;
        const result = await db.query(updateQuery, [userId, productId, quantity]);
        return result.rowCount;
    },
    async delete(userId, productId) {
        const query = `
        DELETE FROM cartproducts
        WHERE userid = $1 AND productid = $2
        `;
        const result = await db.query(query, [userId, productId]);
        return result.rowCount;
    },
    async deleteAll(userId) {
        const query = `
        DELETE FROM cartproducts
        WHERE userid = $1
        `;
        const result = await db.query(query, [userId]);
        return result.rowCount;
    }
}