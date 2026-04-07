const File = require('../models/File');
const cloudinary = require('../config/cloudinary');

const uploadFile = async (req, res) => {
    try {
        if (!req.file) {
            return res.status(400).json({ message: 'No file uploaded' });
        }

        const newFile = await File.create({
            originalName: req.file.originalname,
            url: req.file.path,
            cloudinaryId: req.file.filename,
            format: req.file.mimetype || 'unknown',
            size: req.file.size || req.file.bytes || 0,
            user: req.user._id,
        });

        res.status(201).json(newFile);
    } catch (error) {
        res.status(500).json({ message: 'Error uploading file', error: error.message });
    }
};

const getFiles = async (req, res) => {
    try {
        const files = await File.find({ user: req.user._id }).sort({ createdAt: -1 });
        res.status(200).json(files);
    } catch (error) {
        res.status(500).json({ message: 'Error fetching files', error: error.message });
    }
};

const deleteFile = async (req, res) => {
    try {
        const file = await File.findById(req.params.id);

        if (!file) {
            return res.status(404).json({ message: 'File not found' });
        }

        // Check user
        if (file.user.toString() !== req.user._id.toString()) {
            return res.status(401).json({ message: 'User not authorized' });
        }

        // Delete from Cloudinary
        await cloudinary.uploader.destroy(file.cloudinaryId);

        // Delete from DB
        await file.deleteOne();

        res.status(200).json({ id: req.params.id });
    } catch (error) {
        res.status(500).json({ message: 'Error deleting file', error: error.message });
    }
};

module.exports = {
    uploadFile,
    getFiles,
    deleteFile,
};
