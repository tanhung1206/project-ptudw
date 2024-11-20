const express = require('express');
const router = express.Router();
const usersModel = require("../models/usersModel");
const bcrypt = require("bcryptjs");

const isPasswordComplex = (password) => {
    const complexityRegex = /^(?=.*\d)(?=.*[a-z])(?=.*[A-Z])(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,}$/;
    return complexityRegex.test(password);
};

router.get('/', (req, res) => {
    res.render('register', {
        title: 'Register',
        message: 'Register',
        currentPage: 'register'
    });
});

router.post("/", async (req, res) => {
    try {
        const { username, email, password, confirmPassword } = req.body;

        const usernameExists = (await usersModel.findByUserName(username)).rows[0];
        const emailExists = (await usersModel.findByEmail(email)).rows[0];

        const errors = {
            usernameError: usernameExists ? "Username already exists" : "",
            emailError: emailExists ? "Email already exists" : "",
            passwordError: !isPasswordComplex(password)
                ? "Password must be at least 8 characters long and include uppercase, lowercase, a number, and a special character."
                : "",
            confirmPasswordError: password !== confirmPassword ? "Passwords do not match." : "",
        };

        if (Object.values(errors).some((err) => err)) {
            return res.render("register", {
                title: "Register",
                message: "Register",
                currentPage: "register",
                ...errors,
                success: false,
            });
        }

        const hashedPassword = await bcrypt.hash(password, 8);
        await usersModel.insertUser(username, hashedPassword, email);

        res.render("register", {
            title: "Register",
            message: "Register",
            currentPage: "register",
            success: true,
        });
    } catch (error) {
        console.error("Registration Error: ", error);
        res.status(500).render("register", {
            title: "Register",
            message: "An error occurred. Please try again later.",
            currentPage: "register",
            success: false,
        });
    }
});

module.exports = router;
