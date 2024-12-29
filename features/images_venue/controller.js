const { imageVenueModel } = require('../models');
const fs = require('fs');

class ImageVenueController {
    constructor() {
        this.prefix = 'gallery';
    }

    validateParams(params, type) {
        if (Object.keys(params).length === 0) {
            return [false, "Parameters image and image be empty."];
        }
        if (!params.body.description) {
            return [false, "Parameters description cannot be empty."];
        }
        if (!params.file) {
            return [false, "Parameters image cannot be empty."];
        }
        return [true, ""];
    }

    async uploadImage(req, res) {
        console.log("description: " + req.body.description);
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

            let imageData = {
                venue: req.body.venue,
                img: req.file.filename,
                description: req.body.description
            }
            await imageVenueModel.create(imageData);

            res.status(200).send({
                success: true,
                message: 'File uploaded successfully!',
                data: req.file.filename,
            });
        } catch (error) {
            return res.status(400).json({
                success: false,
                message: error.message
            });
        }
        
    }

    async getGalleryVenue(req, res){
        try{
            let listImages = await imageVenueModel.findAll({
                where: {
                    venue: req.params.venue,
                    deleted_at: null
                },
                attributes: ['id', 'venue', 'img', 'description', 'created_at', 'updated_at', 'deleted_at'],
            });
            if(listImages == null){
                return res.status(200).json({
                    success: false,
                    message: "Empty gallery."
                });
            } 
            return res.status(200).json({
                success: true,
                message: 'Success get images in gallery.',
                data: listImages
            });
        } catch (error){
            return res.status(400).json({
                success: false,
                message: error.message
            });
        }
    }

}

const imageVenueController = new ImageVenueController();
module.exports = imageVenueController;