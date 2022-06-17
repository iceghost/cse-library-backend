const { assertAdmin } = require('../../auth/assert');
const client = require('../../db');

/** @type {import('express').Handler} */
const getAllHandlers = async (req, res, next) => {
    try {
        assertAdmin(req.user);
    } catch (e) {
        return next(e);
    }
    const users = await client.user.findMany({
        include: {
            admin: true,
            blacklist: true,
        },
    });
    res.status(200).send(
        users.map((user) => {
            const { password, ...info } = user;
            return info;
        })
    );
};

module.exports = getAllHandlers;
