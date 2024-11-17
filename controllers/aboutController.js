const express = require('express');
const router = express.Router();

// Route trang About
router.get('/', (req, res) => {
    res.render('about', {
        title: 'About Us',
        message: 'About',
        currentPage: 'about'
    });
});

module.exports = router;