const db = require("../db/db");
const { findAll } = require("./productsModel");
const tableName = "CardProducts";

module.exports = {
    insertCartProduct(productid, quantity, userid) {
        return db.query(`select * from ${tableName} where userid = $1 and productid = $2`, [userid, productid])
            .then(result => {
                if (result.rows.length > 0) {
                    return db.query(`update ${tableName} set quantity = quantity + $1 where userid = $2 and productid = $3`, [quantity, userid, productid]);
                } else {
                    return db.query(`insert into ${tableName} (productid, quantity, userid) values ($1, $2, $3)`, [productid, quantity, userid]);
                }
            });
    },
    findAll(userid) {
        return db.query(`select p.*, cp.quantity from ${tableName} cp join products p on cp.productid = p.productid where cp.userid = $1`, [userid]);
    },
    findAllWithProductDetails(userid) {
        return db.query(`select p.productid, p.name, p.price, p.imagepath, cp.quantity, (p.price * cp.quantity) as total from ${tableName} cp join products p on cp.productid = p.productid where cp.userid = $1 order by cp.id`, [userid]);
    },
    getQuantity(userid) {
        return db.query(`select sum(quantity) as total from ${tableName} where userid = $1`, [userid]);
    },
    removeCartProduct(productid, userid) {
        return db.query(`delete from ${tableName} where userid = $1 and productid = $2`, [userid, productid]);
    }
}