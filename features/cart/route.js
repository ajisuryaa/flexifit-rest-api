const router = require('express').Router();
const cartController = require('./controller');
const token = require('../../tools/token');

router.post('/', token.jwtHandler, (req, res) => cartController.addItemIntoCart(req, res));

module.exports = {
    "name": cartController.prefix,
    "router": router
};