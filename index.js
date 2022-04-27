// @ts-check
// try check in and check out
/**
 * @typedef {import('@prisma/client').Student} Student
 * @typedef {import('@prisma/client').Admin} Admin
 */
const { PrismaClient } = require('@prisma/client');

const prisma = new PrismaClient();

/**
 * @param {Student} student
 * @param {Admin} admin
 */
async function checkIn(student, admin) {
  await prisma.log.create({
    data: {
      studentId: student.studentId,
      adminId: admin.studentId,
      goingIn: true,
    },
  });
}

/**
 * @param {Student} student
 * @param {Admin} admin
 */
async function checkOut(student, admin) {
  await prisma.log.create({
    data: {
      studentId: student.studentId,
      adminId: admin.studentId,
      goingIn: false,
    },
  });
}

(async () => {
  const admins = await prisma.admin.findMany();
  const admin = () => admins[Math.floor(Math.random() * admins.length)];
  const A = await prisma.student.findUnique({ where: { studentId: 3 } });
  const B = await prisma.student.findUnique({ where: { studentId: 4 } });
  await checkIn(A, admin());
  await checkIn(B, admin());
  await checkOut(B, admin());
  await checkOut(A, admin());
})();
