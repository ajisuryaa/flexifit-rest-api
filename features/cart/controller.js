const { cartModel } = require('../models');
const transactionController = require('../transactions/controller');

class CartController {
    constructor() {
        this.prefix = 'cart';
    }
    
    async addItemIntoCart(req, res) {
        try{
            let [status, data] = await transactionController.findAvailableTransaction(req.body.account);
            if(!status){
                return res.status(400).json({
                    success: false,
                    message: "Failed add item into cart"
                });
            }
            let cartData = {
                id_transaction: data,
                id_item: req.body.item,
                quantity: req.body.quantity,
                price: req.body.price,
                type: req.body.type,
            };
            await cartModel.create(cartData);
            return res.status(200).json({
                success: true,
                message: 'Add item into cart success.',
                id_transaction: data
            });
        } catch (error){
            return res.status(400).json({
                success: false,
                message: error.message
            });
        }
    }

    
}

const cartController = new CartController();
module.exports = cartController;