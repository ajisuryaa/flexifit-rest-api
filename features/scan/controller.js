const { cartModel, transactionModel, membershipModel, venueModel } = require('../models');
const { cartAttributes, membershipAttributes } = require('../list');
class ScanController {
    constructor() {
        this.prefix = 'scan';
    }
    async scanCustomer(req, res) {
        try {
            const transactions = await transactionModel.findOne({
                attributes: ['id_transaction', 'id_account', 'status', 'payment_approval', 'coupon_id', 'created_at', 'updated_at'],
                where:  {
                    id_account: req.params.customerId,
                    status: 'completed'
                },
                include: [
                    {
                        model: cartModel,
                        as: 'carts',
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
            if (transactions) {
                return res.status(200).json({
                    success: true,
                    message: 'Succesfully get membership',
                    data: transactions
                });
            }
            return res.status(200).json({
                success: true,
                message: 'no membership'
            });
        } catch (error) {
            return res.status(400).json({
                success: false,
                message: error.message
            });
        }
    }


}

const scanController = new ScanController();
module.exports = scanController;