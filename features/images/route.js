const router = require('express').Router();
const token = require('../../tools/token');
const imageController = require('./controller');
// Routes
router.get('/:fileName', token.jwtHandler, (req, res) => imageController.serveImage(req, res));

module.exports = {
    "name": imageController.prefix,
    "router": router
};