const router = require('express').Router();
const membershipController = require('./controller');
const token = require('../../tools/token');

router.post('/', token.jwtHandler, (req, res) => membershipController.createMembership(req, res));

module.exports = {
    "name": membershipController.prefix,
    "router": router
};