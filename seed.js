// this script is used to pre-populate the database
// see https://www.prisma.io/docs/guides/database/seed-database

require('dotenv').config();

const dummy = () => {
    const alpha = Array.from(Array(26)).map((_, i) => i + 65);
    const alphabet = alpha.map((x) => String.fromCharCode(x));
    console.log('alpha ', alphabet);
    return alphabet;
};

const { PrismaClient } = require('@prisma/client');
const bcrypt = require('bcrypt');
const prisma = new PrismaClient();

/** @param {string} password */
const hash = async (password) =>
    await bcrypt.hash(password, parseInt(process.env['SALT_ROUNDS'] || '5'));

async function main() {
    const admin = {
        email: 'admin',
        id: 1,
        fname: 'Admin',
        lname: '',
        password: await hash(process.env['ADMIN_PASSWORD'] || 'admin'),
    };

    await prisma.user.upsert({
        where: { email: admin.email },
        update: {},
        create: { ...admin, admin: { create: {} } },
    });

    for (let seatId = 0; seatId <= 55; seatId++) {
        await prisma.seat.upsert({
            where: { id: seatId },
            update: {},
            create: { id: seatId },
        });
    }
}

main()
    .catch((e) => {
        console.error(e);
        process.exit(1);
    })
    .finally(async () => {
        await prisma.$disconnect();
    });
