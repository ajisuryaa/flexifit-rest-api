const multer = require("multer");
const path = require("path");

class FileUploader {
  constructor(destination = "../uploads/", allowedFileTypes = [], maxSize = 5 * 1024 * 1024) {
    this.destination = destination;
    this.allowedFileTypes = allowedFileTypes;
    this.maxSize = maxSize;

    // Configure Multer storage
    this.storage = multer.diskStorage({
      destination: (req, file, cb) => {
        cb(null, this.destination);
      },
      filename: (req, file, cb) => {
        const uniqueSuffix = Date.now() + "-" + Math.round(Math.random() * 1e9);
        cb(null, uniqueSuffix + path.extname(file.originalname));
      },
    });

    // File filter for allowed types
    this.fileFilter = (req, file, cb) => {
      if (this.allowedFileTypes.length && !this.allowedFileTypes.includes(file.mimetype)) {
        return cb(new Error("Invalid file type"), false);
      }
      cb(null, true);
    };

    // Initialize multer
    this.uploader = multer({
      storage: this.storage,
      limits: { fileSize: this.maxSize },
      fileFilter: this.fileFilter,
    });
  }

  // Middleware to handle file upload in routes
  uploadSingle(fieldName) {
    return this.uploader.single(fieldName);
  }

  // Middleware for multiple file uploads
  uploadMultiple(fieldName, maxCount) {
    return this.uploader.array(fieldName, maxCount);
  }

  // Function to upload directly without route middleware
  uploadImage(req, res, fieldName) {
    return new Promise((resolve, reject) => {
      const uploadHandler = this.uploader.single(fieldName);

      uploadHandler(req, res, (err) => {
        if (err) {
          return reject(err);
        }
        if (!req.file) {
          return reject(new Error("No file uploaded"));
        }
        resolve(req.file); // Resolve with the uploaded file details
      });
    });
  }
}

module.exports = FileUploader;
