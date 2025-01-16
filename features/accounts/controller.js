const { accountModel } = require('../models');
const { hashPassword, comparePassword } = require('../../tools/hash');
const { userTypeEnum } = require('../enums');
const { v4: uuidv4 } = require('uuid');
const venueAccountController = require('../venue_accounts/controller');
const fs = require('fs');
const path = require('path');
const crypto = require('crypto');

class AccountController {
    constructor() {
        this.prefix = 'accounts';
    }

    generateCustomerId() {
        const prefix = 'CTR'; // Prefix for the ID, e.g., "Membership"
        const timestamp = Date.now().toString(36).toUpperCase(); // Convert current timestamp to base36
        const randomString = crypto.randomBytes(4).toString('hex').toUpperCase(); // Generate a random hex string
        return `${prefix}-${timestamp}-${randomString}`;
    }

    validateParams(params, type) {
        if (type == 'create') {
            if (Object.keys(params).length === 0) {
                return [false, "Parameters name, email, password and type be empty."];
            }
            if (!params.name) {
                return [false, "Parameters name account cannot be empty."];
            }
            if (!params.password) {
                return [false, "Parameters password account cannot be empty."];
            }
            if (!params.email) {
                return [false, "Parameters email account cannot be empty."];
            }
            if (!params.type) {
                return [false, "Parameters type account cannot be empty."];
            }
            if (!params.phone) {
                return [false, "Parameters phone account cannot be empty."];
            }
            if(params.level_account == userTypeEnum.ADMINVENUE){
                if (!params.venue_id) {
                    return [false, "Parameters venue id cannot be empty."];
                }
                if (!params.venue_level_account) {
                    return [false, "Parameters level account cannot be empty."];
                }
            }
        }
        if (type == 'customer registration') {
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
            let userData;
            if(req.body.type == userTypeEnum.ADMINVENUE){
                userData = {
                    uuid: codeFormat,
                    email: req.body.email,
                    name: req.body.name,
                    password: await hashPassword(req.body.password),
                    phone: req.body.phone,
                    level_account: req.body.type
                }
                let venueAccountData = {
                    id_account: codeFormat,
                    id_venue: req.body.venue,
                    level_account: req.body.level_account
                }
                await accountModel.create(userData);
                await venueAccountController.createAccountVenue(venueAccountData);
            } else{
                userData = {
                    uuid: codeFormat,
                    email: req.body.email,
                    name: req.body.name,
                    password: await hashPassword(req.body.password),
                    phone: req.body.phone,
                    level_account: req.body.type
                }
                accountModel.create(userData);
            }
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

    async registerAccount(req, res) {
        try {
        let [statusValidate, messageValidate] = this.validateParams(req.body, 'customer registration');
            if (statusValidate == false) {
                return res.status(200).json({
                    success: false,
                    message: messageValidate,
                });
            }
            let codeFormat = this.generateCustomerId();
            let userData;
            userData = {
                uuid: codeFormat,
                email: req.body.email,
                name: req.body.name,
                password: await hashPassword(req.body.password),
                phone: req.body.phone,
                level_account: "customer"
            }
            accountModel.create(userData);
            return res.status(200).send({
                success: true,
                message: 'Registration success',
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
                    uuid: req.params.id
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
        try {
            let [statusValidate, messageValidate] = this.validateParams(req, 'upload_image');
            if (statusValidate == false) {
                // Remove the uploaded file if no id is provided
                
                console.log(req.file);
                if (req.file) {
                    fs.unlinkSync(req.file.path);
                }
                return res.status(200).json({
                    success: false,
                    message: messageValidate,
                });
            }
            const account = await accountModel.findOne({
                where: {
                    uuid: req.body.id
                }
            });

            if (!account) {
                if (req.file) {
                    fs.unlinkSync(req.file.path);
                }
                return res.status(200).json({
                    success: false,
                    message: "User is not found",
                });
            }

            let userData = {
                image: `/uploads/${req.file.filename}`,
            }
            await accountModel.update(userData, {
                where: {
                    uuid: req.body.id
                }
            });

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

    // Show All User
    async getAllUser(req, res) {
        try {
            const accounts = await accountModel.findAll({
                where: {
                    deleted_at: null
                },
                attributes: ['uuid', 'email', 'image', 'name', 'phone', 'password', 'level_account', 'created_at', 'updated_at', 'deleted_at'],
            });
            if (accounts.length > 0) {
                return res.status(200).json({
                    success: true,
                    message: 'Succesfully get all account data.',
                    data: accounts
                });
            }
            return res.status(200).json({
                success: true,
                message: 'No account found.'
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