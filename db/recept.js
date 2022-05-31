// @ts-check

const client = require('.');

/**
 * @param {number} uid
 * @param {import('@prisma/client').Admin} admin
 * @returns {Promise<import('@prisma/client').Reception>}
 */
async function recept(uid, admin) {
    return client.reception.create({
        data: {
            studentId: uid,
            adminId: admin.id,
        },
    });
}

module.exports = { recept };
