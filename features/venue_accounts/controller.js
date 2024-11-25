const { venueAccountModel } = require('../models');

class VenueAccountController {
    constructor() {
        this.prefix = 'venue_accounts';
    }

    async createAccountVenue(req, res) {
        try{
            let accountData = {
                id_account: uuid,
                id_venue: req.body.name,
                level_account: req.body.address
            }
            await venueAccountModel.create(accountData);
            return res.status(200).json({
                success: true,
                message: 'Add new venue success',
                data: venueData
            });
        } catch (error){
            return res.status(400).json({
                success: false,
                message: error.message
            });
        }
    }
}

const venueAccountController = new VenueAccountController();
module.exports = venueAccountController;