const router = require('express').Router();
const authenticationController = require('./controller');
const token = require('../../tools/token');

router.post('/login', (req, res) => authenticationController.login(req, res));

router.post('/logout', token.jwtHandler, (req, res) => authenticationController.logout(req, res));

router.get('/refresh', (req, res) => authenticationController.refresh(req, res));

module.exports = {
    "name": authenticationController.prefix,
    "router": router
};