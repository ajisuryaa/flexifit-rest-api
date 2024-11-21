const { membershipModel } = require('../models');
const { v4: uuidv4 } = require('uuid');
const crypto = require('crypto');

class MembershipController {
    constructor() {
        this.prefix = 'membership';
    }

    validateParams(params, type) {
        if (type == 'create') {
            if (Object.keys(params).length === 0) {
                return [false, "Parameters datas cannot be empty."];
            }
            if (!params.venue_id) {
                return [false, "Parameters venue cannot be empty."];
            }
            if (!params.name) {
                return [false, "Parameters name cannot be empty."];
            }
            if (!params.description) {
                return [false, "Parameters description cannot be empty."];
            }
            if (typeof params.price !== 'number' || !Number.isFinite(params.price)) {
                return [false, "Parameters price cannot be empty."];
            }
        }
        // if (type == 'edit') {
        //     if (Object.keys(params).length === 0) {
        //         return [false, "Parameters name, email and type be empty."];
        //     }
        //     if (!params.name) {
        //         return [false, "Parameters name cannot be empty."];
        //     }
        //     if (!params.address) {
        //         return [false, "Parameters email cannot be empty."];
        //     }
        //     if (!params.contact_number) {
        //         return [false, "Parameters type cannot be empty."];
        //     }
        // }
        return [true, ""];
    }

    /**
     * Generate a unique ID for membership.
     * @returns {string} Unique membership ID.
     */
    generateMembershipID() {
        const prefix = 'MEM'; // Prefix for the ID, e.g., "Membership"
        const timestamp = Date.now().toString(36).toUpperCase(); // Convert current timestamp to base36
        const randomString = crypto.randomBytes(4).toString('hex').toUpperCase(); // Generate a random hex string
        return `${prefix}-${timestamp}-${randomString}`;
    }
    
    async createMembership(req, res) {
        try{
            let [statusValidate, messageValidate] = this.validateParams(req.body, "create");
            if (statusValidate == false) {
                return res.status(200).json({
                    success: false,
                    message: messageValidate,
                });
            }
            let uuid = this.generateMembershipID();
            let membershipData = {
                id: uuid,
                venue_id: req.body.venue_id,
                name: req.body.name,
                description: req.body.description,
                price: req.body.price
            }
            await membershipModel.create(membershipData);
            return res.status(200).json({
                success: true,
                message: 'Add new membership success',
                data: membershipData
            });
        } catch (error){
            return res.status(400).json({
                success: false,
                message: error.message
            });
        }
    }

    // async getAllMembership(req, res) {
    //     try {
    //         const venues = await venueModel.findAll({
    //             where: {
    //                 deleted_at: !null
    //             },
    //             attributes: ['uuid', 'name', 'address', 'contact_number', 'longitude', 'latitude', 'created_at', 'updated_at'],
    //         });

    //         //Map through the data and reformat the dates
    //         const reformattedVenues = venues.map(venue => ({
    //             ...venue.toJSON(), // Convert Sequelize object to plain object
    //             created_at: moment(venue.created_at).format('YYYY-MM-DD HH:mm:s'), // Reformat created_at
    //             updated_at: moment(venue.updated_at).format('YYYY-MM-DD HH:mm:s'), // Reformat updated_at
    //         }));

    //         if (venues.length > 0) {
    //             return res.status(200).json({
    //                 success: true,
    //                 message: 'Succesfully get all venues data.',
    //                 data: reformattedVenues
    //             });
    //         }

    //         return res.status(200).json({
    //             success: true,
    //             message: 'Venues data is empty.'
    //         });
    //     } catch (error) {
    //         return res.status(400).json({
    //             success: false,
    //             message: error.message
    //         });
    //     }
    // }

    // async getVenue(req, res) {
    //     try {
    //         const venue = await venueModel.findOne({
    //             where: {
    //                 uuid: req.params.uuid,
    //                 deleted_at: !null
    //             },
    //             attributes: ['uuid', 'name', 'address', 'contact_number', 'longitude', 'latitude', 'created_at', 'updated_at'],
    //         });

    //         return res.status(200).json({
    //             success: true,
    //             message: 'Succesfully get venue data.',
    //             data: venue
    //         });
    //     } catch (error) {
    //         return res.status(400).json({
    //             success: false,
    //             message: error.message
    //         });
    //     }
    // }

    // async editInformationVenue(req, res) {
    //     try{
    //         let [statusValidate, messageValidate] = this.validateParams(req.body, "edit");
    //         console.log(req.body);
    //         if (statusValidate == false) {
    //             return res.status(200).json({
    //                 success: false,
    //                 message: messageValidate,
    //             });
    //         }
    //         let venueData = {
    //             name: req.body.name,
    //             address: req.body.address,
    //             contact_number: req.body.contact_number,
    //         }
    //         await venueModel.update(venueData, {
    //             where: {
    //                 uuid: req.params.uuid
    //             }
    //         });
    //         return res.status(200).json({
    //             success: true,
    //             message: 'Edit venue information success.',
    //             data: venueData
    //         });
    //     } catch (error){
    //         return res.status(400).json({
    //             success: false,
    //             message: error.message
    //         });
    //     }
    // }

    // async deleteVenue(req, res) {
    //     try{
    //         const venue = await venueModel.findOne({
    //             where: {
    //                 uuid: req.params.uuid,
    //                 deleted_at: !null
    //             },
    //             attributes: ['uuid', 'name', 'address', 'contact_number', 'longitude', 'latitude', 'deleted_at'],
    //         });
    //         if(venue.isEmpty){
    //             return res.status(200).json({
    //                 success: false,
    //                 message: 'Venue not found',
    //             });
    //         }
    //         let venueData = {
    //             updated_at: new Date(),
    //             deleted_at: new Date(),
    //         }
    //         await venueModel.update(venueData, {
    //             where: {
    //                 uuid: req.params.uuid
    //             }
    //         });
    //         return res.status(200).json({
    //             success: true,
    //             message: 'Delete venue information success.',
    //             data: venueData
    //         });
    //     } catch (error){
    //         return res.status(400).json({
    //             success: false,
    //             message: error.message
    //         });
    //     }
    // }
}

const membershipController = new MembershipController();
module.exports = membershipController;