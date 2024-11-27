const { transactionModel } = require('../models');
const { v4: uuidv4 } = require('uuid');
const crypto = require('crypto');

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
            if (!transactions) {
                return [false, null];
            }
            return [true, transactions.id_transaction];
        } catch (error) {
            return [false, error.message];
        }
    }
    
    async createTransaction(req, res) {
        try{
            let [status, id_transaction] = await this.findAvailableTransaction(req.body.account);
            console.log(status, id_transaction);
            if(status){
                return res.status(200).json({
                    success: true,
                    message: "Can't create new transaction, you still have picking transaction",
                });
            } else{
                let transactionId = this.generateTransactionID();
                let transactionData = {
                    id_transaction: transactionId,
                    id_account: req.body.account,
                    status: "picking",
                    payment_approval: null,
                    coupon_id: req.body.coupon
                }
                await transactionModel.create(transactionData);
                return res.status(200).json({
                    success: true,
                    message: 'Create transaction success',
                    data: transactionData
                });
            }
        } catch (error){
            return res.status(400).json({
                success: false,
                message: error.message
            });
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

    
}

const transactionController = new TransactionController();
module.exports = transactionController;