// const express = require("express");
const dotenv = require("dotenv");
const PayOS = require("@payos/node");
const ordersModel = require("../models/ordersModel");
const cartModel = require("../models/cartModel");

const payOS = new PayOS(
    process.env.PAYOS_CLIENT_ID,
    process.env.PAYOS_API_KEY,
    process.env.PAYOS_CHECKSUM_KEY
);

const express = require('express');
const router = express.Router();

// Route trang Payment
router.get('/', (req, res) => {
    res.render('payment', {
        title: 'Payment',
        message: 'Payment',
        currentPage: 'pages',
        carts: res.locals.carts,
        subtotal: res.locals.totalPrices,
    });
});

router.get('/success', async (req, res) => {
    const addressid = 1;
    const total = res.locals.totalPrices + 10;
    const orderid = await ordersModel.add({ userid: req.user.userid, addressid, total });
    cartModel.findByUserId(req.user.userid).then(cart => {
        cart.forEach(item => {
            const res = ordersModel.addOrderDetail(orderid, item.productid, item.quantity);
        });
        cartModel.deleteAll(req.user.userid);
    });

    res.render('paymentSuccess', {
        title: 'Payment Success',
        message: 'Payment Success',
        currentPage: 'pages',
    });
});

router.get('/cancel', (req, res) => {

    res.render('paymentCancel', {
        title: 'Payment Cancel',
        message: 'Payment Cancel',
        currentPage: 'pages',
    });
});

router.post('/create-payment-link', async (req, res) => {
    const YOUR_DOMAIN = req.protocol + '://' + req.get('host');
    const items = res.locals.carts.map(item => {
        return {
            name: item.name,
            quantity: item.quantity,
            price: item.price * 100
        }
    });

    items.push({
        name: "Shipping Fee",
        quantity: 1,
        price: 1000
    });

    const body = {
        orderCode: Number(String(Date.now()).slice(-6)),
        amount: (res.locals.totalPrices + 10) * 100,
        description: "Shopper Order",
        items: items,
        returnUrl: `${YOUR_DOMAIN}/payment/success`,
        cancelUrl: `${YOUR_DOMAIN}/payment/cancel`,
    };

    try {
        const paymentLinkResponse = await payOS.createPaymentLink(body);
        res.redirect(paymentLinkResponse.checkoutUrl);
    } catch (error) {
        console.error(error);
        res.send("Something went error");
    }
});

module.exports = router;