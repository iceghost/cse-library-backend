const { PrismaClientKnownRequestError } = require('@prisma/client/runtime');
const csrf = require('../auth/csrf');
const { verify } = require('../auth/oauth');
const client = require('../db');
const express = require('express');
const router = express.Router();
const bcrypt = require('bcrypt');
const saltRounds = 10;

router.post('/session/google', csrf, async (req, res) => {
    try {
        const payload = await verify(req.body.credential);

        if (payload?.email === undefined)
            throw new Error('cannot decode payload');

        let student = await client.student.findUnique({
            where: { email: payload.email },
            include: { admin: true },
        });

        if (!student) return res.status(404).send('email not found');

        const { password, ...info } = student;

        res.cookie('email', payload.email, {
            maxAge: 1000 * 60 * 60 * 24 * 7,
            signed: true,
        });

        res.status(200).send(info);
    } catch (e) {
        console.error(e);
        res.status(400).send('failed to verify token');
    }
});

router.post('/session/password', async (req, res) => {
    /** @type {Record<string, string?>} */
    const { email, password } = req.body;

    if (!email || !password) {
        return res.set(400).send('body must include email and password');
    }

    const student = await client.student.findUnique({
        where: { email },
        include: { admin: true },
    });
    if (!student) return res.status(401).send('email not exist');

    let ok = await bcrypt.compare(password ?? '', student.password ?? '');
    if (!ok) return res.status(401).send('password mismatch');

    res.cookie('email', email, {
        maxAge: 1000 * 60 * 60 * 24 * 7,
        signed: true,
    });

    {
        const { password, ...info } = student;
        res.status(200).send(info);
    }
});

router.post('/users', async (req, res) => {
    /** @type {Record<string, string | undefined>} */
    const { email, id, lname, fname, password, phone } = req.body;
    const hash = await bcrypt.hash(password ?? '', saltRounds);

    if (email === undefined) return res.status(400).send('missing email field');
    if (lname === undefined) return res.status(400).send('missing lname field');
    if (fname === undefined) return res.status(400).send('missing fname field');
    if (id === undefined) return res.status(400).send('missing id field');

    try {
        const parsedId = parseInt(id);
        if (isNaN(parsedId)) return res.status(400).send('id must be a number');

        const student = await client.student.create({
            data: { email, id: parsedId, lname, fname, password: hash, phone },
            include: { admin: true },
        });
        {
            const { password, ...info } = student;
            res.status(200).send(info);
        }
    } catch (e) {
        // unique constraint violated
        if (e instanceof PrismaClientKnownRequestError && e.code === 'P2002') {
            res.status(409).send('email or id already exists');
            return;
        }
        console.error(e);
        res.status(500).send('something went wrong');
    }
});

router.use(async (req, _, next) => {
    const email = req.signedCookies['email'];
    if (email) {
        req.user = await client.student.findUnique({
            where: { email },
            include: { admin: true },
        });
    }
    next();
});

module.exports = router;
