const Auction = require('../models/Auction');

exports.addAuction = async (req, res) => {
    try {
        const { title, description, price } = req.body;
        const newAuction = new Auction({
            title,
            description,
            initialPrice: price,
            currentPrice: price,
            user: req.session.user._id
        });
        await newAuction.save();
        res.redirect('/auctions');
    } catch (err) {
        res.status(500).send(err);
    }
};

exports.buyAuction = async (req, res) => {
    try {
        const auction = await Auction.findById(req.params.id);
        const newPrice = req.body.newPrice;

        if (auction.user.equals(req.session.user._id)) {
            req.flash('error_msg', 'Nie możesz kupić swojego przedmiotu');
            return res.redirect('/auctions');
        }

        if (auction.buyer) {
            if (newPrice <= auction.currentPrice) {
                req.flash('error_msg', 'Nowa cena musi być wyższa niż obecna');
                return res.redirect('/auctions');
            }

            auction.currentPrice = newPrice;
        } else {
            if (newPrice < auction.currentPrice) {
                req.flash('error_msg', 'Cena nie może być niższa niż obecna');
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

exports.deleteAuction = async (req, res) => {
    try {
        const auction = await Auction.findById(req.params.id);
        if (!auction) {
            req.flash('error_msg', 'Przedmiot nie znaleziony');
            return res.redirect('/auctions');
        }
        if (auction.user.equals(req.session.user._id)) {
            await Auction.deleteOne({ _id: req.params.id });
            req.flash('success_msg', 'Przedmiot usunięty');
            res.redirect('/auctions');
        } else {
            req.flash('error_msg', 'Nie możesz usunąć tego przedmiotu');
            res.redirect('/auctions');
        }
    } catch (err) {
        console.error('Błąd przy usuwaniu przedmiotu:', err);
        req.flash('error_msg', 'Błąd przy usuwaniu przedmiotu');
        res.redirect('/auctions');
    }
};

exports.getAllAuctions = async (req, res) => {
    try {
        const auctions = await Auction.find({}).populate('user', 'username').populate('buyer', 'username');
        res.render('auctions/index', { auctions });
    } catch (err) {
        res.status(500).send(err);
    }
};

exports.getUserAuctions = async (req, res) => {
    try {
        const auctions = await Auction.find({ user: req.session.user._id }).populate('user', 'username').populate('buyer', 'username');
        res.render('auctions/userAuctions', { auctions });
    } catch (err) {
        res.status(500).send(err);
    }
};
