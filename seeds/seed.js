const sequelize = require('../config/connection');
const { User, Dog , Event } = require('../models');

const userData = require('./userData.json');
const dogData = require('./dogData.json');
const eventData = require('./eventData.json');

const seedDatabase = async () => {
    await sequelize.sync({ force: true });

    // Bulk create users
    await User.bulkCreate(userData, {
        individualHooks: true,
        returning: true,
    });

    // Bulk create dogs
    await Dog.bulkCreate(dogData);

    // Bulk create events

    await Event.bulkCreate(eventData);

    console.log('Database seeded!');
    process.exit(0);
};

seedDatabase();
