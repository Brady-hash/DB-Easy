const { Model, DataTypes } = require('sequelize');
const sequelize = require('../config/connection');

class Event extends Model { }

Event.init(
    {
        id: {
            type: DataTypes.INTEGER,
            allowNull: false,
            primaryKey: true,
            autoIncrement: true
        },
        event_type: {
            type: DataTypes.STRING(10),
            allowNull: true
        },
        date: {
            type: DataTypes.DATE,
            allowNull: false,
        },
        dog_id: {
            type: DataTypes.INTEGER,
            references: {
                model: 'dog',
                key: 'id',
            },
        },
        sequelize,
        timestamps: false,
        freezeTableName: true,
        underscore: true,
        modelName: 'event',
    }
);

module.exports = Event;