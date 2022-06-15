const { assertStudent } = require('../../auth/assert');
const express = require('express');
const userRoutes = express.Router();
const client = require('../../db');

// get the student who has just logged in
userRoutes.get('/', (req, res) => {
    assertStudent(req.user);
    // TODO: get user information?

    const { password, ...info } = req.user;

    res.status(200);
    res.send(info);
});

// add a student with uid to the reception list
userRoutes.post('/:uid/checkin', async (req, res) => {
    assertStudent(req.user);

    const uid = parseInt(req.params.uid);
    if (isNaN(uid)) {
        return res.status(400).send('uid must be a number');
    }

    if (req.body.seatId === undefined) {
        return res.status(400).send('missing seat in body');
    }

    const seatId = parseInt(req.body.seatId);
    if (isNaN(seatId)) {
        return res.status(400).send('seat must be a number');
    }

    if (!req.user.admin && uid !== req.user.id) {
        return res.status(403).send('only admin or self-checkin are allowed');
    }

    const existingCheckIns = await client.seat
        .findUnique({ where: { id: seatId } })
        .checkins({ where: { checkout: null } });

    if (existingCheckIns.length > 0) {
        return res.status(409).send('seat already occupied');
    }

    const checkin = await client.checkin.create({
        data: {
            studentId: uid,
            authorId: req.user.id,
            seatId: seatId,
        },
    });

    res.status(200);
    res.send(checkin);
});

// add a student with uid to the reception list
userRoutes.post('/:uid/checkout', async (req, res) => {
    assertStudent(req.user);

    const uid = parseInt(req.params.uid);
    if (isNaN(uid)) {
        return res.status(400).send('uid must be a number');
    }

    if (!req.user.admin && uid !== req.user.id) {
        return res.status(403).send('only admin or self-checkin are allowed');
    }

    const currentlyCheckins = await client.student
        .findUnique({ where: { id: uid } })
        .checkins({
            where: { checkout: null },
            orderBy: { createdAt: 'desc' },
        });

    if (currentlyCheckins.length == 0) {
        return res.status(400).send('user not checked in');
    }

    const checkout = await client.checkout.create({
        data: {
            checkinId: currentlyCheckins[0].createdAt,
            authorId: req.user.id,
        },
    });

    res.status(200);
    res.send(checkout);
});

module.exports = userRoutes;
