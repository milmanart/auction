const User = require('../models/User');

exports.addUser = async (req, res) => {
    try {
        const newUser = new User(req.body);
        await newUser.save();
        res.redirect('/users');
    } catch (err) {
        res.status(500).send(err);
    }
};

exports.editUser = async (req, res) => {
    try {
        const user = await User.findById(req.params.id);
        user.username = req.body.username;
        user.email = req.body.email;
        if (req.body.password) {
            user.password = req.body.password;
        }
        await user.save();
        res.redirect('/users');
    } catch (err) {
        res.status(500).send(err);
    }
};

exports.deleteUser = async (req, res) => {
    try {
        await User.findByIdAndDelete(req.params.id);
        res.redirect('/users');
    } catch (err) {
        res.status(500).send(err);
    }
};

exports.getUser = async (req, res) => {
    try {
        const user = await User.findById(req.params.id);
        res.render('users/edit', { user });
    } catch (err) {
        res.status(500).send(err);
    }
};

exports.getAllUsers = async (req, res) => {
    try {
        const users = await User.find({});
        res.render('users/index', { users });
    } catch (err) {
        res.status(500).send(err);
    }
};
