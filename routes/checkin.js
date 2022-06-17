const express = require('express');
const client = require('../db');
const router = express.Router();

router.get('/', async (req, res) => {
    /** @param {string} name */
    const parse = (name) => {
        const query = req.query[name];
        if (!query) return undefined;
        if (typeof query !== 'string') {
            res.status(400).send(
                `query ${name} must be a number or leave undefined`
            );
            return;
        }
        const parsed = parseInt(query || '');
        if (isNaN(parsed)) {
            res.status(400).send(`query ${name} must be a number`);
        }
        return parsed;
    };

    const from = parse('from');
    const to = parse('to');

    const checkins = await client.checkin.findMany({
        where: {
            createdAt: {
                gte: from === undefined ? undefined : new Date(from),
                lte: to === undefined ? undefined : new Date(to),
            },
        },
        select: {
            createdAt: true,
            id: true,
            checkout: {
                select: {
                    createdAt: true,
                    id: true,
                },
            },
        },
    });

    res.status(200).send(checkins);
});

module.exports = router;
