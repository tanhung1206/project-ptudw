const db = require("../db/db");
const tableName = "Cart";
module.exports = {
    async addOrUpdate(userId, productId, quantity) {
        try {
            const selectQuery = `
            SELECT quantity FROM cardproducts
            WHERE userid = $1 AND productid = $2
          `;
            const selectResult = await db.query(selectQuery, [userId, productId]);
            if (selectResult.rowCount > 0) {
                const updateQuery = `
              UPDATE cardproducts
              SET quantity = quantity + $3
              WHERE userid = $1 AND productid = $2
            `;
                console.log("1");
                await db.query(updateQuery, [userId, productId, quantity]);
            } else {
                console.log("2");
                const insertQuery = `
              INSERT INTO cardproducts (userid, productid, quantity)
              VALUES ($1, $2, $3)
            `;
                await db.query(insertQuery, [userId, productId, quantity]);
            }
        }
        catch (e) {
            console.log("3");
            console.log(e);
        }
    },
    async findByUserId(userid) {
        const result = await db.query(`
            SELECT cp.productid, cp.quantity, p.price,p.imagepath,p.name
            FROM cardproducts cp
            JOIN products p ON cp.productid = p.productid
            WHERE cp.userid = $1`, [userid]);
        return result.rows;
    },
    async update(userId, productId, quantity) {
        const updateQuery = `
        UPDATE cardproducts
        SET quantity = $3
        WHERE userid = $1 AND productid = $2`;
        await db.query(updateQuery, [userId, productId, quantity]);
    }
    ,
    async delete(userId, productId) {
        const query = `
        DELETE FROM cardproducts
        WHERE userid = $1 AND productid = $2
        `;
        await db.query(query, [userId, productId]);
    }

}