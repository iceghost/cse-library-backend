const express = require('express');
const client = require('../db');
const router = express.Router();

router.get('/seats', async (req, res) => {
    const seats = await client.seat.findMany({
        include: {
            checkins: {
                select: { student: { select: { fname: true } } },
                orderBy: { createdAt: 'desc' },
                take: 1,
            },
        },
    });
    res.status(200).send(seats);
});

module.exports = router;
