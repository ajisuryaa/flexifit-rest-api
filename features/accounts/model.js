var Sequelize = require('sequelize');
const db = require('../../tools/db');
const { userTypeEnum } = require('../enums');

const userModel = db.define('accounts', {
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
    name: {
        type: Sequelize.STRING,
        allowNull: false,
        length: 255
    },
    phone: {
        type: Sequelize.STRING,
        allowNull: false,
        length: 255
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
}, {
    freezeTableName: true,
    createdAt: false,
    updatedAt: false,
    deletedAt: false,
});

module.exports = userModel;