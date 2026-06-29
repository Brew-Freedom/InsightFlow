const express = require('express');
const router = express.Router();
const upload = require('../utils/upload');
const { uploadCSV } = require('../controllers/uploadController');

// POST /api/upload - Handle CSV file upload
router.post('/upload', upload.single('file'), uploadCSV);

module.exports = router;
