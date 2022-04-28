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
async function recept(student, admin) {
  await prisma.reception.create({
    data: {
      studentId: student.id,
      adminId: admin.id,
    },
  });
}

(async () => {
  const admins = await prisma.admin.findMany();
  const admin = () => admins[Math.floor(Math.random() * admins.length)];
  const A = await prisma.student.findUnique({ where: { id: 3 } });
  const B = await prisma.student.findUnique({ where: { id: 4 } });
  await recept(A, admin());
  await recept(B, admin());
  await recept(B, admin());
  await recept(A, admin());
})();
