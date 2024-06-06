const express = require('express');
const router = express.Router();
const auctionController = require('../controllers/auctionController');
const { ensureAuthenticated } = require('../config/auth');

// Wyświetlenie formularza dodawania aukcji
router.get('/add', ensureAuthenticated, (req, res) => {
    res.render('auctions/add');
});

// Dodanie aukcji
router.post('/add', ensureAuthenticated, auctionController.addAuction);

// Wyświetlenie wszystkich aukcji
router.get('/', auctionController.getAllAuctions);

// Wyświetlenie aukcji użytkownika
router.get('/my-auctions', ensureAuthenticated, auctionController.getUserAuctions);

module.exports = router;
