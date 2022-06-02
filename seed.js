// @ts-check
// this script is used to pre-populate the database
// see https://www.prisma.io/docs/guides/database/seed-database

const dummy = () => {
  const alpha = Array.from(Array(26)).map((_, i) => i + 65);
  const alphabet = alpha.map((x) => String.fromCharCode(x));
  console.log("alpha ", alphabet);
  return alphabet;
}

const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

async function main() {
  const khang = await prisma.student.upsert({
    where: { email: 'khang.nguyenduycse@hcmut.edu.vn' },
    update: {},
    create: {
      email: 'khang.nguyenduycse@hcmut.edu.vn',
      id: 101,
      fname: 'Khang',
      lname: 'ND',
      admin: {
        create: {},
      },
    },
  });

  const nghi = await prisma.student.upsert({
    where: { email: 'nghi.nguyen1805vt@hcmut.edu.vn' },
    update: {},
    create: {
      email: 'nghi.nguyen1805vt@hcmut.edu.vn',
      id: 100,
      fname: 'Nghi',
      lname: 'NDP',
      admin: {
        create: {},
      },
    },
  });

  dummy().map(async (temp) => {
    prisma.student.upsert({
      where: { email: `${temp}@` },
      update: {},
      create: {
        email: `${temp}@`,
        id: temp.charCodeAt(0),
        fname: temp,
        lname: 'NV',
      },
    });
  })

    // console.log("CCCC => ");
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
