const express = require('express');
const router = express.Router();
const cloudinary = require('cloudinary').v2;
const upload = require('../config/multer.config');
const fileModel = require('../models/files.model');
const axios = require('axios');

// Middleware
const authMiddleware = require('../middlewares/authe');

require('dotenv').config();

const streamifier = require('streamifier'); // For creating a stream from a buffer

// Cloudinary Config
cloudinary.config({
    cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
    api_key: process.env.CLOUDINARY_API_KEY,
    api_secret: process.env.CLOUDINARY_API_SECRET,
});

router.get('/home', authMiddleware, async (req, res) => {
    try {
        // Get all files for the current user
        const files = await fileModel.find({ userId: req.user.userId });
        res.render('home', { files });
    }
    catch (error) {
        console.error(error);
        res.status(500).json({ error: 'An error occurred while fetching files' });
    }
});

router.post('/upload', authMiddleware, upload.single('file'), async (req, res) => {
    try {
        if (!req.file) {
            return res.status(400).json({ error: 'No file uploaded' });
        }

        // Create a readable stream from the buffer and upload it to Cloudinary
        const result = await new Promise((resolve, reject) => {
            const stream = streamifier.createReadStream(req.file.buffer);
            const uploadStream = cloudinary.uploader.upload_stream(
                { folder: 'uploads' }, // Optional: Organize files in a Cloudinary folder
                (error, result) => {
                    if (error) return reject(error);
                    resolve(result);
                }
            );
            stream.pipe(uploadStream);
        });

        const newFile = await fileModel.create({
            originalname: req.file.originalname,
            path: result.secure_url,
            userId: req.user.userId,
        })

        res.status(200).json({newFile: newFile});

    } catch (err) {
        console.error(err);
        res.status(500).json({ error: 'An error occurred during the upload process' });
    }

});

router.get('/download/:path', authMiddleware, async (req, res) => {

    try {

        const userID = req.user.userId;
        const filePath = decodeURIComponent(req.params.path);

        console.log(filePath);

        const file = await fileModel.findOne({
            userId: userID,
            path: filePath
        });

        if (!file) {
            return res.status(404).json({ error: 'File not found' });
        }

        // Fetch and stream the file using axios
        const response = await axios({
            method: 'get',
            url: filePath,
            responseType: 'stream',
        });

        response.data.pipe(res);
    }
    catch (error) {
        console.error(error);
        res.status(500).json({ error: 'An error occurred during the download process' });
    }
});

module.exports = router