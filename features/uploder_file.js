const fs = require('fs');
const path = require('path');

class FileUploader {
  constructor(uploadDir = 'uploads', allowedFormats = ['jpeg', 'jpg', 'png']) {
    this.uploadDir = path.resolve(uploadDir);
    this.allowedFormats = allowedFormats;

    // Ensure upload directory exists
    if (!fs.existsSync(this.uploadDir)) {
      fs.mkdirSync(this.uploadDir, { recursive: true });
    }
  }

  /**
   * Validates file format based on allowed formats
   * @param {string} fileName - The name of the file
   * @returns {boolean}
   */
  isValidFormat(fileName) {
    const extension = path.extname(fileName).toLowerCase().replace('.', '');
    return this.allowedFormats.includes(extension);
  }

  /**
   * Saves the uploaded file to the disk
   * @param {string} fileName - The original file name
   * @param {Buffer} fileBuffer - The file content as a Buffer
   * @returns {string} - The file path where the file is saved
   */
  saveFile(fileName, fileBuffer) {
    const uniqueName = `${Date.now()}-${fileName}`;
    const filePath = path.join(this.uploadDir, uniqueName);

    fs.writeFileSync(filePath, fileBuffer);
    return filePath;
  }
}

module.exports = FileUploader;
