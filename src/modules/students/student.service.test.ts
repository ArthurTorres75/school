import { describe, expect, it, vi } from "vitest";

import { STUDENT_ERROR_CODE, StudentError } from "@/modules/students/student.errors";
import type { StudentRepository } from "@/modules/students/student.repository";
import { StudentService } from "@/modules/students/student.service";
import {
  STUDENT_GRADES_VIEWER_ROLE,
  STUDENT_INSCRIPTION_ACTOR_ROLE,
} from "@/modules/students/student.types";

function createRepositoryMock(): StudentRepository {
  return {
    findById: vi.fn(),
    update: vi.fn(),
    findStudentProfileForInscription: vi.fn(),
    listParentChildren: vi.fn(),
    listAdminStudents: vi.fn(),
    getParentChildGrades: vi.fn(),
    getAdminStudentGrades: vi.fn(),
    findParentProfileByUserId: vi.fn(),
    hasInscriptionForStudent: vi.fn(),
    hasCedulaNumber: vi.fn(),
    findInvalidCourseIds: vi.fn(),
    findDuplicateEnrollmentCourseIds: vi.fn(),
    createInscriptionWithEnrollments: vi.fn(),
  };
}

const baseInput = {
  studentUserId: "student-user-id",
  organizationId: "org-id",
  birthDate: "2015-01-01",
  gradeLevel: 5,
  cedulaNumber: "V12345678",
  enrollments: [{ courseId: "course-1" }],
};

describe("StudentService.inscribeStudent", () => {
  it("throws TENANT_MISMATCH when student organization differs", async () => {
    const repository = createRepositoryMock();
    const service = new StudentService(repository);

    vi.mocked(repository.findStudentProfileForInscription).mockResolvedValue({
      studentId: "student-id",
      userId: "student-user-id",
      userRole: "student",
      userEmail: "student@example.com",
      registeredParentEmail: "parent@example.com",
      organizationId: "other-org",
    });

    await expect(
      service.inscribeStudent(
        {
          ...baseInput,
          parentUserId: "parent-user-id",
        },
        {
          userId: "admin-user-id",
          role: STUDENT_INSCRIPTION_ACTOR_ROLE.ADMIN,
        },
      ),
    ).rejects.toEqual(new StudentError(STUDENT_ERROR_CODE.TENANT_MISMATCH));
  });

  it("throws DUPLICATE_CEDULA when conflict exists", async () => {
    const repository = createRepositoryMock();
    const service = new StudentService(repository);

    vi.mocked(repository.findStudentProfileForInscription).mockResolvedValue({
      studentId: "student-id",
      userId: "student-user-id",
      userRole: "student",
      userEmail: "student@example.com",
      registeredParentEmail: "parent@example.com",
      organizationId: "org-id",
    });
    vi.mocked(repository.findParentProfileByUserId).mockResolvedValue({
      parentId: "parent-id",
      userId: "parent-user-id",
      userEmail: "parent@example.com",
      organizationId: "org-id",
    });
    vi.mocked(repository.hasInscriptionForStudent).mockResolvedValue(false);
    vi.mocked(repository.hasCedulaNumber).mockResolvedValue(true);

    await expect(
      service.inscribeStudent(
        {
          ...baseInput,
          parentUserId: "parent-user-id",
        },
        {
          userId: "admin-user-id",
          role: STUDENT_INSCRIPTION_ACTOR_ROLE.ADMIN,
        },
      ),
    ).rejects.toEqual(new StudentError(STUDENT_ERROR_CODE.DUPLICATE_CEDULA));
  });

  it("creates inscription successfully for admin", async () => {
    const repository = createRepositoryMock();
    const service = new StudentService(repository);

    vi.mocked(repository.findStudentProfileForInscription).mockResolvedValue({
      studentId: "student-id",
      userId: "student-user-id",
      userRole: "student",
      userEmail: "student@example.com",
      registeredParentEmail: "parent@example.com",
      organizationId: "org-id",
    });
    vi.mocked(repository.findParentProfileByUserId).mockResolvedValue({
      parentId: "parent-id",
      userId: "parent-user-id",
      userEmail: "parent@example.com",
      organizationId: "org-id",
    });
    vi.mocked(repository.hasInscriptionForStudent).mockResolvedValue(false);
    vi.mocked(repository.hasCedulaNumber).mockResolvedValue(false);
    vi.mocked(repository.findInvalidCourseIds).mockResolvedValue([]);
    vi.mocked(repository.findDuplicateEnrollmentCourseIds).mockResolvedValue([]);
    vi.mocked(repository.createInscriptionWithEnrollments).mockResolvedValue({
      inscription: {
        id: "inscription-id",
        studentId: "student-id",
        parentId: "parent-id",
        organizationId: "org-id",
        gradeLevel: 5,
        birthDate: new Date("2015-01-01").toISOString(),
        cedulaNumber: "V12345678",
        status: "active",
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
      },
      enrollmentIds: ["enrollment-id"],
    });

    const result = await service.inscribeStudent(
      {
        ...baseInput,
        parentUserId: "parent-user-id",
      },
      {
        userId: "admin-user-id",
        role: STUDENT_INSCRIPTION_ACTOR_ROLE.ADMIN,
      },
    );

    expect(result.inscription.id).toBe("inscription-id");
    expect(result.enrollmentIds).toEqual(["enrollment-id"]);
    expect(repository.createInscriptionWithEnrollments).toHaveBeenCalledOnce();
  });
});

describe("StudentService parent views", () => {
  it("returns linked children for parent", async () => {
    const repository = createRepositoryMock();
    const service = new StudentService(repository);

    vi.mocked(repository.listParentChildren).mockResolvedValue([
      {
        studentId: "student-id",
        studentUserId: "student-user-id",
        fullName: "Student One",
        email: "student1@example.com",
        organizationId: "org-id",
        isInscribed: true,
        inscriptionStatus: "active",
      },
    ]);

    const result = await service.listParentChildren("parent-user-id");

    expect(result).toHaveLength(1);
    expect(result[0]?.studentUserId).toBe("student-user-id");
  });

  it("throws INVALID_PARENT_LINK when parent requests unrelated child grades", async () => {
    const repository = createRepositoryMock();
    const service = new StudentService(repository);

    vi.mocked(repository.getParentChildGrades).mockResolvedValue(null);

    await expect(service.getParentChildGrades("parent-user-id", "student-user-id")).rejects.toEqual(
      new StudentError(STUDENT_ERROR_CODE.INVALID_PARENT_LINK),
    );
  });

  it("returns admin students when viewer role is admin", async () => {
    const repository = createRepositoryMock();
    const service = new StudentService(repository);

    vi.mocked(repository.listAdminStudents).mockResolvedValue([
      {
        studentId: "student-id",
        studentUserId: "student-user-id",
        fullName: "Student One",
        email: "student1@example.com",
        organizationId: "org-id",
        isInscribed: false,
      },
    ]);

    const result = await service.listViewerChildren({
      userId: "admin-user-id",
      role: STUDENT_GRADES_VIEWER_ROLE.ADMIN,
    });

    expect(result.actorRole).toBe(STUDENT_GRADES_VIEWER_ROLE.ADMIN);
    expect(result.students).toHaveLength(1);
  });

  it("throws STUDENT_NOT_FOUND when admin requests student outside tenant", async () => {
    const repository = createRepositoryMock();
    const service = new StudentService(repository);

    vi.mocked(repository.getAdminStudentGrades).mockResolvedValue(null);

    await expect(
      service.getViewerChildGrades(
        {
          userId: "admin-user-id",
          role: STUDENT_GRADES_VIEWER_ROLE.ADMIN,
        },
        "student-user-id",
      ),
    ).rejects.toEqual(new StudentError(STUDENT_ERROR_CODE.STUDENT_NOT_FOUND));
  });
});
