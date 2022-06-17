const { assertUser } = require('../../auth/assert');
const client = require('../../db');

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

    const currentlyCheckins = await client.user
        .findUnique({ where: { id: uid } })
        .checkins({
            where: { checkout: null },
            orderBy: { createdAt: 'desc' },
            take: 1,
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
