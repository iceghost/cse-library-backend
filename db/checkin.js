const client = require('.');

/**
 * @param {import('@prisma/client').User} user
 */
async function getLatestCheckinByUser(user) {
    const userCheckin = await client.checkin.findFirst({
        where: { userId: user.id },
        // orderBy: { createdAt: 'desc' },
        take: -1,
        include: { checkout: true },
    });
    return userCheckin;
}

/**
 * @param {import('@prisma/client').Seat} seat
 */
async function getLatestCheckinBySeat(seat) {
    const seatCheckin = await client.checkin.findFirst({
        where: { seatId: seat.id },
        // orderBy: { createdAt: 'desc' },
        take: -1,
        include: { checkout: true },
    });
    return seatCheckin;
}

module.exports = { getLatestCheckinByUser, getLatestCheckinBySeat };
