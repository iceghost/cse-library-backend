const client = require('.');

/**
 * @param {number} userId
 */
async function getLatestCheckinByUser(userId) {
    const userCheckin = (
        await client.user.findUnique({ where: { id: userId } }).checkins({
            orderBy: { createdAt: 'desc' },
            take: 1,
            include: { checkout: true },
        })
    ).pop();
    return userCheckin;
}

/**
 * @param {number} seatId
 */
async function getLatestCheckinBySeat(seatId) {
    const seatCheckin = (
        await client.seat.findUnique({ where: { id: seatId } }).checkins({
            orderBy: { createdAt: 'desc' },
            take: 1,
            include: { checkout: true },
        })
    ).pop();
    return seatCheckin;
}

module.exports = { getLatestCheckinByUser, getLatestCheckinBySeat };
