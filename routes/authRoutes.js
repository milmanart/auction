const express = require('express');
const router = express.Router();
const bcrypt = require('bcryptjs');
const User = require('../models/User');
const { ensureAuthenticated } = require('../config/auth');

// Login Page
router.get('/login', (req, res) => res.render('login', { errors: [] }));

// Register Page
router.get('/register', (req, res) => res.render('register', { errors: [] }));

// Register
router.post('/register', async (req, res) => {
    const { username, email, password, password2, isAdmin } = req.body;
    let errors = [];

    if (!username || !email || !password || !password2) {
        errors.push({ msg: 'Please enter all fields' });
    }

    if (password !== password2) {
        errors.push({ msg: 'Passwords do not match' });
    }

    if (password.length < 6) {
        errors.push({ msg: 'Password must be at least 6 characters' });
    }

    if (errors.length > 0) {
        res.render('register', {
            errors,
            username,
            email,
            password,
            password2,
            isAdmin
        });
    } else {
        try {
            let user = await User.findOne({ email });
            if (user) {
                errors.push({ msg: 'Email already exists' });
                res.render('register', {
                    errors,
                    username,
                    email,
                    password,
                    password2,
                    isAdmin
                });
            } else {
                const newUser = new User({
                    username,
                    email,
                    password,
                    isAdmin: isAdmin === 'on' // Проверка состояния чекбокса
                });
                const salt = await bcrypt.genSalt(10);
                newUser.password = await bcrypt.hash(password, salt);
                await newUser.save();
                req.flash('success_msg', 'You are now registered and can log in');
                res.redirect('/auth/login');
            }
        } catch (err) {
            console.error(err);
            res.status(500).send('Server error');
        }
    }
});

// Login
router.post('/login', async (req, res) => {
    const { email, password } = req.body;
    let errors = [];

    if (!email || !password) {
        errors.push({ msg: 'Please enter all fields' });
        res.render('login', { errors, email, password });
    } else {
        try {
            const user = await User.findOne({ email });
            if (!user) {
                errors.push({ msg: 'Email not registered' });
                res.render('login', { errors, email, password });
            } else {
                const isMatch = await bcrypt.compare(password, user.password);
                if (isMatch) {
                    req.session.user = user;
                    res.redirect('/auth/dashboard');
                } else {
                    errors.push({ msg: 'Incorrect password' });
                    res.render('login', { errors, email, password });
                }
            }
        } catch (err) {
            console.error(err);
            res.status(500).send('Server error');
        }
    }
});

// Dashboard
router.get('/dashboard', ensureAuthenticated, (req, res) =>
    res.render('dashboard', {
        user: req.session.user
    })
);

// Logout
router.get('/logout', (req, res) => {
    req.session.destroy(err => {
        if (err) {
            console.log(err);
        }
        res.redirect('/auth/login');
    });
});

module.exports = router;
