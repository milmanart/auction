const User = require('../models/User');
const Auction = require('../models/Auction');

exports.adminDashboard = (req, res) => {
    res.render('admin/dashboard', { user: req.session.user });
};

exports.getAllUsers = async (req, res) => {
    try {
        const users = await User.find({});
        res.render('admin/users', { users });
    } catch (err) {
        res.status(500).send(err);
    }
};

exports.deleteUser = async (req, res) => {
    try {
        await User.findByIdAndDelete(req.params.id);
        req.flash('success_msg', 'Użytkownik został usunięty');
        res.redirect('/admin/users');
    } catch (err) {
        res.status(500).send(err);
    }
};

exports.getAllAuctions = async (req, res) => {
    try {
        const auctions = await Auction.find({}).populate('user', 'username');
        res.render('admin/auctions', { auctions });
    } catch (err) {
        res.status(500).send(err);
    }
};

exports.deleteAuction = async (req, res) => {
    try {
        await Auction.findByIdAndDelete(req.params.id);
        req.flash('success_msg', 'Aukcja została usunięta');
        res.redirect('/admin/auctions');
    } catch (err) {
        res.status(500).send(err);
    }
};
