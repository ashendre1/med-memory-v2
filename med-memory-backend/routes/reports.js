const express = require('express');
const reports = express.Router();
const {db} = require('../firebase');


reports.post('/addReportForUser', async(req, res) => {
    try{
        const details = req.body;
        const reportDocument = {
            username: details.username,
            platelets: details.platelets,
            hemoglobin: details.hemoglobin,
            RBC: details.RBC,
            date: details.date,
            medicines_taken: details.medicines_taken
        }
        console.log('reportDocument', reportDocument);
        await db.collection('reports').add(reportDocument);
        res.status(200).json({
            message: 'Report added successfully',
            status: 200
        });

    } catch (error){
        console.log(error);
        res.status(500).send(error);
    }
});

reports.post('/addReportForMe', async(req, res) => {
    try{
        const details = req.body;
        const reportDocument = { 
            username: details.username,
            platelets: details.platelets,
            hemoglobin: details.hemoglobin,
            RBC: details.RBC,
            date: details.date,
            medicines_taken: details.medicines_taken
        }
        console.log('reportDocument', reportDocument);
        await db.collection('reports').add(reportDocument);
        res.status(200).json({
            message: 'Report added successfully',
            status: 200
        });

    } catch (error){
        console.log(error);
        res.status(500).send(error);
    }
});

reports.get('/getReportsForUser', async(req, res) => {
    try{
        const username = req.query.username;
        const snapshot = await db.collection('reports')
                    .where('username', '==', username)
                    .get();
        const documents = snapshot.docs.map(doc => doc.data());

        res.status(200).json(documents);

    } catch (error){
        console.log(error);
        res.status(500).send(error);
    }
});

reports.get('/getReportsForMe', async(req, res) => {
    try{
        const username = req.session.user.username;
        const snapshot = await db.collection('reports')
                    .where('username', '==', username)
                    .get();
        const documents = snapshot.docs.map(doc => doc.data());

        res.status(200).json(documents);

    } catch (error){
        console.log(error);
        res.status(500).send(error);
    }
});

reports.post('/bulkUpload', async(req, res) => {
    try {
        const dataArray = req.body;
        const batch = db.batch();
        dataArray.forEach(details => {
            let reportDocument = {
                platelets: details.platelets,
                hemoglobin: details.hemoglobin,
                RBC: details.RBC,
                date: details.date
            }

            reportDocument.username = 'john';

            const docRef = db.collection('reports').doc();
            batch.set(docRef, reportDocument);
        });

        batch.commit()
            .then(() => {
                console.log('Batch upload successful');
            })
            .catch((error) => {
                console.log('Batch upload failed');
            });

    } catch (error){
        console.log('thish is the erorr, ', error);
    }
});

module.exports = reports;