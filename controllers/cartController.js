const express = require('express');
const router = express.Router();
const cartsModel = require("../models/cartsModel");

// Route trang About
router.get('/', async (req, res) => {
    const userid = req.user.userid;
    const products = (await cartsModel.findAllWithProductDetails(userid)).rows;
    console.log(products);

    res.render('cart', {
        title: 'Shopping Cart',
        message: 'Shopping Cart',
        currentPage: 'pages',
        products,
    });
});

router.post('/add', (req, res) => {
    const id = +req.body.id;
    const quantity = +req.body.quantity;
    const userid = req.user.userid;
    cartsModel.insertCartProduct(id, quantity, userid);
    res.send(`Product ${id} has been added to cart for user ${userid} with quantity ${quantity}`);
});

module.exports = router;