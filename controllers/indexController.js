const express = require('express');
const router = express.Router();
const productsModel = require("../models/productsModel");
const categoriesModel = require("../models/categoriesModel");
const manufacturersModel = require("../models/manufacturersModel");

// Route trang Home
router.get('/', async (req, res) => {
    const [trendyProducts,justArrivedProducts,categories]=await Promise.all([
        productsModel.findTrendy(10),
        productsModel.findJustArrived(10),
        categoriesModel.findAllWithCount()
    ]);

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