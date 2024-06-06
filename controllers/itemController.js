const auction = require('../models/auction');

exports.addauction = async (req, res) => {
    try {
        const { title, description, price } = req.body;
        const newauction = new auction({
            title,
            description,
            initialPrice: price,
            currentPrice: price,
            user: req.session.user._id
        });
        await newauction.save();
        res.redirect('/auctions');
    } catch (err) {
        res.status(500).send(err);
    }
};

exports.buyauction = async (req, res) => {
    try {
        const auction = await auction.findById(req.params.id);
        const newPrice = req.body.newPrice;

        if (auction.user.equals(req.session.user._id)) {
            req.flash('error_msg', 'Nie możesz kupić swojego przedmiotu');
            return res.redirect('/auctions');
        }

        if (auction.buyer) {
            if (newPrice <= auction.currentPrice) {
                req.flash('error_msg', 'Nowa cena musi być wyższa od bieżącej');
                return res.redirect('/auctions');
            }

            auction.currentPrice = newPrice;
        } else {
            if (newPrice < auction.currentPrice) {
                req.flash('error_msg', 'Cena nie może być niższa od bieżącej');
                return res.redirect('/auctions');
            }

            auction.currentPrice = newPrice;
        }

        auction.buyer = req.session.user._id;
        await auction.save();
        res.redirect('/auctions');
    } catch (err) {
        res.status(500).send(err);
    }
};

exports.deleteauction = async (req, res) => {
    try {
        const auction = await auction.findById(req.params.id);
        if (!auction) {
            req.flash('error_msg', 'Przedmiot nie został znaleziony');
            return res.redirect('/auctions');
        }
        if (auction.user.equals(req.session.user._id)) {
            await auction.deleteOne({ _id: req.params.id });
            req.flash('success_msg', 'Przedmiot został usunięty');
            res.redirect('/auctions');
        } else {
            req.flash('error_msg', 'Nie możesz usunąć tego przedmiotu');
            res.redirect('/auctions');
        }
    } catch (err) {
        console.error('Błąd podczas usuwania przedmiotu:', err);
        req.flash('error_msg', 'Błąd podczas usuwania przedmiotu');
        res.redirect('/auctions');
    }
};

exports.getAllauctions = async (req, res) => {
    try {
        const auctions = await auction.find({}).populate('user', 'username').populate('buyer', 'username');
        res.render('auctions/index', { auctions });
    } catch (err) {
        res.status(500).send(err);
    }
};

exports.getUserauctions = async (req, res) => {
    try {
        const auctions = await auction.find({ user: req.session.user._id }).populate('user', 'username').populate('buyer', 'username');
        res.render('auctions/userauctions', { auctions });
    } catch (err) {
        res.status(500).send(err);
    }
};
