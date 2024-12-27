var Sequelize = require('sequelize');
const db = require('../../tools/db');

const imageVenueModel = db.define('images_venue', {
    id: {
        type: Sequelize.INTEGER,
        primaryKey: true,
        autoIncrement: true, // Enables auto-increment
    },
    venue: {
        type: Sequelize.STRING,
        allowNull: false,
        length: 255
    },
    img: {
        type: Sequelize.TEXT,
        allowNull: true,
    },
    description: {
        type: Sequelize.STRING,
        allowNull: false,
        length: 255
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

module.exports = imageVenueModel;