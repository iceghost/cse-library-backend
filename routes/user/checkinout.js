const { assertUser } = require('../../auth/assert');
const client = require('../../db');
const { getLatestCheckinByUser } = require('../../db/checkin');

/**
 * @type {import("express").Handler}
 */
async function checkoutHandler(req, res, next) {
    try {
        assertUser(req.user);
    } catch (e) {
        return next(e);
    }

    const uid = parseInt(req.params.uid);
    if (isNaN(uid)) {
        res.status(400).send('uid must be a number');
        return;
    }

    if (!req.user.admin && uid !== req.user.id) {
        res.status(403).send('only admin or self-checkin are allowed');
        return;
    }

    const user = await client.user.findUnique({ where: { id: uid } });
    if (!user) {
        res.status(404).send("user doesn't exist");
        return;
    }

    const latestCheckin = await getLatestCheckinByUser(user);
    if (!latestCheckin || latestCheckin.checkout) {
        res.status(400).send('user not checked in');
        return;
    }

    const checkout = await client.checkout.create({
        data: {
            checkinId: latestCheckin.id,
            authorId: req.user.id,
        },
    });

    res.status(200);
    res.send(checkout);
}

/**
 * @type {import('express').Handler}
 */
async function checkinHandler(req, res, next) {
    try {
        assertUser(req.user);
    } catch (e) {
        return next(e);
    }

    const uid = parseInt(req.params.uid);
    if (isNaN(uid)) {
        res.status(400).send('uid must be a number');
        return;
    }

    if (!req.user.admin && uid !== req.user.id) {
        res.status(403).send('only admin or self-checkin are allowed');
        return;
    }

    const user = await client.user.findUnique({ where: { id: uid } });
    if (!user) {
        res.status(404).send("user doesn't exist");
        return;
    }

    const latestCheckin = await getLatestCheckinByUser(user);
    if (latestCheckin && !latestCheckin.checkout) {
        res.status(409).send('already checked in');
        return;
    }

    const checkin = await client.checkin.create({
        data: {
            userId: uid,
            authorId: req.user.id,
        },
        include: {
            user: { select: { id: true, fname: true, lname: true } },
        },
    });

    res.status(200);
    res.send(checkin);
}

module.exports = { checkinHandler, checkoutHandler };
