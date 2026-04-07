const multer = require('multer');
const { CloudinaryStorage } = require('multer-storage-cloudinary');
const cloudinary = require('../config/cloudinary');

const storage = new CloudinaryStorage({
    cloudinary: cloudinary,
    params: {
        folder: 'personal-cloud-storage',
        resource_type: 'auto', // allows all types of files
    },
});

const upload = multer({ storage: storage });

module.exports = upload;
