const express = require('express');
const router = express.Router();
const productsModel = require("../models/productsModel");
const categoriesModel = require("../models/categoriesModel");
const manufacturersModel = require("../models/manufacturersModel");

// Route trang Home
router.get('/', async (req, res) => {
    // const products = (await productsModel.findAll()).rows;
    const trendyProducts = (await productsModel.findTrendy(10)).rows;
    const justArrivedProducts = (await productsModel.findJustArrived(10)).rows;
    const categories = (await categoriesModel.findAllWithCount()).rows;

    res.render('index', {
        layout: 'index-layout', // Sử dụng layout khác cho trang Home
        currentPage: 'home',
        trendyProducts,
        justArrivedProducts,
        categories
        // justArrivedProducts
    });
});

module.exports = router;