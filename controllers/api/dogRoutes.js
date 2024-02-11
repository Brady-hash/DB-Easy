const router = require('express').Router();
const { Dog } = require('../../models');

// router.post('/api/info', async (req, res) => {
//     const { name, breed, sex, age, weight, spay_neuter, vaccinations, address } = req.body;
//     console.log(req.body, 'this is it')
//     // Validate the input fields
//     if (!name || !breed || !sex || !age || !weight || !spay_neuter || !vaccinations || !address) {
//         return res.status(400).json({ error: 'All fields are required'});
//     }

//     try {
//         // Create a new dog
//         const newDog = await Dog.create({
//             name,
//             breed,
//             sex,
//             age,
//             weight,
//             spay_neuter,
//             vaccinations,
//             address,
//         });

//         // send new dogs data
//         res.status(201).json(newDog);
//     } catch (error) {
//         console.error('Error creating new dog:', error);

//         // Handle errors
//         res.status(500).json({ error: 'An error occurred while creating the dog. Please try again.' });
//     }
// });

module.exports = router;

