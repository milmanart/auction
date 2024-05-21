const express = require('express');
const router = express.Router();
const itemController = require('../controllers/itemController');
const { ensureAuthenticated } = require('../config/auth');

// Отображение формы для добавления предмета
router.get('/add', ensureAuthenticated, (req, res) => {
    res.render('items/add');
});

// Добавление предмета
router.post('/add', ensureAuthenticated, itemController.addItem);

// Покупка предмета
router.post('/buy/:id', ensureAuthenticated, itemController.buyItem);

// Удаление предмета
router.delete('/delete/:id', ensureAuthenticated, itemController.deleteItem);

// Отображение всех предметов
router.get('/', itemController.getAllItems);

module.exports = router;
