
const { transactionModel } = require('../models');

class ProofPaymentController {
    constructor() {
        this.prefix = 'payment-upload';
    }

    async updateStatusTransaction(req,res){
        try{
            let filePath = {
                image: req.file.filename,
            }
            let statusData = {
                payment_approval: filePath.image,
                updated_at: new Date()
            }
            await transactionModel.update(statusData, {
                where: {
                    id_transaction : req.params.transaction
                }
            });
            return res.status(200).json({
                success: true,
                message: 'Success upload payment proof',
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

const proofPaymentController = new ProofPaymentController();
module.exports = proofPaymentController;