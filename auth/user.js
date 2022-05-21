// @ts-check

const { login } = require('../db/login');

/**
 * @param {import("express").Request} req
 * @param {import("express").Response} res
 * @param {import("express").NextFunction} next
 */
async function verifyEmail(req, res, next) {
    const email = req.signedCookies['email'];
    if (!email) {
        res.status(401);
        res.send('no email found in cookie');
        return;
    }
    req.body['user'] = await login(email);
    next();
}

module.exports = { verifyEmail };
