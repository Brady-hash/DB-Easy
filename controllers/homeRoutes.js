const router = require('express').Router();
const { User, Dog, Event } = require('../models');
const withAuth = require('../utils/auth');

// Middleware to redirect based on user role
const redirectBasedOnUserRole = (req, res, next) => {
    if (req.session.loggedIn) {
        if (req.session.userRole === 'admin') {
            // Redirect admin to the admin homepage
            res.redirect('/admin');
        } else if (req.session.userRole === 'user') {
            // Proceed to the route user
            next();
        } else {
            res.status(403).send('Unauthorized access.');
        }
    } else {
        // Not logged in, redirect to login page
        res.redirect('/login');
    }
};

// Route login page
router.get('/login', (req, res) => {
    // If the user is already logged in, redirect based on their role
    if (req.session.loggedIn) {
        redirectBasedOnUserType(req, res, () => {});
    } else {
        res.render('login');
    }
});

//Route sign up page
router.get('/signup', (req, res) => {
    // If the user is already logged in, redirect based on their role
    if (req.session.loggedIn) {
        redirectBasedOnUserType(req, res, () => {});
    } else {
        res.render('signup');
    }
});

// Route to display user homepage or redirect to login if not authenticated
router.get('/', withAuth, redirectBasedOnUserRole, async (req, res) => {
    try {
        if (req.session.userType === 'user') {
            // Fetch logged-in user's data with their Dogs and Events
            const userData = await User.findByPk(req.session.user_id, {
                include: [{ model: Dog, include: [Event] }]
            });

            if (userData) {
                // Serialize data for the template
                const user = userData.get({ plain: true });
                res.render('homepage', { user });
            } else {
                // If userData is null, possibly log out the user
                req.session.destroy(() => {
                    res.redirect('/login');
                });
            }
        }
    } catch (err) {
        console.error(err);
        res.status(500).json(err);
    }
});

//Route dog info (Admin)
router.get('/doginfo', withAuth, async (req, res) => {
    try {
        if (req.session.loggedIn && req.session.userRole === 'user') {
            // Fetch logged-in user's dogs
            const userDogsData = await Dog.findAll({
                where: { userId: req.session.user_id},
                include: [Event]
            });

            // Serialize data for the template
            const dogs = userDogsData.map(dog => dog.get({ plain: true }));
            res.render('doginfo', { dogs });
        } else {
            res.redirect('/login');
        }
    } catch (err) {
        console.error(err);
        res.status(500).json(err);
    }
});

// Route dog events (Admin)
router.get('/events', withAuth, async (req, res) => {
    try {
        if (req.session.loggedIn && req.session.userType === 'user') {
            // Fetch loggedin users dogs and their events
            const userDogsEventsData = await Dog.findAll({
                where: { userId: req.session.user_id },
                include: [{
                    model: Event,
                    required: true 
                }]
            });

            // Serialize data for the template
            const dogsEvents = userDogsEventsData.map(dog => ({
                ...dog.get({ plain: true }),
                events: dog.Events.map(event => event.get({ plain: true }))
            }));
            
            // Render the events page with the fetched data
            res.render('events', { dogsEvents });
        } else {
            res.redirect('/login');
        }
    } catch (err) {
        console.error(err);
        res.status(500).json(err);
    }
});

// Admin homepage route
router.get('/admin', withAuth, async (req, res) => {
    if (req.session.userType === 'admin') {
        try {
            const dogsEventsData = await User.findAll({
                include: [{ model: Dog, include: [Event] }],
            });
            const data = dogsEventsData.map(user => user.get({ plain: true }));
            res.render('admin', { data });
        } catch (error) {
            console.error(error);
            res.status(500).json({ message: 'Error fetching data for admin' });
        }
    } else {
        // if not admin route to login or homepage
        res.redirect('/');
    }
});


module.exports = router;
