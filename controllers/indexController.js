const express = require('express');
const router = express.Router();
const users = require('../models/data');

// Route trang Home
router.get('/', (req, res) => {
    res.render('index', {
        layout: 'index-layout', // Sử dụng layout khác cho trang Home
        currentPage: 'home'
    });
});

module.exports = router;