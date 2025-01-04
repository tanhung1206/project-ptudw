const db = require("../db/db");
const tableName = "addresses";

module.exports = {
    async addOrUpdate(address) {
        const selectQuery = `
        SELECT addressid FROM ${tableName}
        WHERE email = $1 AND phone = $2
        `;
        const selectResult = await db.query(selectQuery, [address.email, address.phone]);
        if (selectResult.rowCount > 0) {
            const updateQuery = `
            UPDATE ${tableName}
            SET fullname = $1, address = $2, zipcode = $3
            WHERE email = $4 AND phone = $5
            `;
            const updateResult = await db.query(updateQuery, [address.fullname, address.address, address.zip, address.email, address.phone]);
            return updateResult.rowCount;
        } else {
            const insertQuery = `
            INSERT INTO ${tableName} (fullname, email, phone, address, zipcode)
            VALUES ($1, $2, $3, $4, $5)
            `;
            const insertResult = await db.query(insertQuery, [address.fullname, address.email, address.phone, address.address, address.zip]);
            return insertResult.rowCount;
        }
    }
}