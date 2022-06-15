const { assertStudent } = require('auth/assert');
const express = require('express');
const userRoutes = express.Router();
const client = require('../../db');

// get the student who has just logged in
userRoutes.get('/', (req, res) => {
    assertStudent(req.user);
    // TODO: get user information?
    res.status(200);
    res.send(req.user);
});

// add a student with uid to the reception list
userRoutes.post('/:uid/checkin', async (req, res) => {
    assertStudent(req.user);

    const uid = parseInt(req.params.uid);
    if (isNaN(uid)) {
        throw { ...new Error('uid must be a number'), status: 400 };
    }

    if (req.body.seatId === undefined) {
        throw { ...new Error('missing seat in body'), status: 400 };
    }

    const seatId = parseInt(req.body.seatId);
    if (isNaN(seatId)) {
        throw { ...new Error('seat must be a number'), status: 400 };
    }

    if (!req.user.admin && uid !== req.user.id) {
        throw {
            ...new Error('only admin or self-checkin are allowed'),
            status: 403,
        };
    }

    const existingCheckIns = await client.seat
        .findUnique({ where: { id: seatId } })
        .checkins({ where: { checkout: null } });

    if (existingCheckIns.length > 0) {
        throw { ...new Error('seat already occupied'), status: 409 };
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
        throw { ...new Error('uid must be a number'), status: 400 };
    }

    if (!req.user.admin && uid !== req.user.id) {
        throw {
            ...new Error('only admin or self-checkin are allowed'),
            status: 403,
        };
    }

    const currentlyCheckins = await client.student
        .findUnique({ where: { id: uid } })
        .checkins({
            where: { checkout: null },
            orderBy: { createdAt: 'desc' },
        });

    if (currentlyCheckins.length == 0) {
        throw { ...new Error('user not checked in'), status: 400 };
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
