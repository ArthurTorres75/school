export interface Student {
  id: string;
  fullName: string;
  email: string;
  createdAt: string;
  updatedAt: string;
}

export const STUDENT_INSCRIPTION_ACTOR_ROLE = {
  ADMIN: "admin",
  PARENT: "parent",
} as const;

export type StudentInscriptionActorRole =
  (typeof STUDENT_INSCRIPTION_ACTOR_ROLE)[keyof typeof STUDENT_INSCRIPTION_ACTOR_ROLE];

export const STUDENT_INSCRIPTION_STATUS = {
  ACTIVE: "active",
  COMPLETED: "completed",
  CANCELLED: "cancelled",
} as const;

export type StudentInscriptionStatus =
  (typeof STUDENT_INSCRIPTION_STATUS)[keyof typeof STUDENT_INSCRIPTION_STATUS];

export interface StudentInscriptionActor {
  userId: string;
  role: StudentInscriptionActorRole;
}

export interface AssignEnrollmentInput {
  courseId: string;
}

export interface CreateStudentInscriptionInput {
  studentUserId: string;
  organizationId: string;
  birthDate: string;
  gradeLevel: number;
  cedulaNumber: string;
  parentUserId?: string;
  enrollments: AssignEnrollmentInput[];
}

export interface CreateStudentInscriptionValidatedInput {
  studentUserId: string;
  organizationId: string;
  birthDate: Date;
  gradeLevel: number;
  cedulaNumber: string;
  parentUserId?: string;
  enrollments: AssignEnrollmentInput[];
}

export interface CreateStudentInscriptionPersistenceInput {
  studentId: string;
  parentId: string;
  organizationId: string;
  birthDate: Date;
  gradeLevel: number;
  cedulaNumber: string;
  enrollments: AssignEnrollmentInput[];
}

export interface StudentProfileForInscription {
  studentId: string;
  userId: string;
  userRole: string;
  userEmail: string;
  registeredParentEmail?: string;
  organizationId: string;
}

export interface ParentProfileForInscription {
  parentId: string;
  userId: string;
  userEmail: string;
  organizationId: string;
}

export interface StudentInscription {
  id: string;
  studentId: string;
  parentId: string;
  organizationId: string;
  gradeLevel: number;
  birthDate: string;
  cedulaNumber: string;
  status: StudentInscriptionStatus;
  createdAt: string;
  updatedAt: string;
}

export interface StudentInscriptionResult {
  inscription: StudentInscription;
  enrollmentIds: string[];
}

export interface ParentChildOverviewItem {
  studentId: string;
  studentUserId: string;
  fullName: string;
  email: string;
  organizationId: string;
  isInscribed: boolean;
  inscriptionStatus?: StudentInscriptionStatus;
}

export interface ParentChildGradeItem {
  id: string;
  courseName: string;
  category: string;
  title: string;
  value: number;
  maxScore: number;
  gradedAt: string;
}

export interface ParentChildGradesResult {
  child: ParentChildOverviewItem;
  grades: ParentChildGradeItem[];
  averagePercent: number | null;
}

export const STUDENT_GRADES_VIEWER_ROLE = {
  ADMIN: "admin",
  PARENT: "parent",
} as const;

export type StudentGradesViewerRole =
  (typeof STUDENT_GRADES_VIEWER_ROLE)[keyof typeof STUDENT_GRADES_VIEWER_ROLE];

export interface StudentGradesViewer {
  userId: string;
  role: StudentGradesViewerRole;
}

export interface StudentGradesViewerListResult {
  actorRole: StudentGradesViewerRole;
  students: ParentChildOverviewItem[];
}

export interface StudentInscriptionRepositoryContract {
  createInscriptionWithEnrollments(input: CreateStudentInscriptionPersistenceInput): Promise<StudentInscriptionResult>;
}

export interface CreateStudentInput {
  fullName: string;
  email: string;
}

export interface UpdateStudentInput {
  fullName?: string;
  email?: string;
}
