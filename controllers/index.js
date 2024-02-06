const router = require('express').Router();
const { User, Dog, Event } = require('../models');

// Route to get all Users with their Dogs and Events
router.get('/', async (req, res) => {
    try {
        // Get all users and JOIN with Dog and Event data
        const userData = await User.findAll({
            include: [
                {
                    model: Dog,
                },
                {
                    model: Event,
                }
            ],
        });
        // Send response
        res.json(users);
    } catch (err) {
        console.error(err);
        res.status(500).json(err);
    }
});
