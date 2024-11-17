const express = require('express');
const router = express.Router();

// Route trang About
router.get('/', (req, res) => {
    res.render('checkout', {
        title: 'Checkout',
        message: 'Checkout',
        currentPage: 'pages'
    });
});

module.exports = router;