const express = require('express');
const router = express.Router();
const ordersModel = require("../models/ordersModel");
const { get } = require('http');

const orders = [
    {
        orderid: 12345,
        createdat: '2023-10-01',
        status: 'Shipped',
        total: 150.00,
        products: [
            { name: 'Product 1', price: 50.00, quantity: 1, totalPrice: 50.00 },
            { name: 'Product 2', price: 100.00, quantity: 1, totalPrice: 100.00 }
        ]
    },
    {
        orderid: 67890,
        createdat: '2023-10-02',
        status: 'Processing',
        total: 200.00,
        products: [
            { name: 'Product 3', price: 200.00, quantity: 1, totalPrice: 200.00 }
        ]
    }
];

router.get('/order/:id', async (req, res) => {
    const orderId = req.params.id;
    const userId = req.user.userid;

    const _orders = await ordersModel.findAll(userId);

    const orders = await Promise.all(_orders.map(async order => ({
        orderid: order.orderid,
        createdat: order.createdat,
        status: order.status,
        total: order.total,
        products: (await ordersModel.findById(orderId))
    })));

    order = orders.find(order => order.orderid == orderId);

    if (order) {
        res.json(order);
    } else {
        res.status(404).json({ error: 'Order not found' });
    }
});

router.get('/', async (req, res) => {
    const userId = req.user.userid;
    const orders = await ordersModel.findAll(userId);

    res.render('orders', {
        title: 'Orders',
        message: 'Orders',
        currentPage: 'orders',
        orders: orders
    });
});

module.exports = router;