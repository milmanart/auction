const express = require('express');
const router = express.Router();
const bcrypt = require('bcryptjs');
const User = require('../models/User');
const { ensureAuthenticated } = require('../config/auth');

router.get('/login', (req, res) => res.render('login', { errors: [] }));

router.get('/register', (req, res) => res.render('register', { errors: [] }));

router.post('/register', async (req, res) => {
    const { username, email, password, password2, isAdmin } = req.body;
    let errors = [];

    if (!username || !email || !password || !password2) {
        errors.push({ msg: 'Proszę wypełnić wszystkie pola' });
    }

    if (password !== password2) {
        errors.push({ msg: 'Hasła nie pasują do siebie' });
    }

    if (password.length < 6) {
        errors.push({ msg: 'Hasło musi mieć co najmniej 6 znaków' });
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
                errors.push({ msg: 'Email już istnieje' });
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
                    isAdmin: isAdmin === 'on'
                });
                const salt = await bcrypt.genSalt(10);
                newUser.password = await bcrypt.hash(password, salt);
                await newUser.save();
                req.session.user = newUser;
                res.redirect('/');
            }
        } catch (err) {
            console.error(err);
            res.status(500).send('Błąd serwera');
        }
    }
});

router.post('/login', async (req, res) => {
    const { email, password } = req.body;
    let errors = [];

    if (!email || !password) {
        errors.push({ msg: 'Proszę wypełnić wszystkie pola' });
        res.render('login', { errors, email, password });
    } else {
        try {
            const user = await User.findOne({ email });
            if (!user) {
                errors.push({ msg: 'Email nie jest zarejestrowany' });
                res.render('login', { errors, email, password });
            } else {
                const isMatch = await bcrypt.compare(password, user.password);
                if (isMatch) {
                    req.session.user = user;
                    res.redirect('/');
                } else {
                    errors.push({ msg: 'Nieprawidłowe hasło' });
                    res.render('login', { errors, email, password });
                }
            }
        } catch (err) {
            console.error(err);
            res.status(500).send('Błąd serwera');
        }
    }
});

router.get('/dashboard', ensureAuthenticated, (req, res) =>
    res.render('dashboard', {
        user: req.session.user
    })
);

router.get('/logout', (req, res) => {
    req.session.destroy(err => {
        if (err) {
            console.log(err);
        }
        res.redirect('/auth/login');
    });
});

module.exports = router;
