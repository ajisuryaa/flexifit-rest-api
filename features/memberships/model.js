var Sequelize = require('sequelize');
const db = require('../../tools/db');

const membershipModel = db.define('memberships', {
    id : {
        primaryKey: true,
        type: Sequelize.STRING,
        length: 255
    },
    venue_id: {
        type: Sequelize.STRING,
        allowNull: false,
        length: 255
    },
    name: {
        type: Sequelize.STRING,
        allowNull: false,
        length: 255
    },
    description: {
        type: Sequelize.TEXT,
        allowNull: false,
        length: 13
    },
    price: {
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

module.exports = membershipModel;