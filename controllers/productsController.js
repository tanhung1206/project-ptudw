const express = require('express');
const router = express.Router();
const productsModel = require("../models/productsModel");
const categoriesModel = require("../models/categoriesModel");
const manufacturesModel = require("../models/manufacturesModel");

const limit = 1;
// Route trang About
router.get('/', async (req, res) => {
    const curPage = +req.query.page || 1;
    const categoryId = +req.query.categoryId;
    const manufactureId = +req.query.manufactureId;
    const stars = +req.query.stars;

    const offset = (curPage - 1) * limit

    const queryParams=[]
    if (categoryId) {
        queryParams.push(`categoryId=${categoryId}`);
    }
    if (manufactureId) {
        queryParams.push(`manufactureId=${manufactureId}`);
    }
    if (stars) {
        queryParams.push(`stars=${stars}`);
    }

    const query =queryParams.join("&");
    const condition = queryParams.join(" and ");

    console.log(condition)

    const [productsResult, categoriesResult, manufacturesResult, totalResult] = await Promise.all([
        productsModel.filterByCondition(condition, limit, offset),
        categoriesModel.findAll(),
        manufacturesModel.findAll(),
        productsModel.countByCondition(condition)]);

    const products = productsResult.rows;
    const categories = categoriesResult.rows;
    const manufactures = manufacturesResult.rows;
    const totalPages = +totalResult.rows[0].total;
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