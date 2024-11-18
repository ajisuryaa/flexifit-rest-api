const router = require('express').Router();
const accountController = require('./controller');
// Require the upload middleware
const upload = require('../../tools/upload_image');

router.post('/', (req, res) => accountController.createAccount(req, res));
router.patch('/:id', (req, res) => accountController.changePassword(req, res));
router.post('/image', upload.single('image'), (req, res) => accountController.changeImage(req, res));
module.exports = {
    "name": accountController.prefix,
    "router": router
};