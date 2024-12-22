const db = require("../db/db");
const tableName = "Products";
module.exports = {
    async findAll() {
        const result = await db.query(`select * from ${tableName}`);
        return result.rows;
    },
    async findOne(id) {
        const result = await db.query(`select * from ${tableName} where productid=${id}`);
        return result.rows;
    },
    async findByCatId(id) {
        const result = await db.query(`select * from ${tableName} where categoryid=${id}`);
        return result.rows;
    },
    async filterByCondition(condition, limit, offset, order = "productid") {
        let result;
        if (condition) {
            result = await db.query(`select * from ${tableName} where ${condition} order by ${order} limit ${limit} offset ${offset}`);
        }
        else {
            result = await db.query(`select * from ${tableName} order by ${order} limit ${limit} offset ${offset}`);
        }
        return result.rows;
    },
    async countAll() {
        const result = await db.query(`select count(*) as total from ${tableName}`);
        return result.rows;
    },
    async countByCondition(codition) {
        let result;
        if (codition) {
            result = await db.query(`select count(*) as total from ${tableName} where ${codition}`)
        }
        else {
            result = await db.query(`select count(*) as total from ${tableName}`)
        }
        return result.rows;
    },
    async findRelated(id, categoryId, limit) {
        const result = await db.query(`select * from ${tableName} where productid<>${id} and categoryid=${categoryId} order by random() limit ${limit}`);
        return result.rows;
    },
    async findTrendy(limit) {
        const result = await db.query(`select * from ${tableName} where sold_quantity is not null order by sold_quantity desc limit ${limit}`);
        return result.rows;
    },
    async findJustArrived(limit) {
        const result = await db.query(`select * from ${tableName} where createdat is not null order by createdat desc limit ${limit}`);
        return result.rows;
    },
    async findAllReviews(id) {
        const result = await db.query(`
            select r.*, u.username, u.avatar
            from reviews r
            join users u
            on r.userid = u.userid 
            where r.productid=${id}
            order by r.createdat desc, r.reviewid desc`
        );
        return result.rows;
    },
    async addReview(productid, userid, stars, review) {
        const now = new Date(new Date().getTime() + 7 * 60 * 60 * 1000).toISOString().split('T')[0];
        const result = await db.query(`insert into reviews(productid, userid, stars, review, createdat) values(${productid}, ${userid}, ${stars}, '${review}', '${now}')`);
        return result;
    },
    async findReviewPage(id, limit, offset) {
        const result = await db.query(`
            select r.*, u.username, u.avatar
            from reviews r
            join users u
            on r.userid = u.userid 
            where r.productid=${id}
            order by r.createdat desc, r.reviewid desc
            limit ${limit} offset ${offset}`
        );
        return result.rows;
    },
    async countReviews(id) {
        const result = await db.query(`select count(*) as total from reviews where productid=${id}`);
        return result.rows;
    },
    async averageStar(id) {
        const result = await db.query(`select avg(stars) as average from reviews where productid=${id}`);
        return result.rows;
    }
}