const express = require('express');
const router = express.Router();
const adminController = require('../controllers/adminController');
const { ensureAuthenticated } = require('../config/auth');

// Проверка роли администратора
function ensureAdmin(req, res, next) {
    if (req.session.user && req.session.user.isAdmin) {
        return next();
    }
    req.flash('error_msg', 'Nie masz uprawnień do tej strony');
    res.redirect('/');
}

// Маршруты администратора
router.get('/dashboard', ensureAuthenticated, ensureAdmin, adminController.adminDashboard);
router.get('/users', ensureAuthenticated, ensureAdmin, adminController.getAllUsers);
router.delete('/users/:id', ensureAuthenticated, ensureAdmin, adminController.deleteUser);
router.get('/auctions', ensureAuthenticated, ensureAdmin, adminController.getAllAuctions);
router.delete('/auctions/:id', ensureAuthenticated, ensureAdmin, adminController.deleteAuction);

module.exports = router;
