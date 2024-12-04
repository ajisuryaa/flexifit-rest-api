const fs = require('fs');
const path = require('path');

class ImageController {
  constructor() {
    this.uploadDir = path.join(__dirname, '../../uploads');
    this.prefix = 'images';
  }

  // Serve an image by its name
  serveImage(req, res) {
    const { fileName } = req.params;

    // Validate file type
    const allowedExtensions = ['.jpg', '.jpeg', '.png', '.gif'];
    const fileExtension = path.extname(fileName);
    if (!allowedExtensions.includes(fileExtension.toLowerCase())) {
      return res.status(400).json({ error: 'Invalid file type' });
    }

    const filePath = path.join(this.uploadDir, fileName);

    // Check if the file exists
    if (!fs.existsSync(filePath)) {
      return res.status(404).json({ error: 'Image not found' });
    }

    // Send the file
    res.sendFile(filePath);
  }

  // Middleware to handle static file serving
  staticDirectory(req, res, next) {
    const staticPath = path.join(__dirname, '../../uploads');
    express.static(staticPath)(req, res, next);
  }
}

const imageController = new ImageController();
module.exports = imageController;
