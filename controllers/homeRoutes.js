const router = require('express').Router();
const { User, Dog, Event } = require('../models');
const withAuth = require('../utils/auth');
const bcrypt = require('bcrypt');

// Middleware to redirect based on user role
const redirectBasedOnUserRole = async (req, res, next) => {
    if (req.session.logged_in) {
        try {
            const user = await User.findByPk(req.session.user_id);
            if (!user) {
                return res.status(404).json({ message: 'User not found' });
            }
            // Adjusting redirection logic for admin
            if (req.session.user_role === 'admin') {
                return res.redirect('/admin');
            }
            // Proceed for users
            next();
        } catch (error) {
            console.error('Error fetching user:', error);
            res.status(500).json({ message: 'Error fetching user' });
        }
    // } else {
    //     res.redirect('/login');
    }
};


// Route login page
router.get('/login', (req, res) => {
    res.render('login');
});

router.post('/login', async (req, res) => {
    try {
        console.log(req.body)
        const userData = await User.findOne({ where: { email: req.body.email } });

        if (!userData) {
            res
                .status(400)
                .json({ message: 'Wrong Email' });
            return;
        }
        console.log(req.body.password);
        const validPassword = await userData.checkPassword(req.body.password);
        console.log(validPassword);

        if (!validPassword) {
            res
                .status(400)
                .json({ message: 'Wrong Password' });
            return;
        }
        req.session.user_role = userData.role;
        req.session.user_id = userData.id;
        req.session.logged_in = true;
        if (req.session.user_role === 'admin') {
            res.redirect('/admin');
        } else if (req.session.user_role === 'user') {
            res.redirect('/')
        } else {
            res.redirect('/login')
        }
        
    } catch (err) {
        res.status(400).json(err);
    }
});
// logout
router.post('/logout', (req, res) => {
    if (req.session.logged_in) {
        req.session.destroy(() => {
            res.redirect('/login'); // Correctly redirect after session destruction
        });
    } else {
        res.status(404).end();
    }
});

//Route sign up page
router.get('/signup', async (req, res) => {
    res.render('signup');
});

router.post('/signup', async (req, res) => {
    console.log(req.body)
    const { first_name, last_name, email, password, phone, role } = req.body;
  
  
    try {
        // Hash password before saving to the database
        const hashedPassword = await bcrypt.hash(password, 10);

        console.log('Hashed Password signup', hashedPassword)
  
        // Create new user
        await User.create({
            first_name,
            last_name,
            email,
            password: hashedPassword,
            phone,
            role,
  
        });
        res.redirect('/login');
    } catch (error) {
        console.error('Signup error:', error);
        res.status(500).json({ error: 'Error! Please try again.' });
    }
  });

// Route to display user homepage or redirect to login if not authenticated
router.get('/', async (req, res) => {
    try {
        if (req.session.logged_in) {
            const userData = await User.findByPk(req.session.user_id , {
                include: [{ model: Dog, include: [Event] }]
            });
            if (userData) {
                // Serialize data for the template
                const user = userData.get({ plain: true });
                console.log(user);
                
                res.render('homepage', { user });
            }
        } else {
            res.redirect('/login');
        }
    } catch (err) {
        console.error(err);
        res.status(500).json(err);
    }
});

//Route dog info 
router.get('/doginfo', withAuth, async (req, res) => {
    try {
        if (req.session.logged_in && req.session.user.role === 'user') {
            const userDogsData = await Dog.findAll({
                where: { userId: req.session.user_id },
                include: [Event]
            });

            // Serialize data for the template
            const dogs = userDogsData.map(dog => dog.get({ plain: true }));
            res.render('info', { dogs });
        } else {
            res.redirect('/login');
        }
    } catch (err) {
        console.error(err);
        res.status(500).json(err);
    }
});

router.get('/newdog', (req, res) => {
    res.render('info')
}
)


// Route dog schedule
router.get('/events', async (req, res) => {
    try {
        if (req.session.logged_in) {
            const userData = await User.findByPk(req.session.user_id, {
                include: [{ model: Dog, include: [Event] }]
            });
            if (userData) {
                // Serialize data for the template
                const user = userData.get({ plain: true });
                console.log(user);
                res.render('schedule', { user });
            }
        } else {
            res.redirect('/');
        }
    } catch (err) {
        console.error(err);
        res.status(500).json(err);
    }

}
)

router.post('/events', withAuth, async (req, res) => {
    const { event_type, date, dog_id } = req.body;
    console.log(req.body)

    try {
        //Create new event
        await Event.create({
            event_type,
            date,
            dog_id,
        });

        res.redirect('/')
    } catch (error) {
        console.error('Error creating new event', error);

        //Handle errors
        res.status(500).json({ error: 'An error occurred while creating the event. Please try again.' })
    }

});

// Admin homepage route
router.get('/admin', withAuth, async (req, res) => {
    console.log(req.session);
    if (req.session.user_role === 'admin') {
        try {
            const usersData = await User.findAll({
                include: [{ model: Dog, include: [Event] }]
            });

            const adminData = await User.findByPk(req.session.user_id , {
                include: [{ model: Dog, include: [Event] }]
            });

            const users = usersData.map(user => user.get({ plain: true }));

            const admin = adminData.get({ plain: true });
            
            res.render('admin', { users: users, admin: admin });
        } catch (err) {
            console.error(err);
            res.status(500).json({ message: 'Error fetching data' });
        }
    } else {
        res.status(403).json({ message: 'Unauthorized access.' });
    }
});

module.exports = router;
