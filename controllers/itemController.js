const Item = require('../models/Item');

exports.addItem = async (req, res) => {
    try {
        const { title, description, price } = req.body;
        const newItem = new Item({
            title,
            description,
            initialPrice: price,
            currentPrice: price,
            user: req.session.user._id
        });
        await newItem.save();
        res.redirect('/items');
    } catch (err) {
        res.status(500).send(err);
    }
};

exports.buyItem = async (req, res) => {
    try {
        const item = await Item.findById(req.params.id);
        const newPrice = req.body.newPrice;

        if (item.user.equals(req.session.user._id)) {
            req.flash('error_msg', 'Вы не можете купить свой товар');
            return res.redirect('/items');
        }

        if (newPrice <= item.currentPrice) {
            req.flash('error_msg', 'Новая цена должна быть выше текущей');
            return res.redirect('/items');
        }

        item.currentPrice = newPrice;
        item.buyer = req.session.user._id;
        await item.save();
        res.redirect('/items');
    } catch (err) {
        res.status(500).send(err);
    }
};

exports.deleteItem = async (req, res) => {
    try {
        const item = await Item.findById(req.params.id);
        if (!item) {
            req.flash('error_msg', 'Товар не найден');
            return res.redirect('/items');
        }
        if (item.user.equals(req.session.user._id)) {
            await Item.deleteOne({ _id: req.params.id });
            req.flash('success_msg', 'Товар удален');
            res.redirect('/items');
        } else {
            req.flash('error_msg', 'Вы не можете удалить этот товар');
            res.redirect('/items');
        }
    } catch (err) {
        console.error('Ошибка при удалении товара:', err);
        req.flash('error_msg', 'Ошибка при удалении товара');
        res.redirect('/items');
    }
};

exports.getAllItems = async (req, res) => {
    try {
        const items = await Item.find({}).populate('user', 'username').populate('buyer', 'username');
        res.render('items/index', { items });
    } catch (err) {
        res.status(500).send(err);
    }
};
