const express = require('express');
const router = express.Router();
const productsModel = require("../models/productsModel");
const { pagination,prices } = require("../config/config");
const order={
    name:"name",
    creationtime:"createdat",
    price:"price"
}

router.get('/', async (req, res) => {
    const curPage = +req.query.page || 1;
    const categoryId = +req.query.categoryId;
    const manufacturerId = +req.query.manufacturerId;
    const stars = +req.query.stars;
    const name = req.query.name;
    const price = +req.query.price;
    const sort=req.query.sort;

    const offset = (curPage - 1) * pagination.limit
  
    const aQuery = [];
    const aCondition = [];
    if (name) {
        aQuery.push(`name=${name}`);
        aCondition.push(`name ilike '%${name}%'`);
    }
    if (categoryId) {
        aQuery.push(`categoryId=${categoryId}`);
        aCondition.push(`categoryId=${categoryId}`);
    }
    if (manufacturerId) {
        aQuery.push(`manufacturerId=${manufacturerId}`);
        aCondition.push(`manufacturerId=${manufacturerId}`);
    }
    if (stars) {
        aQuery.push(`stars=${stars}`);
        aCondition.push(`stars=${stars}`);
    }
    if (price >= 0) {
        aQuery.push(`price=${price}`);
        if (price == 3) {

            aCondition.push(`price >= ${prices[price].from}`)
        }
        else {
            aCondition.push(`price between ${prices[price].from} and ${prices[price].to}`);
        }
    }
    if(sort){
        aQuery.push(`sort=${sort}`);
    }
    const query = aQuery.join("&");
    const condition = aCondition.join(" and ");


    const [products, totalResult] = await Promise.all([
        productsModel.filterByCondition(condition, pagination.limit, offset,order[sort]||"productid"),
        productsModel.countByCondition(condition)]);

    const totalPages = Math.ceil(+totalResult[0].total / pagination.limit);
    const prevPage = curPage - 1 >= 1 ? curPage - 1 : undefined;
    const nextPage = curPage + 1 <= totalPages ? curPage + 1 : undefined;
    res.send({
        products,
        totalPages,
        prevPage,
        nextPage,
        curPage,
        query
    });
});

module.exports = router;