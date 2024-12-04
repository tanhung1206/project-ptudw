const express = require('express');
const router = express.Router();
const cartModel = require("../models/cartModel");
// Route trang About

router.get('/', async (req, res) => {

    res.render('cart', {
        title: 'Shopping Cart',
        message: 'Shopping Cart',
        currentPage: 'pages',
    });
});

router.post("/", async (req, res) => {
    const productid = req.body.productid;
    const quantity = req.body.quantity;
    await cartModel.addOrUpdate(req.user.userid, productid, quantity);
    res.json(true);
})

router.put("/", async (req, res) => {
    const productid = req.body.productid;
    const quantity = req.body.quantity;
    await cartModel.update(req.user.userid, productid, quantity);
    res.json(true);
})

router.delete("/",async (req,res)=>{
    const productid = req.body.productid;
    await cartModel.delete(req.user.userid, productid);
    res.json(true);
})

module.exports = router;