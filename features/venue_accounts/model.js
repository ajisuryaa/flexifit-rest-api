var Sequelize = require('sequelize');
const db = require('../../tools/db');

const venueAccountModel = db.define('venue_accounts', {
    id: {
        type: Sequelize.INTEGER,  // Specifies the type as integer
        primaryKey: true,         // Marks this as the primary key
        autoIncrement: true,      // Enables auto-incrementing
        allowNull: false,         // Ensures the column is not nullable
    },
    id_account: {
        type: Sequelize.STRING,
        allowNull: false,
        length: 255
    },
    id_venue: {
        type: Sequelize.STRING,
        allowNull: false,
        length: 255
    },
    level_account: {
        type: Sequelize.TEXT,
        allowNull: false,
        length: 255
    },
}, {
    freezeTableName: true,
    createdAt: false,
    updatedAt: false,
    deletedAt: false,
});
module.exports = venueAccountModel;