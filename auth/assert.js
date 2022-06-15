/**
 * @typedef {import('@prisma/client').Student} Student
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
        req.user = await client.student.findUnique({
            where: { email },
            include: { admin: true },
        });
    }
    next();
};

/**
 * Assert admin, used for type inferrence
 * @param {(Student & { admin: Admin | null}) | null} student
 * @returns {asserts student is Student & { admin: Admin }}
 */
function assertAdmin(student) {
    if (!student?.admin) {
        /** @type {HttpError} */
        const err = {
            message: 'failed admin assertion',
            status: 403,
        };
        throw err;
    }
}

/**
 * Assert student, used for type inferrence
 * @param {(Student & { admin: Admin | null}) | null} student
 * @returns {asserts student is Student & { admin: Admin | null }}
 */
function assertStudent(student) {
    if (!student) {
        /** @type {HttpError} */
        const err = {
            message: 'failed student assertion',
            status: 403,
        };
        throw err;
    }
}

module.exports = { assertAdmin, assertStudent, decodeEmail };
