const express = require('express');
const userRoutes = express.Router();
const client = require('../../db');
const { blacklist } = require('../../db');
const blackList = require('../../db/blacklist');
const { recept } = require('../../db/recept');
// const { verifyAdmin } = require('../../auth/admin');


// get the student who has just logged in
userRoutes.get('/:uid', (req, res) => {
    // TODO: get user information?
    res.status(200);
    res.send(req.body.user);
});

// add a student with uid to the reception list
userRoutes.post('/:uid/recept', async (req, res) => {
    const uid = parseInt(req.params.uid);
    if (isNaN(uid)) {
        res.status(400);
        res.send('uid must be a number');
        return;
    } else if(uid !== req.body.id) {
        res.status(400);
        res.send('uid not found');
        return;
    }
    const reception = await recept(uid, req.body.user);
    console.log("REQ Body => ", req.body);
    res.status(200);
    res.send(reception);
});

module.exports = userRoutes ;