/**
 * @typedef {import('@prisma/client').Student} Student
 * @typedef {import('@prisma/client').Admin} Admin
 */

/**
 * Assert admin, used for type inferrence
 * @param {(Student & { admin: Admin | null}) | null} student
 * @returns {asserts student is Student & { admin: Admin }}
 */
function assertAdmin(student) {
    if (!student?.admin) {
        /** @type {HttpError} */
        const err = {
            ...new Error('failed admin assertion'),
            status: 401,
        };
        throw err;
    }
}

/**
 * Assert admin, used for type inferrence
 * @param {(Student & { admin: Admin | null}) | null} student
 * @returns {asserts student is Student & { admin: Admin | null }}
 */
function assertStudent(student) {
    if (!student) {
        /** @type {HttpError} */
        const err = {
            ...new Error('failed student assertion'),
            status: 401,
        };
        throw err;
    }
}

module.exports = { assertAdmin, assertStudent };
