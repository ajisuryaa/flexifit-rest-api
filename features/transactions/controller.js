const { transactionModel, cartModel, membershipModel } = require('../models');
const { cartAttributes, membershipAttributes } = require('../list');
const crypto = require('crypto');
const { where } = require('sequelize');

class TransactionController {
    constructor() {
        this.prefix = 'transaction';
    }

    /**
     * Generate a unique ID for membership.
     * @returns {string} Unique membership ID.
     */
    generateTransactionID() {
        const prefix = 'TRS'; // Prefix for the ID, e.g., "Membership"
        const timestamp = Date.now().toString(36).toUpperCase(); // Convert current timestamp to base36
        const randomString = crypto.randomBytes(4).toString('hex').toUpperCase(); // Generate a random hex string
        return `${prefix}-${timestamp}-${randomString}`;
    }

    async findAvailableTransaction(id_account){
        try {
            const transactions = await transactionModel.findOne({
                where: {
                    status: "picking",
                    id_account: id_account, 
                    deleted_at: !null
                },
                attributes: ['id_transaction', 'id_account', 'status', 'payment_approval', 'coupon_id', 'created_at', 'updated_at'],
            });
            // if still have id transaction in status picking, return id transaction
            if (transactions) {
                return [true, transactions.id_transaction];
            }
            // if dont have any id transaction, create new id transaction
            return await this.createTransaction(id_account);
        } catch (error) {
            return [false, error.message];
        }
    }
    
    async createTransaction(id_account) {
        try{
            let transactionId = this.generateTransactionID();
            let transactionData = {
                id_transaction: transactionId,
                id_account: id_account,
                status: "picking",
                payment_approval: null,
                coupon_id: null
            }
            await transactionModel.create(transactionData);
            return [true, transactionId];
        } catch (error){
            return [false, error.message];
        }
    }

    // Show All Transaction For Super Admin Apps
    async getAllTransaction(req, res) {
        try {
            const transactions = await transactionModel.findAll({
                where: {
                    deleted_at: !null
                },
                attributes: ['id_transaction', 'id_account', 'status', 'payment_approval', 'coupon_id', 'created_at', 'updated_at'],
            });
            if (transactions.length > 0) {
                return res.status(200).json({
                    success: true,
                    message: 'Succesfully get all transaction data.',
                    data: transactions
                });
            }
            return res.status(200).json({
                success: true,
                message: 'No transaction history.'
            });
        } catch (error) {
            return res.status(400).json({
                success: false,
                message: error.message
            });
        }
    }

    // get customer transaction
    async getCustomerTransaction(req, res) {
        try {
            let status = 'all';
            if(req.header.status != null){
                status = req.header.status;
            }

            let query = {};
            if(status == 'all'){
                query = {
                    id_account: req.params.account,
                    deleted_at: !null
                };
            } else{
                query = {
                    id_account: req.params.account,
                    status: req.header.status,
                    deleted_at: !null
                };
            }
            const transactions = await transactionModel.findAll({
                where: query,
                attributes: ['id_transaction', 'id_account', 'status', 'payment_approval', 'coupon_id', 'created_at', 'updated_at'],
                include: [
                    {
                        model: cartModel,
                        as: 'list_items',
                        attributes: cartAttributes,
                        include: [
                            {
                                model: membershipModel,
                                as: 'product_info',
                                attributes: membershipAttributes,
                            },
                        ],
                    },
                ],
            });
            if (transactions.length > 0) {
                return res.status(200).json({
                    success: true,
                    message: 'Succesfully get latest cart.',
                    data: transactions
                });
            }
            return res.status(200).json({
                success: true,
                message: 'No transaction history.'
            });
        } catch (error) {
            return res.status(400).json({
                success: false,
                message: error.message
            });
        }
    }

    // get customer transaction
    async getVenueOrder(req, res) {
        try {
            const transactions = await transactionModel.findAll({
                attributes: ['id_transaction', 'id_account', 'status', 'payment_approval', 'coupon_id', 'created_at', 'updated_at'],
                include: [
                    {
                        model: cartModel,
                        as: 'list_items',
                        attributes: ['quantity', 'price', 'total_price', 'type'],
                        include: [
                            {
                                model: membershipModel,
                                as: 'product_info',
                                attributes: membershipAttributes,
                                where:  {
                                    venue_id: req.params.venue,
                                }
                            },
                        ],
                    },
                ],
            });
            if (transactions.length > 0) {
                return res.status(200).json({
                    success: true,
                    message: 'Succesfully get latest cart.',
                    data: transactions
                });
            }
            return res.status(200).json({
                success: true,
                message: 'No transaction history.'
            });
        } catch (error) {
            return res.status(400).json({
                success: false,
                message: error.message
            });
        }
    }
    
}

const transactionController = new TransactionController();
module.exports = transactionController;