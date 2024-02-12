const adminAuth = (req, res, next) => {
    if (req.session.logged_in && req.session.user_role === 'admin') {
        next();
    } else {
        res.status(400).json({ message: 'Page not found.' });
    }
};

module.exports = adminAuth;