module.exports = {
    ensureAuthenticated: function (req, res, next) {
        if (req.session.user) {
            return next();
        }
        req.flash('error_msg', 'Proszę się zalogować, aby uzyskać dostęp do tej zasoby');
        res.redirect('/auth/login');
    }
};