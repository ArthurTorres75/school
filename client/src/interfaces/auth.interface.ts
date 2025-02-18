export enum Role {
  ADMIN = "ADMIN",
  USER = "USER",
  TEACHER = "TEACHER",
  STUDENT = "STUDENT",
  PARENT = "PARENT",
  WORKER = "WORKER",
  DIRECTOR = "DIRECTOR",
  SECRETARY = "SECRETARY",
}

export interface SignUp {
  email: string;
  password: string;
  role: Role;
}
