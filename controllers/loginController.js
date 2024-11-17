const express = require('express');
const router = express.Router();

// Route trang About
router.get('/', (req, res) => {
    res.render('login', {
        title: 'Login',
        message: 'Login',
        currentPage: 'login'
    });
});

module.exports = router;