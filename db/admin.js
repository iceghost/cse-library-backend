const client = require('.');

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

module.exports = { promoteAdmin };
