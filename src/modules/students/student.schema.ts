import type { CreateStudentInput, UpdateStudentInput } from "@/modules/students/student.types";

export function validateCreateStudentInput(input: CreateStudentInput): CreateStudentInput {
  return {
    fullName: input.fullName.trim(),
    email: input.email.trim().toLowerCase(),
  };
}

export function validateUpdateStudentInput(input: UpdateStudentInput): UpdateStudentInput {
  return {
    fullName: input.fullName?.trim(),
    email: input.email?.trim().toLowerCase(),
  };
}
