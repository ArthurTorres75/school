export interface Student {
  id: string;
  fullName: string;
  email: string;
  createdAt: string;
  updatedAt: string;
}

export interface CreateStudentInput {
  fullName: string;
  email: string;
}

export interface UpdateStudentInput {
  fullName?: string;
  email?: string;
}
