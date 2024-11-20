const express = require('express');
const router = express.Router();
const usersModel = require('../models/usersModel');
const bcrypt = require('bcryptjs');

// GET /login - Render the login page
router.get('/', (req, res) => {
    res.render('login', {
        title: 'Login',
        message: 'Login',
        currentPage: 'login',
        errorMessage: req.query.error || null,
    });
});

// POST /login - Handle login form submission
router.post('/', async (req, res) => {
    const { username, password } = req.body;

    try {
        if (!username || !password) {
            return res.render('login', {
                title: 'Login',
                message: 'Login',
                currentPage: 'login',
                errorMessage: 'Username and password are required.',
            });
        }

        const userResult = await usersModel.findByUserName(username);
        if (userResult.rows.length === 0) {
            return res.render('login', {
                title: 'Login',
                message: 'Login',
                currentPage: 'login',
                errorMessage: 'Invalid username or password.',
            });
        }

        const user = userResult.rows[0];
        const isMatch = await bcrypt.compare(password, user.password);
        if (!isMatch) {
            return res.render('login', {
                title: 'Login',
                message: 'Login',
                currentPage: 'login',
                errorMessage: 'Invalid username or password.',
            });
        }

        req.session.user = {
            id: user.id,
            username: user.username,
            avatar: user.avatar || '/img/default-avatar.png',
        };

        return res.redirect('/');
    } catch (error) {
        console.error('Login Error:', error);
        return res.status(500).render('login', {
            title: 'Login',
            message: 'Login',
            currentPage: 'login',
            errorMessage: 'An error occurred. Please try again later.',
        });
    }
});

// GET /logout - Handle logout
router.get('/logout', (req, res) => {
    req.session.destroy((err) => {
        if (err) {
            console.error('Logout Error:', err);
            return res.redirect('/');
        }
        res.redirect('/login');
    });
});

module.exports = router;
