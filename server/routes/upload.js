const router = require('express').Router();
const cloudinary = require('cloudinary');
const auth = require('../middleware/auth'); // Only auth middleware
const fs = require('fs');

cloudinary.config({
    cloud_name: process.env.CLOUD_NAME,
    api_key: process.env.CLOUD_API_KEY,
    api_secret: process.env.CLOUD_API_SECRET
});

// Upload Route
router.post('/upload', auth, (req, res) => {
    try {
        if (!req.files || Object.keys(req.files).length === 0) {
            return res.status(400).send({ msg: "No file were uploaded" });
        }

        const file = req.files.file;
        // console.log(file)
        if (file.size > 1024 * 1024) { // Check file size (1MB limit)
            removeTmp(file.tempFilePath);
            return res.status(400).json({ msg: "Size too large" });
        }

        if (file.mimetype !== 'image/jpeg' && file.mimetype !== 'image/png') { // Check file type
            removeTmp(file.tempFilePath);
            return res.status(400).json({ msg: "File format is incorrect" });
        }

        cloudinary.v2.uploader.upload(file.tempFilePath, { folder: 'test' }, async (err, result) => {
            if (err) throw err;

            removeTmp(file.tempFilePath); // Remove temp file
            res.json({ public_id: result.public_id, url: result.secure_url }); // Respond with Cloudinary result
        });
    } catch (err) {
        res.status(500).json({ msg: err.message });
    }
});

// Destroy Route
router.post('/destroy', auth, (req, res) => {
    try {
        const { public_id } = req.body;
        if (!public_id) return res.status(400).json({ msg: "No images selected" });

        cloudinary.v2.uploader.destroy(public_id, async (err, result) => {
            if (err) throw err;
            res.json({ msg: "Deleted" });
        });
    } catch (err) {
        return res.status(500).json({ msg: err.message });
    }
});

// Function to remove temporary files
const removeTmp = (path) => {
    fs.unlink(path, err => {
        if (err) throw err;
    });
};

module.exports = router;
