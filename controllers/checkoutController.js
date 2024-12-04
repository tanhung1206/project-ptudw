const express = require('express');
const router = express.Router();
const cartsModel = require("../models/cartsModel");

// Route trang About
router.get('/', async (req, res) => {
    const userid = req.user.userid;
    const products = (await cartsModel.findAllWithProductDetails(userid)).rows;

    const subtotal = products.reduce((sum, product) => sum + product.total, 0);
    const shipping = 10;
    const grandtotal = subtotal + shipping;

    res.render('checkout', {
        title: 'Checkout',
        message: 'Checkout',
        currentPage: 'pages',
        products,
        subtotal,
        shipping,
        grandtotal,
    });
});

module.exports = router;