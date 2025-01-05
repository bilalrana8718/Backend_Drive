const express = require('express');
const router = express.Router();
const cloudinary = require('cloudinary').v2;
const upload = require('../config/multer.config');
require('dotenv').config();

const streamifier = require('streamifier'); // For creating a stream from a buffer

// Cloudinary Config
cloudinary.config({
    cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
    api_key: process.env.CLOUDINARY_API_KEY,
    api_secret: process.env.CLOUDINARY_API_SECRET,
});

router.get('/home',(req, res) => {
    res.render('home');
});

// Route for File Upload
// router.post('/upload', upload.single('file'), async (req, res) => {
//     try {
//         if (!req.file) {
//             return res.status(400).send('No file uploaded');
//         }
        
//         console.log(req.file.buffer);

//     } catch (err) {
//         res.status(500).send('An error occurred during the upload process');
//     }
// });


router.post('/upload', upload.single('file'), async (req, res) => {
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

        // Respond with the file URL
        res.status(200).json({ url: result.secure_url });
    } catch (err) {
        console.error(err);
        res.status(500).json({ error: 'An error occurred during the upload process' });
    }
});



module.exports = router