const { verify } = require('../../auth/oauth');
const client = require('../../db');
const bcrypt = require('bcrypt');
const csrf = require('../../auth/csrf');

/**
 * handle google post request from client
 * @type {import('express').Handler}
 */
const googleHandler = async (req, res) => {
    try {
        const payload = await verify(req.body.credential);

        if (payload?.email === undefined)
            throw new Error('cannot decode payload');

        let user = await client.user.findUnique({
            where: { email: payload.email },
            include: { admin: true },
        });

        if (!user) {
            res.status(404).send('email not found');
            return;
        }

        const { password, ...info } = user;

        res.cookie('email', payload.email, {
            maxAge: 1000 * 60 * 60 * 24 * 7,
            signed: true,
        });

        res.status(200).send(info);
    } catch (e) {
        console.error(e);
        res.status(400).send('failed to verify token');
    }
};

/**
 * handler password login
 * @type {import('express').Handler}
 */
const passwordHandler = async (req, res) => {
    /** @type {Record<string, string?>} */
    const { email, password } = req.body;

    if (!email || !password) {
        res.status(400).send('body must include email and password');
        return;
    }

    const user = await client.user.findUnique({
        where: { email },
        include: { admin: true },
    });
    if (!user) {
        res.status(401).send('email not exist');
        return;
    }

    let ok = await bcrypt.compare(password ?? '', user.password ?? '');
    if (!ok) {
        res.status(401).send('password mismatch');
        return;
    }

    res.cookie('email', email, {
        maxAge: 1000 * 60 * 60 * 24 * 7,
        signed: true,
    });

    {
        const { password, ...info } = user;
        res.status(200).send(info);
    }
};

const router = require('express').Router();
router.post('/google', csrf, googleHandler);
router.post('/password', passwordHandler);
module.exports = router;
