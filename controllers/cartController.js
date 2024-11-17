const express = require('express');
const router = express.Router();

// Route trang About
router.get('/', (req, res) => {
    res.render('cart', {
        title: 'Shopping Cart',
        message: 'Shopping Cart',
        currentPage: 'pages'
    });
});

module.exports = router;