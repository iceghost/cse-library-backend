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

/**
 * @param {number} id
 * @returns {Promise<import('@prisma/client').Admin>}
 */
async function promoteAdmin(id) {
    return client.admin.upsert({
        where: {
            id,
        },
        update: {},
        create: {
            id,
        },
    });
}

module.exports = { isAdmin, promoteAdmin };
