const router = require('express').Router();
const { Dog } = require('../../models');
const withAuth = require('../../utils/auth');

router.post('/info', async (req, res) => {
    const { name, breed, sex, age, weight, spay_neuter, vaccinations, address } = req.body;
    // Validate the input fields
   
    try {
        // Create a new dog
         await Dog.create({
            name,
            breed,
            sex,
            age,
            weight,
            spay_neuter,
            vaccinations,
            address,
            user_id: req.session.user_id
        });

        // send new dogs data
        res.redirect('/');
    } catch (error) {
        console.error('Error creating new dog:', error);

        // Handle errors
        res.status(500).json({ error: 'An error occurred while creating the dog. Please try again.' });
    }
});

module.exports = router;

