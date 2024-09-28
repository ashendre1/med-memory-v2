const express = require('express');
const prescriptions = express.Router();
const { db, bucket } = require('../firebase');
const multer = require('multer');
const path = require('path');
const { format } = require('util');
const { v4: uuidv4 } = require('uuid'); 

const storage = multer.memoryStorage();
const upload = multer({ storage: storage });

prescriptions.post('/uploadPrescriptionForUser', upload.single('image'), async (req, res) => {
    try {
        console.log(req.session.user)
        if (!req.file) {
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
                username: req.body.username,
                imageUrl: publicUrl,
                uploadedAt: new Date(),
                diagnosis: req.body.diagnosis
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
        const snapshot = await db.collection('images').where('username', '==', userId).get();

        if (snapshot.empty) {
            return res.status(404).send('No images found for this user.');
        }

        const images = [];
        snapshot.forEach(doc => {
            images.push(doc.data());
        });

        images.sort((a, b) => b.uploadedAt - a.uploadedAt);
        const latestImage = images[0];
        console.log(latestImage)
        res.status(200).json(latestImage);
    } catch (error) {
        console.error('Error retrieving images:', error);
        res.status(500).send('Internal server error.');
    }
});

prescriptions.post('/bulkUpload', async (req, res) => {
    try {
        const dataArray = req.body;
        const batch = db.batch();
        dataArray.forEach(details => {
            let reportDocument = {
                username: "john",
                uploadedAt: details.date,
                diagnosis: details.diagnosis
            }
            const docRef = db.collection('images').doc();
            batch.set(docRef, reportDocument);
        });

        batch.commit()
        .then(() => {
            console.log('Batch upload successful');
        })
        .catch((error) => {
            console.log('Batch upload failed');
    });

    } catch(error){
        console.log(error);
    }
});


module.exports = prescriptions;