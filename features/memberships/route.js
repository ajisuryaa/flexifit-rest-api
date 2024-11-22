const router = require('express').Router();
const membershipController = require('./controller');
const token = require('../../tools/token');

router.post('/', token.jwtHandler, (req, res) => membershipController.createMembership(req, res));
router.get('/:venue', token.jwtHandler, (req, res) => membershipController.getListMembership(req, res));
router.put('/:venue/:id', token.jwtHandler, (req, res) => membershipController.editInformationMembership(req, res));
router.delete('/:venue/:id', token.jwtHandler, (req, res) => membershipController.deleteMembership(req, res));
module.exports = {
    "name": membershipController.prefix,
    "router": router
};