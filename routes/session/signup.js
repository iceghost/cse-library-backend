const { PrismaClientKnownRequestError } = require('@prisma/client/runtime');
const bcrypt = require('bcrypt');
const client = require('../../db');

/**
 *
 * @type {import("express").Handler}
 */
const signupHandler = async (req, res) => {
    /** @type {Record<string, string | undefined>} */
    const { email, id, lname, fname, password, phone } = req.body;
    const hash = await bcrypt.hash(
        password ?? '',
        process.env['SALT_ROUNDS'] || 10
    );

    if (email === undefined) {
        res.status(400).send('missing email field');
        return;
    }
    if (lname === undefined) {
        res.status(400).send('missing lname field');
        return;
    }
    if (fname === undefined) {
        res.status(400).send('missing fname field');
        return;
    }
    if (id === undefined) {
        res.status(400).send('missing id field');
        return;
    }

    try {
        const parsedId = parseInt(id);
        if (isNaN(parsedId)) {
            res.status(400).send('id must be a number');
            return;
        }

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
};

module.exports = signupHandler;
