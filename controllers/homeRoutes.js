const router = require('express').Router();
const { User, Dog, Event } = require('../models');
const withAuth = require('../utils/auth');

// Route to display the homepage or redirect to login if not authenticated
router.get('/', withAuth, async (req, res) => {
    try {
        if (req.session.loggedIn) {
            // Fetch logged-in user's data with their Dogs and Events
            const userData = await User.findByPk(req.session.userId, {
                include: [
                    {
                        model: Dog,
                        include: [Event]
                    }
                ]
            });

            if (userData) {
                // Serialize data for the template
                const user = userData.get({ plain: true });

                res.render('homepage', { user });
            } else {
                // If userData is null
                req.session.destroy(() => {
                    res.redirect('/login');
                });
            }
        } else {
            // Redirect to the login page if not logged in
            res.redirect('/login');
        }
    } catch (err) {
        console.error(err);
        res.status(500).json(err);
    }
});


// Route to handle login page
router.get('/login', (req, res) => {
    // If the user is already logged in, redirect to their homepage
    if (req.session.loggedIn) {
        res.redirect('/');
        return;
    }
    res.render('login');
});

//Route to handle sign up page
router.get('/signup', (req, res) => {
        // If the user is already logged in, redirect to their homepage
    if (req.session.loggedIn) {
        res.redirect('/');
        return;
    }
    res.render('signup');
});

module.exports = router;
