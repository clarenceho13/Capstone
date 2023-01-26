const express = require('express');
const router = express.Router();
const cloudinary = require('cloudinary');
const streamifier = require('streamifier');
const multer = require('multer');
const isAuth = require('../isAuth');
const admin = require('../admin');

const upload = multer();

router.post('/', isAuth, admin, upload.single('file'), async (req, res) => {
    cloudinary.config({
        cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
        api_key: process.env.CLOUDINARY_API_KEY,
        api_secret: process.env.CLOUDINARY_API_SECRET,
      });
  const streamUpload = (req) => {
    return new Promise((resolve, reject) => {
      const stream = cloudinary.uploader.upload_stream((error, result) => {
        if (result) {
          resolve(result);
        } else {
          reject(error);
        }
      });
      streamifier.createReadStream(req.file.buffer).pipe(stream);
    });
  };
  const result = await streamUpload(req);
  res.send(result);
});

module.exports = router;
