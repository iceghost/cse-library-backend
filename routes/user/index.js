const { assertUser } = require('../../auth/assert');
const express = require('express');
const { checkinHandler, checkoutHandler } = require('./checkinout');
const signupHandler = require('../session/signup');

const userRoutes = express.Router();

userRoutes.post('/', signupHandler);
userRoutes.post('/:uid/checkin', checkinHandler);
userRoutes.post('/:uid/checkout', checkoutHandler);

// get the user who has just logged in
userRoutes.get('/', (req, res) => {
    assertUser(req.user);
    const { password, ...info } = req.user;
    res.status(200).send(info);
});

module.exports = userRoutes;
