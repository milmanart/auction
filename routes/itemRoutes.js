const express = require('express');
const router = express.Router();
const itemController = require('../controllers/itemController');
const { ensureAuthenticated } = require('../config/auth');

// Wyświetlenie formularza dodawania przedmiotu
router.get('/add', ensureAuthenticated, (req, res) => {
    res.render('items/add');
});

// Dodanie przedmiotu
router.post('/add', ensureAuthenticated, itemController.addItem);

// Zakup przedmiotu
router.post('/buy/:id', ensureAuthenticated, itemController.buyItem);

// Usunięcie przedmiotu
router.delete('/delete/:id', ensureAuthenticated, itemController.deleteItem);

// Wyświetlenie wszystkich przedmiotów
router.get('/', itemController.getAllItems);

// Wyświetlenie przedmiotów użytkownika
router.get('/my-items', ensureAuthenticated, itemController.getUserItems);

module.exports = router;
