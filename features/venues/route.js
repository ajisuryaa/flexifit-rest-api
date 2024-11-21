const router = require('express').Router();
const venueController = require('./controller');
const token = require('../../tools/token');

router.post('/', token.jwtHandler, (req, res) => venueController.createVenue(req, res));
router.get('/', token.jwtHandler, (req, res) => venueController.getAllVenues(req, res));
router.get('/:uuid', token.jwtHandler, (req, res) => venueController.getVenue(req, res));

module.exports = {
    "name": venueController.prefix,
    "router": router
};