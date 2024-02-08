const router = require('express').Router();
const { Event } = require('../../models');

router.get('/events', async (req, res) => {
    try {
        const events = await Event.findAll();
        res.json(events);
    } catch (error) {
        console.error('Error fetching events:', error);
        res.status(500).json({ error: 'An error occurred while fetching events. Please try again.' });
    }
});

module.exports = router;