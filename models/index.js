const User = require('./User');
const Dog = require('./Dog');
const Event = require('./Event')
// const Admin = require('./Admin')

User.hasMany(Dog, {
    foreignKey: 'user_id',
});

Dog.belongsTo(User, {
    foreignKey: 'user_id',
});

Dog.hasMany(Event, {
    foreignKey: 'dog_id',
});

Event.belongsTo(Dog, {
    foreignKey: 'dog_id',
});

module.exports = { User, Dog, Event };
