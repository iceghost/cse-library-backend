// @ts-check

const client = require('.');

/**
 * @param {number} uid
 * @param {import('@prisma/client').Admin} admin
 * @returns {Promise<import('@prisma/client').Blacklist>}
 */

async function blackListCreate(uid, admin) {
    const blacklist = await client.blacklist.create({
        data: {
            studentId: uid,
            adminId: admin.id,
        },
    });

    return blacklist;
}

async function blackListGetAll() {
    const blacklist = await client.blacklist.findMany({
        where: {},
    });

    return blacklist;
}

async function blackListGetOne(id) {
    const the_student = await client.blacklist.findUnique({
        where: {
            studentId: id,
        },
    });

    return the_student;
}
async function blackListDeleteOne (id) {
    const blacklist = await client.blacklist.deleteMany({
        where: {
            studentId: id,
        },
    });

    return blacklist;
}

async function blackListDeleteAll() {
    const blacklist = await client.blacklist.deleteMany({
        where: {},
    });

    return blacklist;
}

module.exports = {blackListCreate, blackListDeleteAll, blackListGetAll, blackListGetOne, blackListDeleteOne};