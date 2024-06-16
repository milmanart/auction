const express = require('express');
const router = express.Router();
const auctionController = require('../controllers/auctionController');
const { ensureAuthenticated } = require('../config/auth');

router.get('/add', ensureAuthenticated, (req, res) => {
    res.render('auctions/add');
});

router.post('/add', ensureAuthenticated, auctionController.addAuction);

router.post('/buy/:id', ensureAuthenticated, auctionController.buyAuction);

router.delete('/delete/:id', ensureAuthenticated, auctionController.deleteAuction);

router.get('/', auctionController.getAllAuctions);

router.get('/my-auctions', ensureAuthenticated, auctionController.getUserAuctions);

router.get('/edit/:id', ensureAuthenticated, auctionController.editAuctionForm);

router.put('/edit/:id', ensureAuthenticated, auctionController.updateAuction);

module.exports = router;
