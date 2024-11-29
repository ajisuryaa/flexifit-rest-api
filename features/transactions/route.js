const router = require('express').Router();
const transactionController = require('./controller');
const token = require('../../tools/token');

router.post('/', token.jwtHandler, (req, res) => transactionController.createTransaction(req, res));
router.get('/', token.jwtHandler, (req, res) => transactionController.getAllTransaction(req, res));
router.get('/customer/:account', token.jwtHandler, (req, res) => transactionController.getCustomerTransaction(req, res));
router.get('/venue/:venue', token.jwtHandler, (req, res) => transactionController.getVenueOrder(req, res));

module.exports = {
    "name": transactionController.prefix,
    "router": router
};