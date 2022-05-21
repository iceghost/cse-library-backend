// @ts-check

const client = require('.');

/**
 * @param {import('@prisma/client').Student} student
 */
async function isAdmin(student) {
    const admin = await client.admin.findUnique({
        where: { id: student.id },
    });
    return Boolean(admin);
}

module.exports = { isAdmin };
