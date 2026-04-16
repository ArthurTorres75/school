const { randomBytes, scryptSync } = require("node:crypto");
const { PrismaClient } = require("@prisma/client");

const prisma = new PrismaClient();

function hashPassword(password) {
  const salt = randomBytes(16).toString("hex");
  const derivedKey = scryptSync(password, salt, 64).toString("hex");

  return `${salt}:${derivedKey}`;
}

async function ensureCourse({ organizationId, teacherId }) {
  const existing = await prisma.course.findFirst({
    where: {
      organizationId,
      code: "MAT-101",
    },
  });

  if (existing) {
    return existing;
  }

  return prisma.course.create({
    data: {
      name: "Matematicas 1",
      description: "Introduccion a aritmetica y resolucion de problemas.",
      code: "MAT-101",
      isActive: true,
      organizationId,
      teacherId,
    },
  });
}

async function ensureParentStudent({ parentId, studentId }) {
  const relation = await prisma.parentStudent.findFirst({
    where: {
      parentId,
      studentId,
    },
  });

  if (relation) {
    return relation;
  }

  return prisma.parentStudent.create({
    data: {
      parentId,
      studentId,
    },
  });
}

async function ensureEnrollment({ studentId, courseId }) {
  const existing = await prisma.enrollment.findFirst({
    where: {
      studentId,
      courseId,
    },
  });

  if (existing) {
    return existing;
  }

  return prisma.enrollment.create({
    data: {
      studentId,
      courseId,
      status: "active",
    },
  });
}

async function ensureGrade({ studentId, courseId, gradedById }) {
  const existing = await prisma.grade.findFirst({
    where: {
      studentId,
      courseId,
      category: "exam",
      title: "Examen 1",
    },
  });

  if (existing) {
    return existing;
  }

  return prisma.grade.create({
    data: {
      studentId,
      courseId,
      gradedById,
      category: "exam",
      title: "Examen 1",
      value: 87,
      maxScore: 100,
      weight: 0.4,
      isCalculated: false,
    },
  });
}

async function ensureNews({ organizationId, authorId, courseId }) {
  const existing = await prisma.news.findUnique({
    where: {
      slug: "bienvenida-ciclo-lectivo",
    },
  });

  if (existing) {
    return existing;
  }

  return prisma.news.create({
    data: {
      title: "Bienvenida al ciclo lectivo",
      slug: "bienvenida-ciclo-lectivo",
      content:
        "Iniciamos un nuevo ciclo con enfoque en aprendizaje activo, acompanamiento familiar y evaluacion continua.",
      excerpt: "Comunicado de inicio de ciclo lectivo.",
      published: true,
      publishedAt: new Date(),
      organizationId,
      authorId,
      courseId,
    },
  });
}

async function main() {
  const adminPasswordHash = hashPassword("Admin123!*");
  const teacherPasswordHash = hashPassword("Teacher123!*");
  const parentPasswordHash = hashPassword("Parent123!*");
  const studentPasswordHash = hashPassword("Student123!*");

  const organization = await prisma.organization.upsert({
    where: {
      slug: "colegio-demo",
    },
    update: {
      name: "Colegio Demo",
      isActive: true,
    },
    create: {
      name: "Colegio Demo",
      slug: "colegio-demo",
      isActive: true,
    },
  });

  const adminUser = await prisma.user.upsert({
    where: {
      email: "admin@colegiodemo.edu",
    },
    update: {
      fullName: "Admin Colegio",
      role: "admin",
      passwordHash: adminPasswordHash,
      organizationId: organization.id,
      isActive: true,
    },
    create: {
      fullName: "Admin Colegio",
      email: "admin@colegiodemo.edu",
      role: "admin",
      passwordHash: adminPasswordHash,
      organizationId: organization.id,
      isActive: true,
    },
  });

  const teacherUser = await prisma.user.upsert({
    where: {
      email: "docente@colegiodemo.edu",
    },
    update: {
      fullName: "Docente Demo",
      role: "teacher",
      passwordHash: teacherPasswordHash,
      organizationId: organization.id,
      isActive: true,
    },
    create: {
      fullName: "Docente Demo",
      email: "docente@colegiodemo.edu",
      role: "teacher",
      passwordHash: teacherPasswordHash,
      organizationId: organization.id,
      isActive: true,
    },
  });

  const parentUser = await prisma.user.upsert({
    where: {
      email: "padre@colegiodemo.edu",
    },
    update: {
      fullName: "Padre Demo",
      role: "parent",
      passwordHash: parentPasswordHash,
      organizationId: organization.id,
      isActive: true,
    },
    create: {
      fullName: "Padre Demo",
      email: "padre@colegiodemo.edu",
      role: "parent",
      passwordHash: parentPasswordHash,
      organizationId: organization.id,
      isActive: true,
    },
  });

  const studentUser = await prisma.user.upsert({
    where: {
      email: "alumno@colegiodemo.edu",
    },
    update: {
      fullName: "Alumno Demo",
      role: "student",
      passwordHash: studentPasswordHash,
      organizationId: organization.id,
      isActive: true,
    },
    create: {
      fullName: "Alumno Demo",
      email: "alumno@colegiodemo.edu",
      role: "student",
      passwordHash: studentPasswordHash,
      organizationId: organization.id,
      isActive: true,
    },
  });

  const teacher = await prisma.teacher.upsert({
    where: {
      userId: teacherUser.id,
    },
    update: {
      organizationId: organization.id,
    },
    create: {
      userId: teacherUser.id,
      organizationId: organization.id,
    },
  });

  const parent = await prisma.parent.upsert({
    where: {
      userId: parentUser.id,
    },
    update: {
      organizationId: organization.id,
    },
    create: {
      userId: parentUser.id,
      organizationId: organization.id,
    },
  });

  const student = await prisma.student.upsert({
    where: {
      userId: studentUser.id,
    },
    update: {
      organizationId: organization.id,
      isActive: true,
    },
    create: {
      userId: studentUser.id,
      organizationId: organization.id,
      isActive: true,
    },
  });

  const course = await ensureCourse({
    organizationId: organization.id,
    teacherId: teacher.id,
  });

  await ensureParentStudent({
    parentId: parent.id,
    studentId: student.id,
  });

  await ensureEnrollment({
    studentId: student.id,
    courseId: course.id,
  });

  await ensureGrade({
    studentId: student.id,
    courseId: course.id,
    gradedById: teacherUser.id,
  });

  await ensureNews({
    organizationId: organization.id,
    authorId: adminUser.id,
    courseId: course.id,
  });

  console.log("Seed completed successfully.");
  console.log("Admin:", adminUser.email, "password: Admin123!*");
  console.log("Teacher:", teacherUser.email, "password: Teacher123!*");
  console.log("Parent:", parentUser.email, "password: Parent123!*");
  console.log("Student:", studentUser.email, "password: Student123!*");
}

main()
  .catch((error) => {
    console.error("Seed failed:", error);
    process.exitCode = 1;
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
