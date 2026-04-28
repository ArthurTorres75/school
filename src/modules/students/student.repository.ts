import { prisma } from "@/lib/prisma";
import type {
  CreateStudentInscriptionPersistenceInput,
  ParentChildGradesResult,
  ParentChildOverviewItem,
  ParentProfileForInscription,
  Student,
  StudentInscriptionResult,
  StudentProfileForInscription,
  UpdateStudentInput,
} from "@/modules/students/student.types";
import { STUDENT_INSCRIPTION_STATUS } from "@/modules/students/student.types";
import { STUDENT_ERROR_CODE, StudentError } from "@/modules/students/student.errors";

export interface StudentRepository {
  findById(id: string): Promise<Student | null>;
  update(id: string, input: UpdateStudentInput): Promise<Student>;
  findStudentProfileForInscription(studentUserId: string): Promise<StudentProfileForInscription | null>;
  listParentChildren(parentUserId: string): Promise<ParentChildOverviewItem[]>;
  listAdminStudents(adminUserId: string): Promise<ParentChildOverviewItem[]>;
  getParentChildGrades(parentUserId: string, studentUserId: string): Promise<ParentChildGradesResult | null>;
  getAdminStudentGrades(adminUserId: string, studentUserId: string): Promise<ParentChildGradesResult | null>;
  findParentProfileByUserId(parentUserId: string): Promise<ParentProfileForInscription | null>;
  hasParentStudentLink(studentId: string, parentId: string): Promise<boolean>;
  hasInscriptionForStudent(studentId: string): Promise<boolean>;
  hasCedulaNumber(cedulaNumber: string): Promise<boolean>;
  findInvalidCourseIds(organizationId: string, courseIds: string[]): Promise<string[]>;
  findDuplicateEnrollmentCourseIds(studentId: string, courseIds: string[]): Promise<string[]>;
  createInscriptionWithEnrollments(input: CreateStudentInscriptionPersistenceInput): Promise<StudentInscriptionResult>;
}

export class PrismaStudentRepository implements StudentRepository {
  async findById(id: string): Promise<Student | null> {
    const student = await prisma.student.findUnique({
      where: { id },
      include: { user: true },
    });

    if (!student) {
      return null;
    }

    return {
      id: student.id,
      fullName: student.user.fullName,
      email: student.user.email,
      createdAt: student.createdAt.toISOString(),
      updatedAt: student.updatedAt.toISOString(),
    };
  }

  async update(id: string, input: UpdateStudentInput): Promise<Student> {
    const current = await prisma.student.findUnique({
      where: { id },
      include: { user: true },
    });

    if (!current) {
      throw new StudentError(STUDENT_ERROR_CODE.STUDENT_NOT_FOUND);
    }

    const updatedUser = await prisma.user.update({
      where: { id: current.userId },
      data: {
        ...(input.fullName ? { fullName: input.fullName } : {}),
        ...(input.email ? { email: input.email } : {}),
      },
    });

    return {
      id,
      fullName: updatedUser.fullName,
      email: updatedUser.email,
      createdAt: current.createdAt.toISOString(),
      updatedAt: current.updatedAt.toISOString(),
    };
  }

  async findStudentProfileForInscription(studentUserId: string): Promise<StudentProfileForInscription | null> {
    const student = await prisma.student.findUnique({
      where: { userId: studentUserId },
      include: { user: true },
    });

    if (!student) {
      return null;
    }

    return {
      studentId: student.id,
      userId: student.userId,
      userRole: student.user.role,
      userEmail: student.user.email,
      registeredParentEmail: student.user.registeredParentEmail ?? undefined,
      organizationId: student.organizationId,
    };
  }

  async findParentProfileByUserId(parentUserId: string): Promise<ParentProfileForInscription | null> {
    const parent = await prisma.parent.findUnique({
      where: { userId: parentUserId },
      include: { user: true },
    });

    if (!parent || !parent.organizationId) {
      return null;
    }

    return {
      parentId: parent.id,
      userId: parent.userId,
      userEmail: parent.user.email,
      organizationId: parent.organizationId,
    };
  }

  async listParentChildren(parentUserId: string): Promise<ParentChildOverviewItem[]> {
    const parent = await prisma.parent.findUnique({
      where: { userId: parentUserId },
      select: {
        id: true,
        organizationId: true,
        user: { select: { email: true } },
      },
    });

    if (!parent || !parent.organizationId) {
      return [];
    }

    const students = await prisma.student.findMany({
      where: {
        organizationId: parent.organizationId,
        OR: [
          {
            parents: {
              some: { parentId: parent.id },
            },
          },
          {
            user: {
              registeredParentEmail: parent.user.email,
            },
          },
        ],
      },
      select: {
        id: true,
        userId: true,
        organizationId: true,
        user: {
          select: {
            fullName: true,
            email: true,
          },
        },
        inscription: {
          select: {
            status: true,
          },
        },
      },
      orderBy: {
        createdAt: "desc",
      },
    });

    return students.map((student) => ({
      studentId: student.id,
      studentUserId: student.userId,
      fullName: student.user.fullName,
      email: student.user.email,
      organizationId: student.organizationId,
      isInscribed: Boolean(student.inscription),
      inscriptionStatus: student.inscription?.status,
    }));
  }

  async getParentChildGrades(parentUserId: string, studentUserId: string): Promise<ParentChildGradesResult | null> {
    const parent = await prisma.parent.findUnique({
      where: { userId: parentUserId },
      select: {
        id: true,
        organizationId: true,
        user: { select: { email: true } },
      },
    });

    if (!parent || !parent.organizationId) {
      return null;
    }

    const student = await prisma.student.findFirst({
      where: {
        userId: studentUserId,
        organizationId: parent.organizationId,
        OR: [
          {
            parents: {
              some: { parentId: parent.id },
            },
          },
          {
            user: {
              registeredParentEmail: parent.user.email,
            },
          },
        ],
      },
      select: {
        id: true,
        userId: true,
        organizationId: true,
        user: {
          select: {
            fullName: true,
            email: true,
          },
        },
        inscription: {
          select: {
            status: true,
          },
        },
      },
    });

    if (!student) {
      return null;
    }

    const grades = await prisma.grade.findMany({
      where: { studentId: student.id },
      select: {
        id: true,
        title: true,
        category: true,
        value: true,
        maxScore: true,
        gradedAt: true,
        course: {
          select: {
            name: true,
          },
        },
      },
      orderBy: {
        gradedAt: "desc",
      },
    });

    const gradeItems = grades.map((grade) => ({
      id: grade.id,
      courseName: grade.course.name,
      category: grade.category,
      title: grade.title,
      value: grade.value,
      maxScore: grade.maxScore,
      gradedAt: grade.gradedAt.toISOString(),
    }));

    const averagePercent =
      gradeItems.length > 0
        ? gradeItems.reduce((acc, grade) => acc + (grade.value / grade.maxScore) * 100, 0) / gradeItems.length
        : null;

    return {
      child: {
        studentId: student.id,
        studentUserId: student.userId,
        fullName: student.user.fullName,
        email: student.user.email,
        organizationId: student.organizationId,
        isInscribed: Boolean(student.inscription),
        inscriptionStatus: student.inscription?.status,
      },
      grades: gradeItems,
      averagePercent,
    };
  }

  async listAdminStudents(adminUserId: string): Promise<ParentChildOverviewItem[]> {
    const adminUser = await prisma.user.findUnique({
      where: { id: adminUserId },
      select: {
        organizationId: true,
      },
    });

    if (!adminUser?.organizationId) {
      return [];
    }

    const students = await prisma.student.findMany({
      where: {
        organizationId: adminUser.organizationId,
      },
      select: {
        id: true,
        userId: true,
        organizationId: true,
        user: {
          select: {
            fullName: true,
            email: true,
          },
        },
        inscription: {
          select: {
            status: true,
          },
        },
      },
      orderBy: {
        createdAt: "desc",
      },
    });

    return students.map((student) => ({
      studentId: student.id,
      studentUserId: student.userId,
      fullName: student.user.fullName,
      email: student.user.email,
      organizationId: student.organizationId,
      isInscribed: Boolean(student.inscription),
      inscriptionStatus: student.inscription?.status,
    }));
  }

  async getAdminStudentGrades(adminUserId: string, studentUserId: string): Promise<ParentChildGradesResult | null> {
    const adminUser = await prisma.user.findUnique({
      where: { id: adminUserId },
      select: {
        organizationId: true,
      },
    });

    if (!adminUser?.organizationId) {
      return null;
    }

    const student = await prisma.student.findFirst({
      where: {
        userId: studentUserId,
        organizationId: adminUser.organizationId,
      },
      select: {
        id: true,
        userId: true,
        organizationId: true,
        user: {
          select: {
            fullName: true,
            email: true,
          },
        },
        inscription: {
          select: {
            status: true,
          },
        },
      },
    });

    if (!student) {
      return null;
    }

    const grades = await prisma.grade.findMany({
      where: { studentId: student.id },
      select: {
        id: true,
        title: true,
        category: true,
        value: true,
        maxScore: true,
        gradedAt: true,
        course: {
          select: {
            name: true,
          },
        },
      },
      orderBy: {
        gradedAt: "desc",
      },
    });

    const gradeItems = grades.map((grade) => ({
      id: grade.id,
      courseName: grade.course.name,
      category: grade.category,
      title: grade.title,
      value: grade.value,
      maxScore: grade.maxScore,
      gradedAt: grade.gradedAt.toISOString(),
    }));

    const averagePercent =
      gradeItems.length > 0
        ? gradeItems.reduce((acc, grade) => acc + (grade.value / grade.maxScore) * 100, 0) / gradeItems.length
        : null;

    return {
      child: {
        studentId: student.id,
        studentUserId: student.userId,
        fullName: student.user.fullName,
        email: student.user.email,
        organizationId: student.organizationId,
        isInscribed: Boolean(student.inscription),
        inscriptionStatus: student.inscription?.status,
      },
      grades: gradeItems,
      averagePercent,
    };
  }

  async hasParentStudentLink(studentId: string, parentId: string): Promise<boolean> {
    const link = await prisma.parentStudent.findUnique({
      where: { studentId_parentId: { studentId, parentId } },
      select: { studentId: true },
    });
    return Boolean(link);
  }

  async hasInscriptionForStudent(studentId: string): Promise<boolean> {
    const existing = await prisma.inscription.findUnique({
      where: { studentId },
      select: { id: true },
    });

    return Boolean(existing);
  }

  async hasCedulaNumber(cedulaNumber: string): Promise<boolean> {
    const existing = await prisma.inscription.findUnique({
      where: { cedulaNumber },
      select: { id: true },
    });

    return Boolean(existing);
  }

  async findInvalidCourseIds(organizationId: string, courseIds: string[]): Promise<string[]> {
    const distinctCourseIds = [...new Set(courseIds)];
    const foundCourses = await prisma.course.findMany({
      where: {
        id: { in: distinctCourseIds },
        organizationId,
        isActive: true,
      },
      select: { id: true },
    });

    const foundIds = new Set(foundCourses.map((course) => course.id));
    return distinctCourseIds.filter((id) => !foundIds.has(id));
  }

  async findDuplicateEnrollmentCourseIds(studentId: string, courseIds: string[]): Promise<string[]> {
    const existing = await prisma.enrollment.findMany({
      where: {
        studentId,
        courseId: { in: courseIds },
      },
      select: { courseId: true },
    });

    return existing.map((enrollment) => enrollment.courseId);
  }

  async createInscriptionWithEnrollments(input: CreateStudentInscriptionPersistenceInput): Promise<StudentInscriptionResult> {
    const result = await prisma.$transaction(async (transaction) => {
      const inscription = await transaction.inscription.create({
        data: {
          studentId: input.studentId,
          parentId: input.parentId,
          organizationId: input.organizationId,
          birthDate: input.birthDate,
          gradeLevel: input.gradeLevel,
          cedulaNumber: input.cedulaNumber,
          status: STUDENT_INSCRIPTION_STATUS.ACTIVE,
        },
      });

      const enrollments = await Promise.all(
        input.enrollments.map((item) =>
          transaction.enrollment.create({
            data: {
              studentId: input.studentId,
              courseId: item.courseId,
              inscriptionId: inscription.id,
              status: "active",
            },
          }),
        ),
      );

      return {
        inscription,
        enrollments,
      };
    });

    return {
      inscription: {
        id: result.inscription.id,
        studentId: result.inscription.studentId,
        parentId: result.inscription.parentId,
        organizationId: result.inscription.organizationId,
        gradeLevel: result.inscription.gradeLevel,
        birthDate: result.inscription.birthDate.toISOString(),
        cedulaNumber: result.inscription.cedulaNumber,
        status: result.inscription.status,
        createdAt: result.inscription.createdAt.toISOString(),
        updatedAt: result.inscription.updatedAt.toISOString(),
      },
      enrollmentIds: result.enrollments.map((enrollment) => enrollment.id),
    };
  }
}
