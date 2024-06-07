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
        res.redirect('/');
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
            return res.redirect('/');
        }

        if (auction.buyer) {
            if (newPrice <= auction.currentPrice) {
                req.flash('error_msg', 'Nowa cena musi być wyższa niż obecna');
                return res.redirect('/');
            }

            auction.currentPrice = newPrice;
        } else {
            if (newPrice < auction.currentPrice) {
                req.flash('error_msg', 'Cena nie może być niższa niż obecna');
                return res.redirect('/');
            }

            auction.currentPrice = newPrice;
        }

        auction.buyer = req.session.user._id;
        await auction.save();
        res.redirect('/');
    } catch (err) {
        res.status(500).send(err);
    }
};

exports.deleteAuction = async (req, res) => {
    try {
        const auction = await Auction.findById(req.params.id);
        if (!auction) {
            req.flash('error_msg', 'Przedmiot nie znaleziony');
            return res.redirect('/');
        }
        if (auction.user.equals(req.session.user._id)) {
            await Auction.deleteOne({ _id: req.params.id });
            req.flash('success_msg', 'Przedmiot usunięty');
            res.redirect('/');
        } else {
            req.flash('error_msg', 'Nie możesz usunąć tego przedmiotu');
            res.redirect('/');
        }
    } catch (err) {
        console.error('Błąd przy usuwaniu przedmiotu:', err);
        req.flash('error_msg', 'Błąd przy usuwaniu przedmiotu');
        res.redirect('/');
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

exports.editAuctionForm = async (req, res) => {
    try {
        const auction = await Auction.findById(req.params.id);
        if (!auction) {
            req.flash('error_msg', 'Aukcja nie została znaleziona');
            return res.redirect('/auctions/my-auctions');
        }
        res.render('auctions/edit', { auction });
    } catch (err) {
        res.status(500).send(err);
    }
};

exports.updateAuction = async (req, res) => {
    try {
        const { title, description, currentPrice } = req.body;
        const auction = await Auction.findById(req.params.id);
        if (!auction) {
            req.flash('error_msg', 'Aukcja nie została znaleziona');
            return res.redirect('/auctions/my-auctions');
        }

        auction.title = title;
        auction.description = description;
        auction.currentPrice = currentPrice;

        await auction.save();
        req.flash('success_msg', 'Aukcja została zaktualizowana');
        res.redirect('/auctions/my-auctions');
    } catch (err) {
        res.status(500).send(err);
    }
};
