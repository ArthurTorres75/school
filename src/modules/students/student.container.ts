import { PrismaStudentRepository } from "@/modules/students/student.repository";
import { StudentService } from "@/modules/students/student.service";

const studentRepository = new PrismaStudentRepository();

export const studentService = new StudentService(studentRepository);
