var Sequelize = require('sequelize');
const db = require('../../tools/db');
const { userTypeEnum } = require('../enums');

const accountModel = db.define('accounts', {
    uuid: {
        primaryKey: true,
        type: Sequelize.STRING,
        length: 255
    },
    email: {
        type: Sequelize.STRING,
        allowNull: false,
        length: 255
    },
    image: {
        type: Sequelize.TEXT,
        allowNull: true,
    },
    name: {
        type: Sequelize.STRING,
        allowNull: false,
        length: 255
    },
    phone: {
        type: Sequelize.STRING,
        allowNull: false,
        length: 13
    },
    password: {
        type: Sequelize.STRING,
        allowNull: false,
        length: 100
    },
    level_account: {
        type: Sequelize.ENUM(
            userTypeEnum.values
        ), // Defining enum values
        allowNull: false,
        defaultValue: userTypeEnum.ADMIN
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

module.exports = accountModel;