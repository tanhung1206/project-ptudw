const express = require('express');
const router = express.Router();
const addressesModel = require("../models/addressesModel");
const ordersModel = require("../models/ordersModel");
const cartModel = require("../models/cartModel");

// Route trang About
router.get('/', (req, res) => {
    res.render('checkout', {
        title: 'Checkout',
        message: 'Checkout',
        currentPage: 'pages'
    });
});

router.post("/", async (req, res) => {
    const fullname = req.body.fullname;
    const email = req.body.email;
    const phone = req.body.phone;
    const address = req.body.address;
    const zip = req.body.zip;
    const total = req.body.total;

    const addressid = await addressesModel.addOrUpdate({ fullname, email, phone, address, zip });
    const orderid = await ordersModel.add({ userid: req.user.userid, addressid, total });

    cartModel.findByUserId(req.user.userid).then(cart => {
        cart.forEach(item => {
            const res = ordersModel.addOrderDetail(orderid, item.productid, item.quantity);
        });
        cartModel.deleteAll(req.user.userid);
    });
});

module.exports = router;