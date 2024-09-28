const express = require('express');
const doctorlist = express.Router();
const {db} = require('../firebase');

doctorlist.get('/getAllDoctors', async (req, res) => {
    try {
        const snapshot = await db.collection('doctors').doc('doctorList').get();
        const data = snapshot.data();
        res.status(200).json(data);
    } catch (error){
        console.log(error);
        res.status(500).send(error);
    }
});

module.exports = doctorlist;