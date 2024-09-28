const express = require('express');
const userSession = express.Router();
const {db} = require('../firebase');

userSession.get('/check-session', (req, res) => {
    if (req.session.user) {
        console.log(req.sessionID)
        const doc = {
            user: req.session.user.username,
            status: 200
        }
      res.status(200).json(doc);
    } else {
      res.status(401).send('Unauthorized');
    }
});
  
userSession.post('/logout', (req, res) => {
    req.session.destroy((err) => {
      if (err) {
        return res.status(500).send('Error logging out');
      }
      res.clearCookie('connect.sid');
      res.status(200).send('Logged out');
    });
});

module.exports = userSession;