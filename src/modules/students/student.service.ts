import { USER_ROLE } from "@/modules/users/user.constants";
import { STUDENT_ERROR_CODE, StudentError } from "@/modules/students/student.errors";
import { PrismaStudentRepository, type StudentRepository } from "@/modules/students/student.repository";
import {
  validateCreateStudentInput,
  validateCreateStudentInscriptionInput,
  validateUpdateStudentInput,
} from "@/modules/students/student.schema";
import {
  STUDENT_GRADES_VIEWER_ROLE,
  STUDENT_INSCRIPTION_ACTOR_ROLE,
  type CreateStudentInput,
  type CreateStudentInscriptionInput,
  type ParentChildGradesResult,
  type ParentChildOverviewItem,
  type Student,
  type StudentGradesViewer,
  type StudentGradesViewerListResult,
  type StudentInscriptionActor,
  type StudentInscriptionResult,
  type UpdateStudentInput,
} from "@/modules/students/student.types";
import type { Prisma } from "@prisma/client";

export class StudentService {
  constructor(private readonly repository: StudentRepository = new PrismaStudentRepository()) {}

  async createStudent(input: CreateStudentInput): Promise<Student> {
    validateCreateStudentInput(input);
    throw new StudentError(
      STUDENT_ERROR_CODE.VALIDATION_ERROR,
      "La creacion legacy de estudiantes esta deshabilitada. Usa el flujo de inscripcion.",
    );
  }

  async updateStudent(id: string, input: UpdateStudentInput): Promise<Student> {
    const parsedInput = validateUpdateStudentInput(input);
    return this.repository.update(id, parsedInput);
  }

  async getStudentById(id: string): Promise<Student | null> {
    return this.repository.findById(id);
  }

  async listParentChildren(parentUserId: string): Promise<ParentChildOverviewItem[]> {
    return this.repository.listParentChildren(parentUserId);
  }

  async listViewerChildren(viewer: StudentGradesViewer): Promise<StudentGradesViewerListResult> {
    if (viewer.role === STUDENT_GRADES_VIEWER_ROLE.PARENT) {
      return {
        actorRole: STUDENT_GRADES_VIEWER_ROLE.PARENT,
        students: await this.repository.listParentChildren(viewer.userId),
      };
    }

    if (viewer.role === STUDENT_GRADES_VIEWER_ROLE.ADMIN) {
      return {
        actorRole: STUDENT_GRADES_VIEWER_ROLE.ADMIN,
        students: await this.repository.listAdminStudents(viewer.userId),
      };
    }

    throw new StudentError(STUDENT_ERROR_CODE.FORBIDDEN_ACTOR);
  }

  async getParentChildGrades(parentUserId: string, studentUserId: string): Promise<ParentChildGradesResult> {
    const result = await this.repository.getParentChildGrades(parentUserId, studentUserId);

    if (!result) {
      throw new StudentError(STUDENT_ERROR_CODE.INVALID_PARENT_LINK);
    }

    return result;
  }

  async getViewerChildGrades(viewer: StudentGradesViewer, studentUserId: string): Promise<ParentChildGradesResult> {
    if (viewer.role === STUDENT_GRADES_VIEWER_ROLE.PARENT) {
      const result = await this.repository.getParentChildGrades(viewer.userId, studentUserId);

      if (!result) {
        throw new StudentError(STUDENT_ERROR_CODE.INVALID_PARENT_LINK);
      }

      return result;
    }

    if (viewer.role === STUDENT_GRADES_VIEWER_ROLE.ADMIN) {
      const result = await this.repository.getAdminStudentGrades(viewer.userId, studentUserId);

      if (!result) {
        throw new StudentError(STUDENT_ERROR_CODE.STUDENT_NOT_FOUND);
      }

      return result;
    }

    throw new StudentError(STUDENT_ERROR_CODE.FORBIDDEN_ACTOR);
  }

  async inscribeStudent(
    input: CreateStudentInscriptionInput,
    actor: StudentInscriptionActor,
  ): Promise<StudentInscriptionResult> {
    if (
      actor.role !== STUDENT_INSCRIPTION_ACTOR_ROLE.PARENT
      && actor.role !== STUDENT_INSCRIPTION_ACTOR_ROLE.ADMIN
    ) {
      throw new StudentError(STUDENT_ERROR_CODE.FORBIDDEN_ACTOR);
    }

    const parsedInput = validateCreateStudentInscriptionInput(input, actor.role);
    const studentProfile = await this.repository.findStudentProfileForInscription(parsedInput.studentUserId);

    if (!studentProfile) {
      throw new StudentError(STUDENT_ERROR_CODE.STUDENT_NOT_FOUND);
    }

    if (studentProfile.userRole !== USER_ROLE.STUDENT) {
      throw new StudentError(STUDENT_ERROR_CODE.STUDENT_ROLE_MISMATCH);
    }

    if (studentProfile.organizationId !== parsedInput.organizationId) {
      throw new StudentError(STUDENT_ERROR_CODE.TENANT_MISMATCH);
    }

    const resolvedParentUserId =
      actor.role === STUDENT_INSCRIPTION_ACTOR_ROLE.PARENT
        ? actor.userId
        : parsedInput.parentUserId;

    if (!resolvedParentUserId) {
      throw new StudentError(STUDENT_ERROR_CODE.MISSING_PARENT_REFERENCE);
    }

    const parentProfile = await this.repository.findParentProfileByUserId(resolvedParentUserId);

    if (!parentProfile) {
      throw new StudentError(STUDENT_ERROR_CODE.INVALID_PARENT_LINK);
    }

    if (parentProfile.organizationId !== parsedInput.organizationId) {
      throw new StudentError(STUDENT_ERROR_CODE.TENANT_MISMATCH);
    }

    if (
      !studentProfile.registeredParentEmail
      || studentProfile.registeredParentEmail.toLowerCase() !== parentProfile.userEmail.toLowerCase()
    ) {
      const isLinkedByJoin = await this.repository.hasParentStudentLink(
        studentProfile.studentId,
        parentProfile.parentId,
      );
      if (!isLinkedByJoin) {
        throw new StudentError(STUDENT_ERROR_CODE.INVALID_PARENT_LINK);
      }
    }

    const hasExistingInscription = await this.repository.hasInscriptionForStudent(studentProfile.studentId);

    if (hasExistingInscription) {
      throw new StudentError(STUDENT_ERROR_CODE.STUDENT_ALREADY_INSCRIBED);
    }

    const hasCedulaConflict = await this.repository.hasCedulaNumber(parsedInput.cedulaNumber);

    if (hasCedulaConflict) {
      throw new StudentError(STUDENT_ERROR_CODE.DUPLICATE_CEDULA);
    }

    const requestedCourseIds = parsedInput.enrollments.map((item) => item.courseId);
    const invalidCourseIds = await this.repository.findInvalidCourseIds(parsedInput.organizationId, requestedCourseIds);

    if (invalidCourseIds.length > 0) {
      throw new StudentError(STUDENT_ERROR_CODE.INVALID_COURSE_SELECTION);
    }

    const duplicateCourseIds = await this.repository.findDuplicateEnrollmentCourseIds(
      studentProfile.studentId,
      requestedCourseIds,
    );

    if (duplicateCourseIds.length > 0) {
      throw new StudentError(STUDENT_ERROR_CODE.DUPLICATE_ENROLLMENT);
    }

    try {
      return await this.repository.createInscriptionWithEnrollments({
        studentId: studentProfile.studentId,
        parentId: parentProfile.parentId,
        organizationId: parsedInput.organizationId,
        birthDate: parsedInput.birthDate,
        gradeLevel: parsedInput.gradeLevel,
        cedulaNumber: parsedInput.cedulaNumber,
        enrollments: parsedInput.enrollments,
      });
    } catch (error: unknown) {
      if (isPrismaUniqueConstraintError(error)) {
        throw new StudentError(STUDENT_ERROR_CODE.DUPLICATE_CEDULA);
      }

      throw new StudentError(STUDENT_ERROR_CODE.TRANSACTION_FAILED);
    }
  }
}

function isPrismaUniqueConstraintError(error: unknown): error is Prisma.PrismaClientKnownRequestError {
  if (typeof error !== "object" || error === null || !("code" in error)) {
    return false;
  }

  return error.code === "P2002";
}
