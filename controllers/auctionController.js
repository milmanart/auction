const Auction = require('../models/Auction');

exports.addAuction = async (req, res) => {
    try {
        const { title, description, startBid, endDate } = req.body;
        const newAuction = new Auction({
            title,
            description,
            initialPrice: startBid,
            currentPrice: startBid,
            user: req.session.user._id,
            endDate
        });
        await newAuction.save();
        res.redirect('/auctions');
    } catch (err) {
        res.status(500).send(err);
    }
};

exports.getAllAuctions = async (req, res) => {
    try {
        const auctions = await Auction.find({}).populate('user', 'username').populate('buyer', 'username');
        res.render('index', { auctions, user: req.session.user });
    } catch (err) {
        res.status(500).send(err);
    }
};

exports.getUserAuctions = async (req, res) => {
    try {
        const auctions = await Auction.find({ user: req.session.user._id }).populate('user', 'username').populate('buyer', 'username');
        res.render('auctions/index', { auctions, user: req.session.user });
    } catch (err) {
        res.status(500).send(err);
    }
};