const { venueAccountModel } = require('../models');

class VenueAccountController {
    constructor() {
        this.prefix = 'venue_accounts';
    }

    async createAccountVenue(data) {
        try{
            let accountData = {
                id_account: data.id_account,
                id_venue: data.id_venue,
                level_account: data.level_account
            }
            await venueAccountModel.create(accountData);
            return ["true", "create account success"];
        } catch (error){
            return ["false", error.message];
        }
    }
}

const venueAccountController = new VenueAccountController();
module.exports = venueAccountController;