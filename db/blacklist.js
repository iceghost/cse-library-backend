const client = require('.');

/**
 * @param {number} uid
 * @param {import('@prisma/client').Admin} author
 */
async function blackListCreate(uid, author) {
    const blacklist = await client.blacklist.create({
        data: {
            studentId: uid,
            authorId: author.id,
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
    const the_student = await client.blacklist.findUnique({
        where: { studentId: id },
    });

    return the_student;
}

/**
 * @param {number} id
 * @param {import('@prisma/client').Admin} admin
 */
async function blackListDeleteOne(id, admin) {
    const blacklist = await client.blacklist.update({
        where: { studentId: id },
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
