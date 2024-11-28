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

    
}

const transactionController = new TransactionController();
module.exports = transactionController;