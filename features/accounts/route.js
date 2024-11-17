const router = require('express').Router();
const accountController = require('./controller');


router.post('/', (req, res) => accountController.createAccount(req, res));

module.exports = {
    "name": accountController.prefix,
    "router": router
};