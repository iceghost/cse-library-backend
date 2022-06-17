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
const hash = async (password) => await bcrypt.hash(password, 10);

async function main() {
    // await prisma.checkout.deleteMany();
    // await prisma.checkin.deleteMany();

    const khang = {
        email: 'khang.nguyenduycse@hcmut.edu.vn',
        id: 101,
        fname: 'Khang',
        lname: 'ND',
        password: await hash('khang1234'),
    };
    await prisma.user.upsert({
        where: { email: khang.email },
        update: khang,
        create: { ...khang, admin: { create: {} } },
    });

    const nghi = {
        email: 'nghi.nguyen1805vt@hcmut.edu.vn',
        id: 100,
        fname: 'Nghi',
        lname: 'NDP',
        password: await hash('nghi1234'),
    };
    await prisma.user.upsert({
        where: { email: nghi.email },
        update: nghi,
        create: { ...nghi, admin: { create: {} } },
    });

    for (const x of dummy()) {
        const user = {
            email: `${x}@hcmut.edu.vn`,
            id: x.charCodeAt(0),
            fname: `${x}`,
            lname: `lname ${x}`,
            password: await hash(`${x}1234`),
        };
        await prisma.user.upsert({
            where: { email: user.email },
            update: user,
            create: user,
        });
    }

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
