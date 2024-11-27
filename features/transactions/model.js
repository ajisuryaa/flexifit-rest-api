var Sequelize = require('sequelize');
const db = require('../../tools/db');
const { statusTransactionEnum } = require('../enums');

const transactionModel = db.define('transactions', {
    id_transaction  : {
        primaryKey: true,
        type: Sequelize.STRING,
        length: 255
    },
    id_account: {
        type: Sequelize.STRING,
        allowNull: false,
        length: 255
    },
    status: {
        type: Sequelize.ENUM(
            statusTransactionEnum.values
        ), // Defining enum values
        allowNull: false,
        defaultValue: statusTransactionEnum.PICKING
    },
    payment_approval: {
        type: Sequelize.TEXT,
        allowNull: true,
        length: 13
    },
    coupon_id: {
        type: Sequelize.DOUBLE,
        allowNull: true,
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

module.exports = transactionModel;