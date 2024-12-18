const express = require('express');
const router = express.Router();
const usersModel = require('../models/usersModel');
const bcrypt = require('bcryptjs');
const passport = require("passport");

// GET /login - Render the login page
router.get('/login', (req, res) => {
    res.render('login', {
        title: 'Login',
        message: 'Login',
        currentPage: 'login',
        errorMessage: req.query.error || null,
    });
});

// GET /user/register - Render the registration page
router.get('/register', (req, res) => {
    res.render('register', {
        title: 'Register',
        message: 'Register',
        currentPage: 'register',
    });
});

// POST /login - Handle login form submission

router.post("/login", (req, res, next) => {
    passport.authenticate("local", (error, user, info) => {
        if (error) {
            console.error('Login Error:', error);
            return res.status(500).render('login', {
                title: 'Login',
                message: 'Login',
                currentPage: 'login',
                errorMessage: info,
            });
        }
        else {
            if (!user) {
                return res.render('login', {
                    title: 'Login',
                    message: 'Login',
                    currentPage: 'login',
                    errorMessage: info,
                });
            }
            else{
                req.logIn(user,(err)=>{
                    return res.redirect('/');
                });
            }
        }
    })(req, res, next);
})


// GET /logout - Handle logout
router.get("/logout",(req,res)=>{
    req.logOut((err)=>{
        res.redirect('/user/login');
    })
})

router.get("/profile",require("../middlewares/restrict"),(req,res)=>{
    res.render("profile",{
        layout:"index-layout"
    });
})


const isPasswordComplex = (password) => {
    const complexityRegex = /^(?=.*\d)(?=.*[a-z])(?=.*[A-Z])(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,}$/;
    return complexityRegex.test(password);
};

router.get('/register', (req, res) => {
    res.render('register', {
        title: 'Register',
        message: 'Register',
        currentPage: 'register'
    });
});

router.post("/register", async (req, res) => {
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
