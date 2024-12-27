const router = require('express').Router();
const imageVenueController = require('./controller');
// Require the upload middleware
const FileUploader = require("../../tools/upload_image");
const uploader = new FileUploader("uploads/", ["image/jpeg", "image/png"], 2 * 1024 * 1024); // Max size 2MB
const token = require('../../tools/token');

router.post('/', uploader.uploadSingle("image"), (req, res) => imageVenueController.uploadImage(req, res));
router.get('/:venue', token.jwtHandler, (req, res) => imageVenueController.getGalleryVenue(req, res));
module.exports = {
    "name": imageVenueController.prefix,
    "router": router
};