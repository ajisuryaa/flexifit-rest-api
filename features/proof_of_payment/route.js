const router = require('express').Router();
const proofPaymentController = require('./controller');
const token = require('../../tools/token');
// Require the upload middleware
const FileUploader = require("../../tools/upload_image");
const uploader = new FileUploader("uploads/", ["image/jpeg", "image/png"], 2 * 1024 * 1024); // Max size 2MB

router.post('/:transaction', uploader.uploadSingle("image"), token.jwtHandler, (req, res) => proofPaymentController.updateStatusTransaction(req, res));

module.exports = {
    "name": proofPaymentController.prefix,
    "router": router
};