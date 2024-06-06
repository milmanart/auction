const express = require('express');
const router = express.Router();
const auctionController = require('../controllers/auctionController');
const { ensureAuthenticated } = require('../config/auth');

// Wyświetlenie formularza dodawania przedmiotu
router.get('/add', ensureAuthenticated, (req, res) => {
    res.render('auctions/add');
});

// Dodanie przedmiotu
router.post('/add', ensureAuthenticated, auctionController.addauction);

// Zakup przedmiotu
router.post('/buy/:id', ensureAuthenticated, auctionController.buyauction);

// Usunięcie przedmiotu
router.delete('/delete/:id', ensureAuthenticated, auctionController.deleteauction);

// Wyświetlenie wszystkich przedmiotów
router.get('/', auctionController.getAllauctions);

// Wyświetlenie przedmiotów użytkownika
router.get('/my-auctions', ensureAuthenticated, auctionController.getUserauctions);

module.exports = router;
