const { login } = require('../db/login');

/**
 * @param {import("express").Request} req
 * @param {import("express").Response} res
 * @param {import("express").NextFunction} next
 */
async function decodeEmail(req, res, next) {
    const email = req.signedCookies['email'];
    if (email) {
        req.user = await login(email);
    }
    next();
}

module.exports = { decodeEmail };
