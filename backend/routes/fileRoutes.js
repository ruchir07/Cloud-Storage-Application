const express = require('express');
const { protect } = require('../middleware/authMiddleware');
const { uploadFile, getFiles, deleteFile } = require('../controllers/fileController');
const upload = require('../middleware/uploadMiddleware');

const router = express.Router();

router.post('/upload', protect, upload.single('file'), uploadFile);
router.get('/', protect, getFiles);
router.delete('/:id', protect, deleteFile);

module.exports = router;
