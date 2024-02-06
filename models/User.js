const { Model, DataTypes } = require('sequelize');
const bcrypt = require('bcrypt');
const sequelize = require('../config/connection');

class User extends Model {
    checkPassword(loginPW) {
        return bcrypt.compareSync(loginPW, this.password);
    }
}

User.init(
    {
        id: {
            type: DataTypes.INTEGER,
            allowNull: false,
            primaryKey: true,
            autoIncrement: true,
        },
        first_name: {
            type: DataTypes.STRING(15),
            allowNull: false,
        },
        last_name: {
            type: DataTypes.STRING(15),
            allowNull: false,
        },
        email: {
            type: DataTypes.STRING(30),
            allowNull: false,
            unique: true,
            validate: {
                isEmail: true,
            },
        },
        password: {
            type: DataTypes.STRING,
            allowNull: false,
            validate: {
                max: [10]
            },
        },
        phone: {
            type: DataTypes.INTEGER,
            allowNull: false,
            validate: {
                max: [11]
            },
        },
    },
    {
        hooks: {
            beforeCreate: async (newUserPw) => {
                newUser.password = await bcrypt.hash(newUser.password, 10);
                return newUserPw;
            },
        },
    },
    {    
        sequelize,
        timestamps: false,
        freezeTableName: true,
        underscore: true,
        modelName: 'user',
    }
);

module.exports = User;