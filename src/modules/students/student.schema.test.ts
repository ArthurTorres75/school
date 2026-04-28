import { describe, expect, it } from "vitest";
import { ZodError } from "zod";

import { validateCreateStudentInscriptionInput } from "@/modules/students/student.schema";
import { STUDENT_INSCRIPTION_ACTOR_ROLE } from "@/modules/students/student.types";

const baseInput = {
  studentUserId: "student-user-id",
  organizationId: "org-id",
  birthDate: "2014-05-01",
  gradeLevel: 6,
  cedulaNumber: "V12345678",
  enrollments: [{ courseId: "course-1" }],
};

describe("validateCreateStudentInscriptionInput", () => {
  it("requires parentUserId for admin actor", () => {
    expect(() =>
      validateCreateStudentInscriptionInput(baseInput, STUDENT_INSCRIPTION_ACTOR_ROLE.ADMIN),
    ).toThrow(ZodError);
  });

  it("rejects parentUserId for parent actor", () => {
    expect(() =>
      validateCreateStudentInscriptionInput(
        {
          ...baseInput,
          parentUserId: "parent-user-id",
        },
        STUDENT_INSCRIPTION_ACTOR_ROLE.PARENT,
      ),
    ).toThrow(ZodError);
  });

  it("rejects grade outside allowed range", () => {
    expect(() =>
      validateCreateStudentInscriptionInput(
        {
          ...baseInput,
          gradeLevel: 13,
          parentUserId: "parent-user-id",
        },
        STUDENT_INSCRIPTION_ACTOR_ROLE.ADMIN,
      ),
    ).toThrow(ZodError);
  });

  it("parses valid admin input", () => {
    const result = validateCreateStudentInscriptionInput(
      {
        ...baseInput,
        parentUserId: "parent-user-id",
      },
      STUDENT_INSCRIPTION_ACTOR_ROLE.ADMIN,
    );

    expect(result.parentUserId).toBe("parent-user-id");
    expect(result.birthDate).toBeInstanceOf(Date);
  });
});
