require('dotenv').config();
const fs = require('fs');
const path = require('path');

// create class LocalStorage to write and read file
class LocalStorage {
  constructor(folder) {
    const dir = path.resolve(__dirname, `../../../${process.env.FILE_PATH}/${folder}`);
    if (!fs.existsSync(dir)) {
      fs.mkdirSync(dir, { recursive: true });
    }

    this.folder = folder;
    this.fullpath = dir;
  }

  // method to write file
  writeFile(file, meta) {
    const filename = +new Date() + meta.filename;
    const filepath = `${this.fullpath}/${filename}`;

    // create write stream
    const fileStream = fs.createWriteStream(filepath);

    // write file
    return new Promise((resolve, reject) => {
      fileStream.on('error', (error) => reject(error));
      file.pipe(fileStream);
      file.on('end', () => resolve(filename));
    });
  }

  getUrlUpload(filename) {
    return `${process.env.FILE_BASE_URL}/uploads/${this.folder}/${filename}`;
  }
}

module.exports = LocalStorage;
