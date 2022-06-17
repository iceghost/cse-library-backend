const express = require('express');
const { assertUser } = require('../auth/assert');
const client = require('../db');
const router = express.Router();

router.get('/', async (req, res) => {
    const seats = await client.seat.findMany({
        include: {
            checkins: {
                select: {
                    user: { select: { fname: true } },
                    checkout: true,
                },
                orderBy: { createdAt: 'desc' },
                take: 1,
            },
        },
    });
    const currentSeats = seats.map((seat) => {
        const checkin = seat.checkins.pop();
        return {
            id: seat.id,
            checkin: checkin?.checkout === null ? checkin : undefined,
        };
    });
    res.status(200).send(currentSeats);
});

router.put('/:seatId', async (req, res) => {
    assertUser(req.user);

    const seatId = parseInt(req.params.seatId);
    if (isNaN(seatId)) {
        res.status(400).send('seat id must be a number');
        return;
    }

    const userCheckin = (
        await client.user.findUnique({ where: { id: req.user.id } }).checkins({
            orderBy: { createdAt: 'desc' },
            take: 1,
            include: { checkout: true },
        })
    ).pop();

    if (!userCheckin || userCheckin.checkout) {
        res.status(403).send('you must check in first to choose seat');
        return;
    }

    const seatCheckin = (
        await client.seat.findUnique({ where: { id: seatId } }).checkins({
            orderBy: { createdAt: 'desc' },
            take: 1,
            include: { checkout: true },
        })
    ).pop();

    if (seatCheckin && !seatCheckin.checkout) {
        res.status(409).send('seat already occupied');
        return;
    }

    const seat = await client.checkin.update({
        where: { createdAt: userCheckin.createdAt },
        data: { seatId },
    });

    res.status(200).send(seat);
});

module.exports = router;
