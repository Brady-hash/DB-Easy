const router = require('express').Router();
const { Event } = require('../../models');
const withAuth = require('../../utils/auth');

router.post('/events',withAuth, async (req, res) => {
    const { event_type, date, dog_id } = req.body;

    //Validate
    if (!event_type || !date || dog_id) {
        return res.status(400).json({error: 'All fields are required'});
    }

    try {
        //Create new event
        const newEvent = await Event.create({
            event_type,
            date,
            dog_id,
        });

        // send new event data
        res.status(201).json(newEvent);
    } catch (error) {
        console.error('Error creating new event', error);

        //Handle errors
        res.status(500).json({ error:  'An error occurred while creating the event. Please try again.'})
    }

});

// Fetch event details by ID (for homepage to see current events)
router.get('/events/:id', withAuth, async (req, res) => {
    try {
        // Event fetch to see if dog belongs to current user
        const eventDetails = await Event.findByPk(req.params.id, {
            include: [{
                model: Dog,
                where: { user_id: req.session.userId },
            }]
        });
        
        // If no event is found or it doesn't belong to the user's dog, return a 404 error
        if (!eventDetails) {
            return res.status(404).json({ message: 'Event not found' });
        }

        res.json(eventDetails.get({ plain: true }));
    } catch (error) {
        console.error('Error fetching event details:', error);
        res.status(500).json({ message: 'Error fetching event details' });
    }
});

router.get('/events', (req, res) => {
    res.render('schedule')
}
)

module.exports = router;