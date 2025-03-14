const router = require('express').Router();
const cartController = require('./controller');
const token = require('../../tools/token');

router.post('/', token.jwtHandler, (req, res) => cartController.addItemIntoCart(req, res));
router.get('/:id', token.jwtHandler, (req, res) => cartController.getListItemsInCart(req, res));
router.delete('/:transaction/:item', token.jwtHandler, (req, res) => cartController.removeItem(req, res));
module.exports = {
    "name": cartController.prefix,
    "router": router
};