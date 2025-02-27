const { cartModel, membershipModel, venueModel } = require('../models');
const transactionController = require('../transactions/controller');
const { membershipAttributes, venueAttributes } = require('../list');
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

    async getListItemsInCart(req, res){
        try{
            let listItems = await cartModel.findAll({
                where: {
                    id_transaction: req.params.id,
                },
                attributes: ['id_transaction', 'quantity', 'price', 'total_price', 'type'],
                include: [
                    {
                        model: membershipModel,
                        as: 'product_info',
                        attributes: membershipAttributes,
                        include: [
                            {
                                model: venueModel,
                                as: 'venue',
                                attributes: venueAttributes,
                            },
                        ],
                    },
                ],
            });
            if(listItems == null){
                return res.status(200).json({
                    success: false,
                    message: "Empty cart."
                });
            } 
            return res.status(200).json({
                success: true,
                message: 'Success get list items in cart',
                data: listItems
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

    async removeItem(req, res) {
        try {
            // Remove the membership based on the provided ID
            const result = await cartModel.destroy({
                where: {
                    id_transaction: req.params.transaction,
                    id_item: req.params.item
                }
            });
    
            // Check if the item was deleted
            if (result) {
                return res.status(200).json({
                    success: true,
                    message: 'Delete item success.',
                });
            } else {
                return res.status(404).json({
                    success: false,
                    message: 'item not found.',
                });
            }
        } catch (error) {
            return res.status(400).json({
                success: false,
                message: error.message
            });
        }
    }
}

const cartController = new CartController();
module.exports = cartController;