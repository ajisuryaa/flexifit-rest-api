const { cartModel } = require('../models');
const transactionController = require('../transactions/controller');

class CartController {
    constructor() {
        this.prefix = 'cart';
    }

    getTotalPrice(price, quantity){
        let total_price = price * quantity;
        return total_price;
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
            //check item in cart
            let check = await cartModel.findOne({
                where: {
                    id_transaction: data,
                    id_item: req.body.item,
                }
            });
            if(check){
                return res.status(400).json({
                    success: false,
                    message: "Item already in cart"
                });
            }
            let cartData = {
                id_transaction: data,
                id_item: req.body.item,
                quantity: req.body.quantity,
                price: req.body.price,
                total_price: this.getTotalPrice(req.body.price, req.body.quantity),
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

    async updateItemsInCart(req, res){
        try {
            const updates = req.body;
          
            for (const update of updates) {
              await User.sequelize.query(
                { name: update.quantity },
                {
                where: { id: userId }, // Condition: specific user ID
                }
              );
            }
          
            await transaction.commit();
            res.status(200).json({ message: 'Users updated successfully' });
          } catch (error) {
            await transaction.rollback();
            res.status(500).json({ error: error.message });
          }
    }

    
}

const cartController = new CartController();
module.exports = cartController;