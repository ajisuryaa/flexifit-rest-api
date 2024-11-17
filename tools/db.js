const process = require('process');
var Sequelize = require('sequelize');

const db = new Sequelize(
    process.env.DB_NAME,
    process.env.DB_USERNAME,
    process.env.DB_PASSWORD,
    {
        host: process.env.DB_HOST,
        port: process.env.DB_PORT,
        dialect: process.env.DB_DIALECT,
        logging: false,
        timezone: process.env.DB_TIMEZONE,
    }
);

db.authenticate().then(() => {
    console.log('Connection to database has been established successfully.');
}).catch((error) => {
    console.error('Unable to connect to the database: ', error);
});

module.exports = db;