const router = require('express').Router();
const scanController = require('./controller');
const token = require('../../tools/token');

router.get('/:venue/:customerId', token.jwtHandler, (req, res) => scanController.scanCustomer(req, res));

module.exports = {
    "name": scanController.prefix,
    "router": router
};