const express = require('express');
const router = express.Router();

// Route trang Contact
router.get('/', (req, res) => {
    res.render('contact', {
        title: 'Contact Us',
        message: 'Contact',
        currentPage: 'contact'
    });
});

module.exports = router;