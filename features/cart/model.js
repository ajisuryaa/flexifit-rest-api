var Sequelize = require('sequelize');
const db = require('../../tools/db');
const { cartItemTypeEnum } = require('../enums');

const cartModel = db.define('cart', {
    id_transaction  : {
        primaryKey: true,
        type: Sequelize.STRING,
        length: 255
    },
    id_item: {
        type: Sequelize.STRING,
        allowNull: false,
        length: 255
    },
    quantity: {
        type: Sequelize.INTEGER,
        allowNull: false,
        length: 11
    },
    price: {
        type: Sequelize.INTEGER,
        allowNull: false,
        length: 11
    },
    type: {
        type: Sequelize.ENUM(
            cartItemTypeEnum.values
        ), // Defining enum values
        allowNull: false,
        defaultValue: cartItemTypeEnum
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

module.exports = cartModel;