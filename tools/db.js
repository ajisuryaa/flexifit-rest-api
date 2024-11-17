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
        dialectOptions: {
            dateStrings: true, // Return date as strings to avoid timezone conversion issues
            typeCast: true,    // Cast to string if needed
        },
        logging: false,
        timezone: '+07:00', // returning WIB datetime
    }
);

db.authenticate().then(() => {
    console.log('Connection to database has been established successfully.');
}).catch((error) => {
    console.error('Unable to connect to the database: ', error);
});

module.exports = db;