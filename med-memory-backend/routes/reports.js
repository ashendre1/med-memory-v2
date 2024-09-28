const express = require('express');
const reports = express.Router();
const {db} = require('../firebase');


reports.post('/addReport', async(req, res) => {
    try{
        const details = req.body;
        const reportDocument = {
            // username: req.session.user.username,
            username: details.username,
            platelets: details.platelets,
            hemoglobin: details.hemoglobin,
            RBC: details.RBC,
            date: details.date
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

reports.get('/getReports', async(req, res) => {
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

module.exports = reports;