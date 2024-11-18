const { accountModel } = require('../models');
const { hashPassword, comparePassword } = require('../../tools/hash');
const { userTypeEnum } = require('../enums');
const { v4: uuidv4 } = require('uuid');

class AccountController {
    constructor() {
        this.prefix = 'accounts';
    }

    validateParams(params, type) {
        if (type == 'create') {
            if (Object.keys(params).length === 0) {
                return [false, "Parameters name, email, password and type be empty."];
            }
            if (!params.name) {
                return [false, "Parameters name cannot be empty."];
            }
            if (!params.password) {
                return [false, "Parameters password cannot be empty."];
            }
            if (!params.email) {
                return [false, "Parameters email cannot be empty."];
            }
            if (!params.level_account) {
                return [false, "Parameters type cannot be empty."];
            }
            if (!params.phone) {
                return [false, "Parameters phone cannot be empty."];
            }
        }
        if (type == 'edit') {
            if (Object.keys(params).length === 0) {
                return [false, "Parameters name, email and type be empty."];
            }
            if (!params.name) {
                return [false, "Parameters name cannot be empty."];
            }
            if (!params.email) {
                return [false, "Parameters email cannot be empty."];
            }
            if (!params.type) {
                return [false, "Parameters type cannot be empty."];
            }
        }
        if (type == 'change_password') {
            if (Object.keys(params).length === 0) {
                return [false, "Parameters old_password and new_password be empty."];
            }
            if (!params.old_password) {
                return [false, "Parameters old_password cannot be empty."];
            }
            if (!params.new_password) {
                return [false, "Parameters new_password cannot be empty."];
            }
        }
        if (type == 'upload_image') {
            if (Object.keys(params).length === 0) {
                return [false, "Parameters id and image be empty."];
            }
            if (!params.body.id) {
                return [false, "Parameters id cannot be empty."];
            }
            if (!params.file) {
                return [false, "Parameters image cannot be empty."];
            }
        }
        return [true, ""];
    }

    async createAccount(req, res) {
        try {
        let [statusValidate, messageValidate] = this.validateParams(req.body, 'create');
            if (statusValidate == false) {
                return res.status(200).json({
                    success: false,
                    message: messageValidate,
                });
            }
            let codeFormat = uuidv4();
            let userData = {
                uuid: codeFormat,
                email: req.body.email,
                name: req.body.name,
                password: await hashPassword(req.body.password),
                phone: req.body.phone,
                level_account: req.body.level_account
            }
            
            accountModel.create(userData);

            return res.status(200).send({
                success: true,
                message: 'Success create the user',
                data: userData
            });
        } catch (error){
            return res.status(400).json({
                success: false,
                message: error.message
            });
        }
    }

    async changePassword(req, res) {
        try {
            let [statusValidate, messageValidate] = this.validateParams(req.body, 'change_password');
            if (statusValidate == false) {
                return res.status(200).json({
                    success: false,
                    message: messageValidate,
                });
            }


            const account = await accountModel.findOne({
                where: {
                    uuid: "655e2bd2-85f0-4436-bcad-de2d282b94fc"
                }
            });

            if (!account) {
                return res.status(200).json({
                    success: false,
                    message: "User is not found",
                });
            }

            let matchingPassword = await comparePassword(req.body.old_password, account.password);
            if (!matchingPassword) {
                return res.status(200).json({
                    success: false,
                    message: 'Old Password is not match',
                });
            }

            let passwordData = {
                password: await hashPassword(req.body.new_password),
                updated_at: new Date()
            }
            await account.update(passwordData);

            return res.status(200).send({
                success: true,
                message: 'Success change password the user',
            });
        } catch (error) {
            return res.status(400).json({
                success: false,
                message: error.message
            });
        }
        
    }

    async changeImage(req, res) {
        console.log(req.headers['content-type']); // Log the Content-Type
        console.log(req.body);
        try {
            let [statusValidate, messageValidate] = this.validateParams(req, 'upload_image');
            if (statusValidate == false) {
                return res.status(200).json({
                    success: false,
                    message: messageValidate,
                });
            }
            res.status(200).send({
                message: 'File uploaded successfully!',
                filePath: `/uploads/${req.file.filename}`,
            });
        } catch (error) {
            return res.status(400).json({
                success: false,
                message: error.message
            });
        }
        
    }

}

const accountController = new AccountController();
module.exports = accountController;