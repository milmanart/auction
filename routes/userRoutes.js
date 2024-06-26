const express = require('express');
const router = express.Router();
const userController = require('../controllers/userController');
const { ensureAuthenticated } = require('../config/auth');

function ensureAdmin(req, res, next) {
    if (req.session.user && req.session.user.isAdmin) {
        return next();
    }
    req.flash('error_msg', 'Nie masz uprawnień dostępu');
    res.redirect('/');
}

router.get('/add', ensureAuthenticated, (req, res) => {
    res.render('users/add');
});

router.get('/edit/:id', ensureAuthenticated, userController.getUser);

router.get('/', ensureAuthenticated, ensureAdmin, userController.getAllUsers);
router.post('/add', ensureAuthenticated, ensureAdmin, userController.addUser);
router.put('/edit/:id', ensureAuthenticated, ensureAdmin, userController.editUser);
router.delete('/delete/:id', ensureAuthenticated, ensureAdmin, userController.deleteUser);

module.exports = router;
