const express = require('express');
const router = express.Router();
const productsModel = require("../models/productsModel");
const categoriesModel = require("../models/categoriesModel");
const manufacturesModel = require("../models/manufacturesModel");


// Route trang About
router.get('/', async (req, res) => {
    const categoryId = +req.query.categories || 0;
    const manufactureId = +req.query.manufactures || 0;
    const stars = +req.query.manufactures || 0;
    const [{ rows: products }, { rows: categories }, { rows: manufactures }] = await Promise.all([productsModel.findAll(), categoriesModel.findAll(), manufacturesModel.findAll()]);
    res.render('products', {
        title: 'Our Shop',
        message: 'Shop',
        currentPage: 'shop',
        products,
        categories,
        manufactures
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