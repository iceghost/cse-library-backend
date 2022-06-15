const { assertStudent } = require('../../auth/assert');
const express = require('express');
const userRoutes = express.Router();
const { checkinHandler, checkoutHandler } = require('./checkinout');

userRoutes.post('/user/:uid/checkin', checkinHandler);
userRoutes.post('/user/:uid/checkout', checkoutHandler);

// get the student who has just logged in
userRoutes.get('/user', (req, res) => {
    assertStudent(req.user);
    const { password, ...info } = req.user;
    res.status(200).send(info);
});

module.exports = userRoutes;
