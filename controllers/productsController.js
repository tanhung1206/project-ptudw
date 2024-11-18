const express = require('express');
const router = express.Router();
const productsModel = require("../models/productsModel");
const categoriesModel = require("../models/categoriesModel");
const manufacturesModel = require("../models/manufacturesModel");

const limit = 1;
// Route trang About
router.get('/', async (req, res) => {
    // const bla = new URLSearchParams(req.query).toString();
    // console.log(bla);
    const curPage = +req.query.page || 1;
    // console.log(page)
    const offset = (curPage - 1) * limit
    const categoryId = +req.query.categoryId;
    const manufactureId = +req.query.manufactureId;
    const stars = +req.query.stars;
    let condition = [];
    let query = {};
    if (categoryId) {
        query = { ...query, categoryId };
        condition.push(`categoryId=${categoryId}`);
    }
    if (manufactureId) {
        query = { ...query, manufactureId };
        condition.push(`manufactureId=${manufactureId}`);
    }
    if (stars) {
        query = { ...query, stars };
        condition.push(`stars=${stars}`);
    }
    query = new URLSearchParams(query).toString()
    // console.log(`query: ${query}`);
    // console.log(`condition:${condition.join(" and ")}`);
    condition = condition.join(" and ");
    const [productsResult, categoriesResult, manufacturesResult, totalResult] = await Promise.all([
        productsModel.filterByCondition(condition, limit, offset),
        categoriesModel.findAll(),
        manufacturesModel.findAll(),
        productsModel.countAll()]);
    const products = productsResult.rows;
    const categories = categoriesResult.rows;
    const manufactures = manufacturesResult.rows;
    const totalPages = +totalResult.rows[0].total;
    // const totalPages = 9;
    const numPages = Math.ceil(totalPages / limit);
    const prevPage = curPage - 1 >= 1 ? curPage - 1 : undefined;
    const nextPage = curPage + 1 <= totalPages ? curPage + 1 : undefined;
    res.render('products', {
        title: 'Our Shop',
        message: 'Shop',
        currentPage: 'shop',
        products,
        categories,
        manufactures,
        numPages,
        curPage,
        categoryId,
        manufactureId,
        stars,
        query,
        prevPage,
        nextPage,
        totalPages
    });
    // }
});

router.get('/:id', async (req, res) => {
    const id = +req.params.id;
    const product = (await productsModel.findOne(id)).rows[0];
    console.log(id, product);
    res.render('detail', {
        title: 'Shop Detail',
        message: 'Shop Detail',
        currentPage: 'shop',
        product
    });
});

module.exports = router;