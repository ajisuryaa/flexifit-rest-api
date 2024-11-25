var Sequelize = require('sequelize');
const db = require('../../tools/db');

const venueAccountModel = db.define('venue_accounts', {
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
venueAccountModel.removeAttribute('id');
module.exports = venueAccountModel;