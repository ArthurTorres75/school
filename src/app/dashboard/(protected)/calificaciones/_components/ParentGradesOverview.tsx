"use client";

import Link from "next/link";
import { useSearchParams } from "next/navigation";
import { useQuery } from "@tanstack/react-query";

import { SITE_COPY } from "@/lib/site-copy";
import { useLanguage } from "@/providers/LanguageProvider";
import {
  STUDENT_GRADES_VIEWER_ROLE,
  type ParentChildGradesResult,
  type ParentChildOverviewItem,
  type StudentGradesViewerListResult,
} from "@/modules/students/student.types";
import type { ApiSuccessBody } from "@/modules/users/user.types";

interface ApiErrorBody {
  success: false;
  message: string;
  errorCode: string;
}

export function ParentGradesOverview() {
  const searchParams = useSearchParams();
  const { language } = useLanguage();
  const copy = SITE_COPY[language].grades;

  const childrenQuery = useQuery({
    queryKey: ["parent", "children"],
    queryFn: async () => {
      const response = await fetch("/api/students/parent-children");

      if (!response.ok) {
        const errorBody = (await response.json()) as ApiErrorBody;
        throw new Error(errorBody.message || copy.parentChildrenError);
      }

      const body = (await response.json()) as ApiSuccessBody<StudentGradesViewerListResult>;
      return body.data;
    },
  });

  const selectedFromQuery = searchParams.get("student") ?? "";
  const students = childrenQuery.data?.students ?? [];
  const actorRole = childrenQuery.data?.actorRole;
  const selectedStudentUserId = selectedFromQuery || students[0]?.studentUserId || "";

  const gradesQuery = useQuery({
    queryKey: ["parent", "child-grades", selectedStudentUserId],
    queryFn: async () => {
      const response = await fetch(`/api/students/parent-children/${selectedStudentUserId}/grades`);

      if (!response.ok) {
        const errorBody = (await response.json()) as ApiErrorBody;
        throw new Error(errorBody.message || copy.parentGradesError);
      }

      const body = (await response.json()) as ApiSuccessBody<ParentChildGradesResult>;
      return body.data;
    },
    enabled: selectedStudentUserId.length > 0,
  });

  const selectedChild = students.find((item) => item.studentUserId === selectedStudentUserId);
  const childrenTitle =
    actorRole === STUDENT_GRADES_VIEWER_ROLE.ADMIN
      ? copy.adminChildrenTitle
      : copy.parentChildrenTitle;
  const childrenSubtitle =
    actorRole === STUDENT_GRADES_VIEWER_ROLE.ADMIN
      ? copy.adminChildrenSubtitle
      : copy.parentChildrenSubtitle;

  return (
    <section className="grid gap-6 lg:grid-cols-[320px_1fr]">
      <article className="rounded-2xl border border-border/70 bg-background/70 p-5">
        <header className="space-y-1">
          <h2 className="text-lg font-semibold tracking-tight">{childrenTitle}</h2>
          <p className="text-sm text-muted-foreground">{childrenSubtitle}</p>
        </header>

        {childrenQuery.isLoading && <p className="mt-4 text-sm text-muted-foreground">{copy.parentChildrenLoading}</p>}

        {childrenQuery.isError && (
          <p className="mt-4 rounded-lg border border-destructive/30 bg-destructive/10 px-3 py-2 text-sm text-destructive">
            {(childrenQuery.error as Error).message || copy.parentChildrenError}
          </p>
        )}

        {!childrenQuery.isLoading && !childrenQuery.isError && students.length === 0 && (
          <p className="mt-4 text-sm text-muted-foreground">{copy.parentNoChildren}</p>
        )}

        <ul className="mt-4 flex flex-col gap-2">
          {students.map((child: ParentChildOverviewItem) => {
            const isSelected = child.studentUserId === selectedStudentUserId;
            const statusLabel = child.isInscribed
              ? copy.parentInscriptionStatusInscribed
              : copy.parentInscriptionStatusPending;

            return (
              <li key={child.studentUserId}>
                <Link
                  href={`/dashboard/calificaciones?student=${child.studentUserId}`}
                  className={[
                    "block rounded-xl border px-3 py-3 transition-colors",
                    isSelected
                      ? "border-primary/35 bg-primary/10"
                      : "border-border/60 bg-card/70 hover:border-primary/25 hover:bg-primary/6",
                  ].join(" ")}
                >
                  <p className="text-sm font-medium text-foreground">{child.fullName}</p>
                  <p className="text-xs text-muted-foreground">{child.email}</p>
                  <div className="mt-2 flex items-center justify-between">
                    <span className="text-xs text-primary">{copy.parentOpenGradesLabel}</span>
                    <span className="rounded-full border border-border/70 bg-background/80 px-2 py-0.5 text-[11px] text-foreground">
                      {statusLabel}
                    </span>
                  </div>
                </Link>
              </li>
            );
          })}
        </ul>
      </article>

      <article className="rounded-2xl border border-border/70 bg-background/70 p-5">
        {selectedChild && (
          <header className="mb-4 space-y-1">
            <p className="text-xs uppercase tracking-wide text-muted-foreground">{copy.parentSelectedChildLabel}</p>
            <h3 className="text-xl font-semibold tracking-tight text-foreground">{selectedChild.fullName}</h3>
            <p className="text-sm text-muted-foreground">{selectedChild.email}</p>
          </header>
        )}

        {gradesQuery.isLoading && selectedStudentUserId && (
          <p className="text-sm text-muted-foreground">{copy.parentGradesLoading}</p>
        )}

        {gradesQuery.isError && (
          <p className="rounded-lg border border-destructive/30 bg-destructive/10 px-3 py-2 text-sm text-destructive">
            {(gradesQuery.error as Error).message || copy.parentGradesError}
          </p>
        )}

        {gradesQuery.data && (
          <div className="space-y-4">
            <div className="rounded-xl border border-primary/25 bg-primary/8 px-3 py-2 text-sm text-primary">
              {copy.parentAverageLabel}:{" "}
              {gradesQuery.data.averagePercent === null ? "--" : `${gradesQuery.data.averagePercent.toFixed(1)}%`}
            </div>

            <div>
              <h4 className="mb-2 text-sm font-medium text-foreground">{copy.parentGradesListTitle}</h4>
              {gradesQuery.data.grades.length === 0 ? (
                <p className="text-sm text-muted-foreground">{copy.parentNoGrades}</p>
              ) : (
                <ul className="flex flex-col gap-2">
                  {gradesQuery.data.grades.map((grade) => (
                    <li
                      key={grade.id}
                      className="rounded-xl border border-border/70 bg-card/70 px-3 py-2"
                    >
                      <div className="flex items-center justify-between gap-3">
                        <p className="text-sm font-medium text-foreground">{grade.title}</p>
                        <p className="text-sm font-semibold text-primary">
                          {grade.value.toFixed(2)} / {grade.maxScore.toFixed(0)}
                        </p>
                      </div>
                      <p className="text-xs text-muted-foreground">
                        {grade.courseName} · {grade.category} · {new Date(grade.gradedAt).toLocaleDateString(language)}
                      </p>
                    </li>
                  ))}
                </ul>
              )}
            </div>
          </div>
        )}
      </article>
    </section>
  );
}
