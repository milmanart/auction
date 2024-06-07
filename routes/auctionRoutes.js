const express = require('express');
const router = express.Router();
const auctionController = require('../controllers/auctionController');
const { ensureAuthenticated } = require('../config/auth');

// Wyświetlanie formularza dodawania przedmiotu
router.get('/add', ensureAuthenticated, (req, res) => {
    res.render('auctions/add');
});

// Dodawanie przedmiotu
router.post('/add', ensureAuthenticated, auctionController.addAuction);

// Kupowanie przedmiotu
router.post('/buy/:id', ensureAuthenticated, auctionController.buyAuction);

// Usuwanie przedmiotu
router.delete('/delete/:id', ensureAuthenticated, auctionController.deleteAuction);

// Wyświetlanie wszystkich przedmiotów
router.get('/', auctionController.getAllAuctions);

// Wyświetlanie przedmiotów użytkownika
router.get('/my-auctions', ensureAuthenticated, auctionController.getUserAuctions);

// Wyświetlenie formularza edycji aukcji
router.get('/edit/:id', ensureAuthenticated, auctionController.editAuctionForm);

// Aktualizacja aukcji
router.put('/edit/:id', ensureAuthenticated, auctionController.updateAuction);

module.exports = router;
