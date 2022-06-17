const client = require('.');

/**
 * @param {number} uid
 * @param {import('@prisma/client').Admin} author
 */
async function blackListCreate(uid, author) {
    const blacklist = await client.blacklist.upsert({
        where: { userId: uid },
        create: {
            userId: uid,
            authorId: author.id,
        },
        update: {
            createdAt: new Date(),
            expiredAt: null,
        },
    });
    return blacklist;
}

async function blackListGetAll() {
    const blacklist = await client.blacklist.findMany();
    return blacklist.filter((ele) => {
        return ele.expiredAt === null || ele.expiredAt > ele.createdAt;
    });
}

/**
 * @param {number} id
 */
async function blackListGetOne(id) {
    const the_user = await client.blacklist.findUnique({
        where: { userId: id },
    });

    return the_user;
}

/**
 * @param {number} id
 * @param {import('@prisma/client').Admin} admin
 */
async function blackListDeleteOne(id, admin) {
    const blacklist = await client.blacklist.update({
        where: { userId: id },
        data: { expiredAt: new Date(), authorId: admin.id },
    });
    return blacklist;
}

/**
 * @param {import('@prisma/client').Admin} admin
 */
async function blackListDeleteAll(admin) {
    const blacklist = await client.blacklist.updateMany({
        data: { expiredAt: new Date(), authorId: admin.id },
    });
    return blacklist;
}

module.exports = {
    blackListCreate,
    blackListDeleteAll,
    blackListGetAll,
    blackListGetOne,
    blackListDeleteOne,
};
