// this script is used to pre-populate the database
// see https://www.prisma.io/docs/guides/database/seed-database

const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

async function main() {
  const khang = await prisma.student.upsert({
    where: { email: 'khang@' },
    update: {},
    create: {
      email: 'khang@',
      studentId: 1,
      fname: 'Khang',
      lname: 'ND',
      admin: {
        create: {},
      },
    },
  });

  const nghi = await prisma.student.upsert({
    where: { email: 'nghi@' },
    update: {},
    create: {
      email: 'nghi@',
      studentId: 2,
      fname: 'Nghi',
      lname: 'NDP',
      admin: {
        create: {},
      },
    },
  });

  const A = await prisma.student.upsert({
    where: { email: 'A@' },
    update: {},
    create: {
      email: 'A@',
      studentId: 3,
      fname: 'A',
      lname: 'NV',
    },
  });

  const B = await prisma.student.upsert({
    where: { email: 'B@' },
    update: {},
    create: {
      email: 'B@',
      studentId: 4,
      fname: 'B',
      lname: 'NV',
    },
  });
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
