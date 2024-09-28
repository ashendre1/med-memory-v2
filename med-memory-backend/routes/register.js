const express = require('express');
const register = express.Router();
const {db} = require('../firebase')

register.get('/getAllUsers', async (req, res) => {
    try {
        const snapshot = await db.collection('userDetails').get();
        const documents = snapshot.docs.map(doc => doc.data());
        res.status(200).json(documents);
    } catch (error){
        console.log(error);
        res.status(500).send(error);
    }
});

register.post('/addUser', async (req, res) =>{
    try {
        const user = req.body;
        const snapshot = await db.collection('userDetails').where('username', '==', user.username).get();
        if(snapshot.docs.length > 0){
            res.status(409).json({
                message: 'User already exists',
                status: 409
            });
            return;
        }
        const userDocument = {
            username: user.username,
            password: user.password,
            gender: user.gender,
            dob: user.dob,
            blood_group: user.blood_group,
            type: user.type,
            associated: []
        }

        if (user.type === 'doctor'){
            const doctorDoc = await db.collection('doctors').doc('doctorList').get();
            const data = doctorDoc.data();
            updateNames = [...data.names, user.username];
            await doctorDoc.ref.update({names: updateNames});
        }

        await db.collection('userDetails').add(userDocument);
        res.status(200).json({
            message: 'User added successfully',
            status: 200}
        );

    } catch (error){
        console.log(error);
        res.status(500).send(error);
    }
});


register.get('/authenticate', async (req, res) => {
    try {
        const { username, password } = req.query;
        const snapshot = await db.collection('userDetails')
                    .where('username', '==', username)
                    .where('password', '==', password)
                    .get();

        const documents = snapshot.docs.map(doc => doc.data());
        if(documents.length > 0){
            const doc = documents[0];
            const additionalData = {
                type: doc.type,
                message: 'successful login',
                status: 200
            }

            req.session.user = {
                username: doc.username,
                type: doc.type
            };

            res.status(200).json({ additionalData });
        } else {
            const additionalData = {
                message: 'credentials not found',
                status: 404
            }
            const response = {additionalData};
            res.status(200).json(response);
        }

    } catch(error){
        const data ={
            message: 'error'
        }
        res.status(500).json(data);
    }
});

register.post('/addPatient', async (req, res) => {
    try {
        const snapshot = await db.collection('userDetails')
                    .where('username', '==', req.body.doctorName)
                    .get();

        const documents = snapshot.docs.map(doc => doc.data());

        if(documents.length > 0){
            const doc = documents[0];
            console.log('here is the doc ', doc);
            const associated = doc.associated;
            associated.push(req.session.user.username);
            await snapshot.docs[0].ref.update({associated});
            res.status(200).json({message: 'Patient added successfully' });
        } else {
            res.status(404).json({message: 'Doctor not found' });
        }

    } catch (error){
        console.log(error);
    }
});

register.get('/getAllDoctors', async (req, res) => {
    try {
        const snapshot = await db.collection('doctors').doc('doctorList').get();
        const data = snapshot.data();
        res.status(200).json(data);
    } catch (error){
        console.log(error);
        res.status(500).send(error);
    }
});

register.get('/getPatients', async (req, res) => {
    try{
        const snapshot = await db.collection('userDetails')
                    .where('username', '==', req.session.user.username)
                    .get();

        const documents = snapshot.docs.map(doc => doc.data());
        if(documents.length > 0){
            const doc = documents[0];
            const associated = doc.associated;

            if(associated.includes(req.body.patientName)){


            } else {
                const response = {
                    message: 'You do not have access to this patient',
                    status: 205
                }
                res.status(200).json(response);
            }
            
        } else {
            res.status(404).json({message: 'User not found'});
        }

    } catch (error){
        console.log(error);
    }
});

module.exports = register;