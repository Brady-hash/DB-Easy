const router = require('express').Router();
const { User, Dog, Event } = require('../../models');
const withAuth = require('../../utils/auth');
const adminAuth = require('../../utils/adminAuth');

// Fetch user details by ID (Admin)
router.get('/users/:id',withAuth, adminAuth, async (req, res) => {
    try {
        const userDetails = await User.findByPk(req.params.id);
        if (!userDetails) {
            return res.status(404).json({ message: 'User not found' });
        }
        res.json(userDetails.get({ plain: true }));
    } catch (error) {
        console.error('Error fetching user details:', error);
        res.status(500).json({ message: 'Error fetching user details' });
    }
});

// Fetch dog details by ID (Admin)
router.get('/dogs/:id',withAuth, adminAuth, async (req, res) => {
    try {
        const dogDetails = await Dog.findByPk(req.params.id);
        if (!dogDetails) {
            return res.status(404).json({ message: 'Dog not found' });
        }
        res.json(dogDetails.get({ plain: true }));
    } catch (error) {
        console.error('Error fetching dog details:', error);
        res.status(500).json({ message: 'Error fetching dog details' });
    }
});

// Fetch event details by ID (Admin)
router.get('/events/:id', withAuth, adminAuth, async (req, res) => {
    try {
        const eventDetails = await Event.findByPk(req.params.id);
        if (!eventDetails) {
            return res.status(404).json({ message: 'Event not found' });
        }
        res.json(eventDetails.get({ plain: true }));
    } catch (error) {
        console.error('Error fetching event details:', error);
        res.status(500).json({ message: 'Error fetching event details' });
    }
});

module.exports = router;