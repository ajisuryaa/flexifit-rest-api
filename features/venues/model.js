var Sequelize = require('sequelize');
const db = require('../../tools/db');

const venueModel = db.define('venues', {
    uuid: {
        primaryKey: true,
        type: Sequelize.STRING,
        length: 255
    },
    name: {
        type: Sequelize.STRING,
        allowNull: false,
        length: 255
    },
    about: {
        type: Sequelize.STRING,
        allowNull: false,
        length: 255
    },
    email: {
        type: Sequelize.STRING,
        allowNull: false,
        length: 255
    },
    address: {
        type: Sequelize.TEXT,
        allowNull: false,
        length: 255
    },
    contact_number: {
        type: Sequelize.STRING,
        allowNull: false,
        length: 13
    },
    longitude: {
        type: Sequelize.DOUBLE,
        allowNull: false,
    },
    latitude: {
        type: Sequelize.DOUBLE,
        allowNull: false,
    },
    created_at: {
        type: Sequelize.DATE,
        allowNull: true,
        defaultValue: new Date()
    },
    updated_at: {
        type: Sequelize.DATE,
        allowNull: true,
        defaultValue: new Date()
    },
    deleted_at: {
        type: Sequelize.DATE,
        allowNull: true,
    },
}, {
    freezeTableName: true,
    createdAt: false,
    updatedAt: false,
    deletedAt: false,
});

module.exports = venueModel;