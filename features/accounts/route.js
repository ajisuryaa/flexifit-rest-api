const router = require('express').Router();
const accountController = require('./controller');
// Require the upload middleware
const FileUploader = require("../../tools/upload_image");
const uploader = new FileUploader("uploads/", ["image/jpeg", "image/png"], 2 * 1024 * 1024); // Max size 2MB

router.post('/', (req, res) => accountController.createAccount(req, res));
router.post('/registration', (req, res) => accountController.registerAccount(req, res));
router.patch('/:id', (req, res) => accountController.changePassword(req, res));
router.post('/image', uploader.uploadSingle("image"),(req, res) => accountController.changeImage(req, res));
router.get('/',(req, res) => accountController.getAllUser(req, res));
module.exports = {
    "name": accountController.prefix,
    "router": router
};