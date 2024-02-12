// Imports
const Sequelize = require('sequelize');
require('dotenv').config();

// Hold the Sequelize connection instance
let sequelize;

// Check if the `JAWSDB_URL` environment variable is set on Heroku deployment -- if not, initialize Sequelize via localHost
if (process.env.JAWSDB_URL) {
  sequelize = new Sequelize(process.env.JAWSDB_URL);
} else {
  sequelize = new Sequelize(
    process.env.DB_NAME,
    process.env.DB_USER,
    process.env.DB_PASSWORD,
    {
      host: 'localhost',
      dialect: 'mysql',
      port: 3306
    }
  );
}

// Export
module.exports = sequelize;