const { venueModel } = require('../models');
const { v4: uuidv4 } = require('uuid');
const moment = require('moment'); 

class VenueController {
    constructor() {
        this.prefix = 'venue';
    }

    validateParams(params, type) {
        if (type == 'create') {
            if (Object.keys(params).length === 0) {
                return [false, "Parameters datas cannot be empty."];
            }
            if (!params.name) {
                return [false, "Parameters name cannot be empty."];
            }
            if (!params.address) {
                return [false, "Parameters address cannot be empty."];
            }
            if (!params.contact_number) {
                return [false, "Parameters contact number cannot be empty."];
            }
            if (typeof params.latitude !== 'number' || !Number.isFinite(params.latitude)) {
                return [false, "Parameters latitude cannot be empty."];
            }
            if (typeof params.longitude !== 'number' || !Number.isFinite(params.longitude)) {
                return [false, "Parameters longitude cannot be empty."];
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
        return [true, ""];
    }
    async createVenue(req, res) {
        let [statusValidate, messageValidate] = this.validateParams(req.body, "create");
            console.log(req.body);
            if (statusValidate == false) {
                return res.status(200).json({
                    success: false,
                    message: messageValidate,
                });
            }
            let uuid = uuidv4();
            let venueData = {
                uuid: uuid,
                name: req.body.name,
                address: req.body.address,
                contact_number: req.body.contact_number,
                latitude: req.body.latitude,
                longitude: req.body.longitude
            }
            await venueModel.create(venueData);
            return res.status(200).json({
                success: true,
                message: 'Registration data has been created.',
                data: venueData
            });
    }

    async getAllVenues(req, res) {
        try {
            const venues = await venueModel.findAll({
                where: {
                    deleted_at: !null
                },
                attributes: ['uuid', 'name', 'address', 'contact_number', 'longitude', 'latitude', 'created_at', 'updated_at'],
            });

            // Map through the data and reformat the dates
            // const reformattedVenues = venues.map(venue => ({
            //     ...venue.toJSON(), // Convert Sequelize object to plain object
            //     created_at: moment(venue.created_at).format('YYYY-MM-DD HH:mm:s'), // Reformat created_at
            //     updated_at: moment(venue.updated_at).format('YYYY-MM-DD HH:mm:s'), // Reformat updated_at
            // }));

            if (venues.length > 0) {
                return res.status(200).json({
                    success: true,
                    message: 'Succesfully get all venues data.',
                    data: venues
                });
            }

            return res.status(200).json({
                success: true,
                message: 'Venues data is empty.'
            });
        } catch (error) {
            return res.status(400).json({
                success: false,
                message: error.message
            });
        }
    }
}

const venueController = new VenueController();
module.exports = venueController;