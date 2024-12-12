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
    const rowCount=await cartModel.addOrUpdate(req.user.userid, productid, quantity);
    res.json({rowCount});
})

router.put("/", async (req, res) => {
    const productid = req.body.productid;
    const quantity = req.body.quantity;
    const rowCount=await cartModel.update(req.user.userid, productid, quantity);
    res.json({rowCount});
})

router.delete("/",async (req,res)=>{
    const productid = req.body.productid;
    const rowCount=await cartModel.delete(req.user.userid, productid);
    res.json({rowCount});
})

module.exports = router;