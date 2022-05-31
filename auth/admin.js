const { isAdmin } = require('../db/admin');

/**
 *
 * @param {import("express").Request} req
 * @param {import("express").Response} res
 * @param {import("express").NextFunction} next
 */
async function verifyAdmin(req, res, next) {
    /** @type {import("@prisma/client").Student} */
    const user = req.body.user;
    if (!(await isAdmin(user))) {
        res.status(401);
        res.send('admin only');
        return;
    }
    next();
}

module.exports = { verifyAdmin };
