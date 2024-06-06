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
            req.flash('error_msg', 'Nie możesz kupić swojego przedmiotu');
            return res.redirect('/items');
        }

        if (item.buyer) {
            if (newPrice <= item.currentPrice) {
                req.flash('error_msg', 'Nowa cena musi być wyższa od bieżącej');
                return res.redirect('/items');
            }

            item.currentPrice = newPrice;
        } else {
            if (newPrice < item.currentPrice) {
                req.flash('error_msg', 'Cena nie może być niższa od bieżącej');
                return res.redirect('/items');
            }

            item.currentPrice = newPrice;
        }

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
            req.flash('error_msg', 'Przedmiot nie został znaleziony');
            return res.redirect('/items');
        }
        if (item.user.equals(req.session.user._id)) {
            await Item.deleteOne({ _id: req.params.id });
            req.flash('success_msg', 'Przedmiot został usunięty');
            res.redirect('/items');
        } else {
            req.flash('error_msg', 'Nie możesz usunąć tego przedmiotu');
            res.redirect('/items');
        }
    } catch (err) {
        console.error('Błąd podczas usuwania przedmiotu:', err);
        req.flash('error_msg', 'Błąd podczas usuwania przedmiotu');
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

exports.getUserItems = async (req, res) => {
    try {
        const items = await Item.find({ user: req.session.user._id }).populate('user', 'username').populate('buyer', 'username');
        res.render('items/userItems', { items });
    } catch (err) {
        res.status(500).send(err);
    }
};
