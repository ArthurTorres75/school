import { randomUUID } from "node:crypto";

import type { CreateStudentInput, Student, UpdateStudentInput } from "@/modules/students/student.types";

export interface StudentRepository {
  findById(id: string): Promise<Student | null>;
  create(input: CreateStudentInput): Promise<Student>;
  update(id: string, input: UpdateStudentInput): Promise<Student>;
}

export class InMemoryStudentRepository implements StudentRepository {
  async findById(): Promise<Student | null> {
    return null;
  }

  async create(input: CreateStudentInput): Promise<Student> {
    const now = new Date().toISOString();

    return {
      id: randomUUID(),
      fullName: input.fullName,
      email: input.email,
      createdAt: now,
      updatedAt: now,
    };
  }

  async update(id: string, input: UpdateStudentInput): Promise<Student> {
    const now = new Date().toISOString();

    return {
      id,
      fullName: input.fullName ?? "",
      email: input.email ?? "",
      createdAt: now,
      updatedAt: now,
    };
  }
}
