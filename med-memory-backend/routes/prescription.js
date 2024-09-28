const express = require('express');
const prescriptions = express.Router();
const { db, bucket } = require('../firebase');
const multer = require('multer');
const path = require('path');
const { format } = require('util');
const { v4: uuidv4 } = require('uuid'); 

// Configure multer for file upload
const storage = multer.memoryStorage();
const upload = multer({ storage: storage });

// Route to handle image upload
prescriptions.post('/upload', upload.single('image'), async (req, res) => {
    try {
        console.log(req.session.user)
        if (!req.file) {
            console.log('no dice')
            return res.status(400).send('No file uploaded.');
        }
        
        const uniquefilename = `${uuidv4()}-${req.file.originalname}`;
        const blob = bucket.file(uniquefilename);
        const blobStream = blob.createWriteStream({
            metadata: {
                contentType: req.file.mimetype
            }
        });

        blobStream.on('error', (err) => {
            console.error(err);
            res.status(500).send('Unable to upload image.');
        });

        blobStream.on('finish', async () => {
            const publicUrl = format(`https://storage.googleapis.com/${bucket.name}/${blob.name}`);
            await blob.makePublic();

            await db.collection('images').add({
                userId: req.session.user.username,
                imageUrl: publicUrl,
                uploadedAt: new Date()
            });

            res.status(200).send({ imageUrl: publicUrl });
        });

        blobStream.end(req.file.buffer);
    } catch (error) {
        console.error('Error uploading image:', error);
        res.status(500).send('Internal server error.');
    }
});


// Route to retrieve images for a user
prescriptions.get('/getMyPrescription', async (req, res) => {
    try {
        const userId = req.session.user.username;
        console.log(userId)
        const snapshot = await db.collection('images').where('userId', '==', userId).get();

        if (snapshot.empty) {
            return res.status(404).send('No images found for this user.');
        }

        const images = [];
        snapshot.forEach(doc => {
            images.push(doc.data());
        });

        console.log(images)

        res.status(200).json(images);
    } catch (error) {
        console.error('Error retrieving images:', error);
        res.status(500).send('Internal server error.');
    }
});

module.exports = prescriptions;