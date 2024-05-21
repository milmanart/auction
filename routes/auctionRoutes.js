const express = require('express');
const router = express.Router();
const auctionController = require('../controllers/auctionController');

// Отображение формы для добавления предмета на аукцион
router.get('/add', (req, res) => {
    res.render('auctions/add');
});

// Отображение формы для редактирования предмета на аукционе
router.get('/edit/:id', auctionController.getAuction);

// Управление аукционами
router.get('/', auctionController.getAllAuctions);
router.post('/add', auctionController.addAuction);
router.put('/edit/:id', auctionController.editAuction);
router.delete('/delete/:id', auctionController.deleteAuction);

module.exports = router;
