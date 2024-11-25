const { venueAccountModel } = require('../models');

class VenueAccountController {
    constructor() {
        this.prefix = 'venue_accounts';
    }

    async createAccountVenue(data) {
        try{
            let accountData = {
                id_account: data.uuid,
                id_venue: data.name,
                level_account: data.address
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