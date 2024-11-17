const express = require('express');
const router = express.Router();
const usersModel = require("../models/usersModel");
const bcrypt = require("bcryptjs");

// Route trang About
router.get('/', (req, res) => {
    res.render('register', {
        title: 'Register',
        message: 'Register',
        currentPage: 'register'
    });
});

router.post("/", async (req, res) => {
    // console.log(req.body);
    const usersname = (await usersModel.findByUserName(req.body.username)).rows[0];
    const email = (await usersModel.findByEmail(req.body.email)).rows[0];
    let usernameError = "";
    if (usersname) {
        usernameError = "Username is exist";
    }
    let emailError = "";
    if (email) {
        emailError = "Email is exist";
    }
    let success = false;

    if (!usersname && !email) {
        const hashedPassword = await bcrypt.hash(req.body.password, 8);
        await usersModel.insertUser(req.body.username, hashedPassword, req.body.email);
        success = true;
    }
    res.render('register', {
        title: 'Register',
        message: 'Register',
        currentPage: 'register',
        usernameError,
        emailError,
        success,
    });
})

module.exports = router;