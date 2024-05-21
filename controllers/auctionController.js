const Auction = require('../models/Auction');

exports.addAuction = async (req, res) => {
    try {
        const newAuction = new Auction(req.body);
        await newAuction.save();
        res.redirect('/auctions');
    } catch (err) {
        res.status(500).send(err);
    }
};

exports.editAuction = async (req, res) => {
    try {
        await Auction.findByIdAndUpdate(req.params.id, req.body);
        res.redirect('/auctions');
    } catch (err) {
        res.status(500).send(err);
    }
};

exports.deleteAuction = async (req, res) => {
    try {
        await Auction.findByIdAndDelete(req.params.id);
        res.redirect('/auctions');
    } catch (err) {
        res.status(500).send(err);
    }
};

exports.getAuction = async (req, res) => {
    try {
        const auction = await Auction.findById(req.params.id);
        res.render('auctions/edit', { auction });
    } catch (err) {
        res.status(500).send(err);
    }
};

exports.getAllAuctions = async (req, res) => {
    try {
        const auctions = await Auction.find({});
        res.render('auctions/index', { auctions });
    } catch (err) {
        res.status(500).send(err);
    }
};
