/**
 * @typedef {import('@prisma/client').User} User
 * @typedef {import('@prisma/client').Admin} Admin
 */

const client = require('../db');

/**
 * decode email in cookie and pass it along req
 * @type {import('express').Handler}
 */
const decodeEmail = async (req, _, next) => {
    const email = req.signedCookies['email'];
    if (email) {
        req.user = await client.user.findUnique({
            where: { email },
            include: { admin: true },
        });
    }
    next();
};

/**
 * Assert admin, used for type inferrence
 * @param {(User & { admin: Admin | null}) | null} user
 * @returns {asserts user is User & { admin: Admin }}
 */
function assertAdmin(user) {
    if (!user?.admin) {
        /** @type {HttpError} */
        const err = {
            message: 'failed admin assertion',
            status: 403,
        };
        throw err;
    }
}

/**
 * Assert user, used for type inferrence
 * @param {(User & { admin: Admin | null}) | null} user
 * @returns {asserts user is User & { admin: Admin | null }}
 */
function assertUser(user) {
    if (!user) {
        /** @type {HttpError} */
        const err = {
            message: 'failed user assertion',
            status: 403,
        };
        throw err;
    }
}

module.exports = { assertAdmin, assertUser, decodeEmail };
