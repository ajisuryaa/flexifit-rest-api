const { transactionModel, cartModel, membershipModel } = require('../models');
const { cartAttributes, membershipAttributes } = require('../list');
const FileUploader = require('../uploder_file');
const crypto = require('crypto');
const { Op } = require("sequelize");
const { stat } = require('fs');

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
                    deleted_at: null
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
                    deleted_at: null
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
            if(req.headers.status != null){
                status = req.headers.status;
            }
            console.log(req.headers.status);
            let query = {};
            if(status == 'all'){
                query = {
                    id_account: req.params.account,
                    deleted_at: null,
                    status: {
                        [Op.ne]: 'picking', // Not equal to 'picking'
                    }
                };
            } else{
                query = {
                    id_account: req.params.account,
                    status: req.headers.status,
                    deleted_at: null
                };
            }
            console.log(query);
            const transactions = await transactionModel.findAll({
                where: query,
                attributes: ['id_transaction', 'id_account', 'status', 'payment_approval', 'coupon_id', 'created_at', 'updated_at'],
                include: [
                    {
                        model: cartModel,// Specify cart fields to return
                        as: 'carts', // Specify the alias defined in the association
                        attributes: ['id_item', 'quantity', 'price', 'total_price'],
                        include: [
                           { 
                                model: membershipModel,
                                as: 'product_info'
                            }
                        ]
                        
                    },
                  ],
                  distinct: true, // Prevent row collapsing,
                  subQuery: false, // Prevent subquery optimization
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
                        as: 'carts',
                        attributes: ['quantity', 'price', 'total_price', 'type'],
                        required: true, // Ensures only records with associated carts are included
                        include: [
                            {
                                model: membershipModel,
                                as: 'product_info',
                                required: true, // Ensures only associated membership records are included
                                attributes: membershipAttributes,
                                where:  {
                                    venue_id: req.params.venue,
                                }
                            },
                        ],
                    },
                ],
            });
            console.log(transactions.length);
            if (transactions.length > 0) {
                return res.status(200).json({
                    success: true,
                    message: 'Succesfully get venue order.',
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

    statusTransactionList = ['picking', 'waiting approval', 'approval valid', 'on delivery', 'completed']; 

    getNextStatus(currentStatus) {
       if(currentStatus == 'waiting approval'){
        const currentIndex = this.statusTransactionList.indexOf(currentStatus);
        if (currentIndex === -1) {
            throw new Error('Invalid status: The provided status is not in the list.');
        }
        // Return the next status if it exists, otherwise null
        return this.statusTransactionList[4];
       } else{
        const currentIndex = this.statusTransactionList.indexOf(currentStatus);
        if (currentIndex === -1) {
            throw new Error('Invalid status: The provided status is not in the list.');
        }
        // Return the next status if it exists, otherwise null
        return this.statusTransactionList[currentIndex + 1] || null;
       }
    }

    async checkoutTransaction(req,res){
        try{
            let checkoutData = {
                coupon_id: req.body.coupon,
                status: this.getNextStatus(req.body.status),
                updated_at: new Date()
            }
            await transactionModel.update(checkoutData, {
                where: {
                    id_transaction : req.params.transaction
                }
            });
            return res.status(200).json({
                success: true,
                message: 'Success Checkout Transaction',
                data: checkoutData
            });
        } catch (error){
            return res.status(400).json({
                success: false,
                message: error.message
            });
        }
    }

    async updateStatusTransaction(req,res){
        try{
            let statusData = {
                status: this.getNextStatus(req.body.status),
                updated_at: new Date()
            }
            await transactionModel.update(statusData, {
                where: {
                    id_transaction : req.params.transaction
                }
            });
            return res.status(200).json({
                success: true,
                message: 'Success update status',
                data: statusData
            });
        } catch (error){
            return res.status(400).json({
                success: false,
                message: error.message
            });
        }
    }
    
}

const transactionController = new TransactionController();
module.exports = transactionController;