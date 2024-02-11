const adminAuth = (req, res, next) => {
    if (req.session.loggedIn && req.session.userRole === 'admin') {
        next();
    } else {
        res.status(400).json({ message: 'Page not found.' });
    }
};

module.exports = adminAuth;