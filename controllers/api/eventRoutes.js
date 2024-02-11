const router = require('express').Router();
const { Event } = require('../../models');

router.post('/events', async (req, res) => {
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

module.exports = router;