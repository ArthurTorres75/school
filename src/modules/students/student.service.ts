import { InMemoryStudentRepository, type StudentRepository } from "@/modules/students/student.repository";
import { validateCreateStudentInput, validateUpdateStudentInput } from "@/modules/students/student.schema";
import type { CreateStudentInput, Student, UpdateStudentInput } from "@/modules/students/student.types";

export class StudentService {
  constructor(private readonly repository: StudentRepository = new InMemoryStudentRepository()) {}

  async createStudent(input: CreateStudentInput): Promise<Student> {
    const parsedInput = validateCreateStudentInput(input);
    return this.repository.create(parsedInput);
  }

  async updateStudent(id: string, input: UpdateStudentInput): Promise<Student> {
    const parsedInput = validateUpdateStudentInput(input);
    return this.repository.update(id, parsedInput);
  }

  async getStudentById(id: string): Promise<Student | null> {
    return this.repository.findById(id);
  }
}
