const { venueModel, membershipModel } = require('../models');
const { v4: uuidv4 } = require('uuid');
const { membershipAttributes, venueAttributes } = require('../list');

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
            if (!params.address) {
                return [false, "Parameters email cannot be empty."];
            }
            if (!params.contact_number) {
                return [false, "Parameters type cannot be empty."];
            }
        }
        return [true, ""];
    }
    async createVenue(req, res) {
        try{
            let [statusValidate, messageValidate] = this.validateParams(req.body, "create");
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

    async getAllVenues(req, res) {
        try {
            const venues = await venueModel.findAll({
                where: {
                    deleted_at: null
                },
                attributes: ['uuid', 'name', 'about', 'email', 'address', 'contact_number', 'longitude', 'latitude', 'created_at', 'updated_at'],
            });

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

    async getVenue(req, res) {
        try {
            const venue = await venueModel.findOne({
                where: {
                    uuid: req.params.uuid,
                    deleted_at: null
                },
                attributes: ['uuid', 'name', 'about', 'email', 'address', 'contact_number', 'longitude', 'latitude', 'created_at', 'updated_at'],
                include: [
                    {
                        model: membershipModel,
                        as: 'memberships',
                        attributes: membershipAttributes,
                    },
                ],
            });
            return res.status(200).json({
                success: true,
                message: 'Succesfully get venue data.',
                data: venue
            });
        } catch (error) {
            return res.status(400).json({
                success: false,
                message: error.message
            });
        }
    }

    async editInformationVenue(req, res) {
        try{
            let [statusValidate, messageValidate] = this.validateParams(req.body, "edit");
            console.log(req.body);
            if (statusValidate == false) {
                return res.status(200).json({
                    success: false,
                    message: messageValidate,
                });
            }
            let venueData = {
                name: req.body.name,
                address: req.body.address,
                contact_number: req.body.contact_number,
            }
            await venueModel.update(venueData, {
                where: {
                    uuid: req.params.uuid
                }
            });
            return res.status(200).json({
                success: true,
                message: 'Edit venue information success.',
                data: venueData
            });
        } catch (error){
            return res.status(400).json({
                success: false,
                message: error.message
            });
        }
    }

    async deleteVenue(req, res) {
        try{
            const venue = await venueModel.findOne({
                where: {
                    uuid: req.params.uuid,
                    deleted_at: null
                },
                attributes: ['uuid', 'name', 'address', 'contact_number', 'longitude', 'latitude', 'deleted_at'],
            });
            if(venue.isEmpty){
                return res.status(200).json({
                    success: false,
                    message: 'Venue not found',
                });
            }
            let venueData = {
                updated_at: new Date(),
                deleted_at: new Date(),
            }
            await venueModel.update(venueData, {
                where: {
                    uuid: req.params.uuid
                }
            });
            return res.status(200).json({
                success: true,
                message: 'Delete venue information success.',
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

const venueController = new VenueController();
module.exports = venueController;