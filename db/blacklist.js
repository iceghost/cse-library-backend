// @ts-check

const client = require('.');

/**
 * @param {number} uid
 * @returns {Promise<import('@prisma/client').Blacklist>}
 */

async function blackListCreate(uid) {
    const blacklist = await client.blacklist.create({
        data: {
            studentId: uid,
            expiredAt: null,      
        },
    });

    return blacklist;
}

async function blackListGetAll() {
    const blacklist = await client.blacklist.findMany({
        where: {},
    });

    blacklist.filter(ele => {
        return ele.expiredAt !== null || ele.expiredAt > ele.createdAt;
        })

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
    const blacklist = await client.blacklist.findUnique({
        where: {
            studentId: id,     
        },
    });

    blacklist.expiredAt = new Date ();
    // console.log("blacklist", blacklist);
    return blacklist;
}

async function blackListDeleteAll() {
    const blacklist = await client.blacklist.findMany({
        where: {},
    });

    for (let ele of blacklist) {
        ele.expiredAt = new Date ();
    }
    return blacklist;
}

module.exports = {blackListCreate, blackListDeleteAll, blackListGetAll, blackListGetOne, blackListDeleteOne};