const fs = require('fs');
const path = require('path');

class FileUploader {
  constructor(uploadDir = 'uploads') {
    this.uploadDir = path.resolve(uploadDir);

    // Ensure the upload directory exists
    if (!fs.existsSync(this.uploadDir)) {
      fs.mkdirSync(this.uploadDir, { recursive: true });
    }
  }

  /**
   * Parse raw multipart form-data request
   * @param {string} rawData - The raw request data
   * @param {string} boundary - The boundary string for parsing
   * @returns {Object} - File information and content
   */
  parseMultipart(rawData, boundary) {
    const parts = rawData.split(`--${boundary}`);
    for (const part of parts) {
      if (part.includes('Content-Disposition: form-data;')) {
        const filenameMatch = part.match(/filename="(.+?)"/);
        if (filenameMatch) {
          const filename = filenameMatch[1];
          const fileContent = part.split('\r\n\r\n')[1].split('\r\n--')[0];
          return { filename, content: fileContent };
        }
      }
    }
    throw new Error('No valid file part found in the request');
  }

  /**
   * Save file to disk
   * @param {string} filename - Name of the file
   * @param {Buffer|string} content - File content
   * @returns {string} - File path
   */
  saveFile(filename, content) {
    const filePath = path.join(this.uploadDir, filename);
    fs.writeFileSync(filePath, content, 'binary');
    return filePath;
  }
}

module.exports = FileUploader;
