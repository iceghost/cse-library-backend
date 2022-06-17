const { assertUser } = require('../../auth/assert');
const client = require('../../db');
const { getLatestCheckinByUser } = require('../../db/checkin');

/**
 * @param {import("express").Request} req
 * @param {import("express").Response} res
 */
async function checkoutHandler(req, res) {
    assertUser(req.user);

    const uid = parseInt(req.params.uid);
    if (isNaN(uid)) {
        return res.status(400).send('uid must be a number');
    }

    if (!req.user.admin && uid !== req.user.id) {
        return res.status(403).send('only admin or self-checkin are allowed');
    }

    const latestCheckin = await getLatestCheckinByUser(uid);
    if (!latestCheckin || latestCheckin.checkout) {
        return res.status(400).send('user not checked in');
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
 * @param {import("express").Request} req
 * @param {import("express").Response} res
 */
async function checkinHandler(req, res) {
    assertUser(req.user);

    const uid = parseInt(req.params.uid);
    if (isNaN(uid)) {
        return res.status(400).send('uid must be a number');
    }

    if (!req.user.admin && uid !== req.user.id) {
        return res.status(403).send('only admin or self-checkin are allowed');
    }

    const latestCheckin = await getLatestCheckinByUser(uid);
    if (latestCheckin && !latestCheckin.checkout) {
        res.status(409).send('already checked in');
        return;
    }

    const checkin = await client.checkin.create({
        data: {
            userId: uid,
            authorId: req.user.id,
        },
    });

    res.status(200);
    res.send(checkin);
}

module.exports = { checkinHandler, checkoutHandler };
