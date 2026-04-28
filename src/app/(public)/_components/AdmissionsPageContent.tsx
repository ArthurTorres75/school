"use client";

import Link from "next/link";
import { useMemo, useState } from "react";
import { useMutation, useQuery } from "@tanstack/react-query";
import { useForm, useWatch } from "react-hook-form";

import { Button } from "@/components/ui/button";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { SITE_COPY } from "@/lib/site-copy";
import { useLanguage } from "@/providers/LanguageProvider";
import type { ApiSuccessBody } from "@/modules/users/user.types";

interface AuthSession {
  sub: string;
  email: string;
  role: "admin" | "teacher" | "parent" | "student";
}

interface OrganizationOption {
  id: string;
  name: string;
  slug: string;
}

interface InscriptionOptionItem {
  id: string;
  label: string;
}

interface InscriptionOptionsData {
  organizationId: string;
  organizationSlug: string;
  actorRole: "admin" | "parent";
  actorParentUserId?: string;
  students: InscriptionOptionItem[];
  parents: InscriptionOptionItem[];
  courses: InscriptionOptionItem[];
}

interface InscriptionPayload {
  studentUserId: string;
  organizationId: string;
  birthDate: string;
  gradeLevel: number;
  cedulaNumber: string;
  parentUserId?: string;
  enrollments: Array<{ courseId: string }>;
}

interface InscriptionFormValues {
  organizationSlug: string;
  studentUserId: string;
  parentUserId: string;
  birthDate: string;
  gradeLevel: number;
  cedulaNumber: string;
}

interface ApiErrorBody {
  success: false;
  message: string;
  errorCode: string;
}

export function AdmissionsPageContent() {
  const { language } = useLanguage();
  const copy = SITE_COPY[language].admissions;
  const formCopy = SITE_COPY[language].admissionsForm;
  const [submitMessage, setSubmitMessage] = useState<string>("");
  const [submitError, setSubmitError] = useState<boolean>(false);

  const form = useForm<InscriptionFormValues>({
    defaultValues: {
      organizationSlug: "",
      studentUserId: "",
      parentUserId: "",
      birthDate: "",
      gradeLevel: 1,
      cedulaNumber: "",
    },
  });

  const watchedOrganizationSlug = useWatch({
    control: form.control,
    name: "organizationSlug",
  });
  const organizationSlug = typeof watchedOrganizationSlug === "string" ? watchedOrganizationSlug : "";

  const watchedBirthDate = useWatch({
    control: form.control,
    name: "birthDate",
  });
  const birthDate = typeof watchedBirthDate === "string" ? watchedBirthDate : "";

  const watchedStudentUserId = useWatch({
    control: form.control,
    name: "studentUserId",
  });
  const selectedStudentUserId = typeof watchedStudentUserId === "string" ? watchedStudentUserId : "";

  const watchedParentUserId = useWatch({
    control: form.control,
    name: "parentUserId",
  });
  const selectedParentUserId = typeof watchedParentUserId === "string" ? watchedParentUserId : "";

  const age = useMemo(() => {
    if (!birthDate) {
      return "--";
    }

    const today = new Date();
    const birth = new Date(birthDate);

    if (Number.isNaN(birth.getTime())) {
      return "--";
    }

    let years = today.getFullYear() - birth.getFullYear();
    const monthDiff = today.getMonth() - birth.getMonth();

    if (monthDiff < 0 || (monthDiff === 0 && today.getDate() < birth.getDate())) {
      years -= 1;
    }

    return String(Math.max(years, 0));
  }, [birthDate]);

  const meQuery = useQuery({
    queryKey: ["auth:me"],
    queryFn: async () => {
      const response = await fetch("/api/auth/me");

      if (!response.ok) {
        return null;
      }

      const body = (await response.json()) as ApiSuccessBody<AuthSession>;
      return body.data;
    },
    retry: false,
  });

  const organizationsQuery = useQuery({
    queryKey: ["organizations:public"],
    queryFn: async () => {
      const response = await fetch("/api/organizations");

      if (!response.ok) {
        return [] as OrganizationOption[];
      }

      const body = (await response.json()) as ApiSuccessBody<OrganizationOption[]>;
      return body.data;
    },
    staleTime: 5 * 60 * 1000,
  });

  const optionsQuery = useQuery({
    queryKey: ["inscription:options", organizationSlug],
    queryFn: async () => {
      const response = await fetch(`/api/students/inscription-options?organizationSlug=${organizationSlug}`);

      if (!response.ok) {
        throw new Error((await response.json() as ApiErrorBody).message);
      }

      const body = (await response.json()) as ApiSuccessBody<InscriptionOptionsData>;
      return body.data;
    },
    enabled: organizationSlug.length > 0 && Boolean(meQuery.data),
    retry: false,
  });

  const selectedStudentLabel = useMemo(() => {
    if (!optionsQuery.data || !selectedStudentUserId) {
      return "--";
    }

    const selected = optionsQuery.data.students.find((item) => item.id === selectedStudentUserId);
    return selected?.label ?? "--";
  }, [optionsQuery.data, selectedStudentUserId]);

  const selectedParentLabel = useMemo(() => {
    if (!optionsQuery.data) {
      return "--";
    }

    if (optionsQuery.data.actorRole === "parent") {
      const actorParent = optionsQuery.data.parents.find((item) => item.id === optionsQuery.data.actorParentUserId);
      return actorParent?.label ?? "--";
    }

    if (!selectedParentUserId) {
      return "--";
    }

    const selected = optionsQuery.data.parents.find((item) => item.id === selectedParentUserId);
    return selected?.label ?? "--";
  }, [optionsQuery.data, selectedParentUserId]);

  const coursesCount = optionsQuery.data?.courses.length ?? 0;
  const isOptionsLoading = optionsQuery.isLoading;
  const coursesStatusLabel = optionsQuery.isLoading
    ? formCopy.coursesStateLoading
    : coursesCount > 0
      ? formCopy.coursesStateReady
      : formCopy.coursesStateEmpty;
  const coursesStatusClassName = optionsQuery.isLoading
    ? "border-secondary/40 bg-secondary/30 text-secondary-foreground"
    : coursesCount > 0
      ? "border-primary/30 bg-primary/15 text-primary"
      : "border-destructive/30 bg-destructive/10 text-destructive";
  const summaryMotionKey = `${organizationSlug}-${optionsQuery.dataUpdatedAt}-${optionsQuery.isFetching}`;

  const submitMutation = useMutation({
    mutationFn: async (payload: InscriptionPayload) => {
      const response = await fetch("/api/students/inscriptions", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(payload),
      });

      const body = (await response.json()) as ApiSuccessBody<unknown> | ApiErrorBody;

      if (!response.ok || body.success === false) {
        throw new Error(body.message);
      }

      return body;
    },
    onSuccess: () => {
      setSubmitMessage(formCopy.successLabel);
      setSubmitError(false);
      form.reset({
        organizationSlug,
        studentUserId: "",
        parentUserId: "",
        birthDate: "",
        gradeLevel: 1,
        cedulaNumber: "",
      });
      optionsQuery.refetch();
    },
    onError: (error) => {
      setSubmitMessage(error instanceof Error ? error.message : formCopy.genericErrorLabel);
      setSubmitError(true);
    },
  });

  const onSubmit = form.handleSubmit((values) => {
    const options = optionsQuery.data;

    if (!options || options.courses.length === 0) {
      setSubmitMessage(formCopy.emptyCourses);
      setSubmitError(true);
      return;
    }

    if (options.actorRole === "admin" && !values.parentUserId) {
      setSubmitMessage(formCopy.parentPlaceholder);
      setSubmitError(true);
      return;
    }

    const payload: InscriptionPayload = {
      studentUserId: values.studentUserId,
      organizationId: options.organizationId,
      birthDate: values.birthDate,
      gradeLevel: Number(values.gradeLevel),
      cedulaNumber: values.cedulaNumber,
      enrollments: options.courses.map((course) => ({ courseId: course.id })),
    };

    if (options.actorRole === "admin") {
      payload.parentUserId = values.parentUserId;
    }

    submitMutation.mutate(payload);
  });

  if (meQuery.isLoading) {
    return (
      <section className="rounded-3xl border border-primary/15 bg-card/90 p-8 shadow-xl shadow-primary/10">
        <p className="text-sm text-muted-foreground">{formCopy.loadingLabel}</p>
      </section>
    );
  }

  if (!meQuery.data) {
    return (
      <section className="rounded-3xl border border-primary/15 bg-card/90 p-8 shadow-xl shadow-primary/10">
        <p className="text-sm font-semibold uppercase tracking-wide text-primary">{copy.eyebrow}</p>
        <h1 className="mt-2 text-3xl font-semibold text-foreground">{formCopy.title}</h1>
        <p className="mt-3 max-w-xl text-sm text-muted-foreground">{formCopy.unauthorizedLabel}</p>
        <Link href="/auth" className="mt-6 inline-flex">
          <Button aria-label={formCopy.loginLabel}>{formCopy.loginLabel}</Button>
        </Link>
      </section>
    );
  }

  if (meQuery.data.role !== "admin" && meQuery.data.role !== "parent") {
    return (
      <section className="rounded-3xl border border-destructive/30 bg-destructive/8 p-8">
        <h1 className="text-2xl font-semibold text-foreground">{formCopy.title}</h1>
        <p className="mt-3 text-sm text-destructive">{formCopy.forbiddenLabel}</p>
      </section>
    );
  }

  return (
    <div className="relative overflow-hidden rounded-[2rem] border border-primary/20 bg-linear-to-br from-background via-secondary/25 to-accent/20 p-6 shadow-2xl shadow-primary/10 sm:p-8">
      <div className="pointer-events-none absolute -top-20 -right-20 size-56 rounded-full bg-primary/15 blur-3xl" />
      <div className="pointer-events-none absolute -bottom-24 -left-24 size-64 rounded-full bg-accent/20 blur-3xl" />

      <div className="relative z-10 flex flex-col gap-8">
          <section className="space-y-3">
            <p className="text-sm font-semibold uppercase tracking-[0.18em] text-primary/80">{copy.eyebrow}</p>
            <h1 className="text-3xl font-semibold text-foreground sm:text-4xl">{formCopy.title}</h1>
            <p className="max-w-2xl text-sm text-muted-foreground sm:text-base">{formCopy.subtitle}</p>
          </section>

          <form onSubmit={onSubmit} className="grid gap-5 lg:grid-cols-2">
            <section className="flex flex-col gap-4 rounded-3xl border border-border/80 bg-card/80 p-5">
              <label className="flex flex-col gap-2 text-sm text-foreground" aria-label={formCopy.organizationLabel}>
                <span className="font-medium">{formCopy.organizationLabel}</span>
                <Select
                  value={organizationSlug}
                  onValueChange={(value) => {
                    form.setValue("organizationSlug", value, { shouldValidate: true });
                    form.setValue("studentUserId", "");
                    form.setValue("parentUserId", "");
                  }}
                >
                  <SelectTrigger className="w-full" aria-label={formCopy.organizationLabel}>
                    <SelectValue placeholder={formCopy.organizationPlaceholder} />
                  </SelectTrigger>
                  <SelectContent>
                    {(organizationsQuery.data ?? []).map((organization) => (
                      <SelectItem key={organization.slug} value={organization.slug}>
                        {organization.name}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </label>

              <label className="flex flex-col gap-2 text-sm text-foreground" aria-label={formCopy.studentLabel}>
                <span className="font-medium">{formCopy.studentLabel}</span>
                {organizationSlug.length > 0 && isOptionsLoading ? (
                  <div
                    className="h-10 w-full animate-pulse rounded-2xl border border-border bg-secondary/40"
                    aria-hidden="true"
                  />
                ) : (
                  <Select
                    value={selectedStudentUserId}
                    onValueChange={(value) => form.setValue("studentUserId", value, { shouldValidate: true })}
                    disabled={!optionsQuery.data || optionsQuery.data.students.length === 0}
                  >
                    <SelectTrigger className="w-full" aria-label={formCopy.studentLabel}>
                      <SelectValue placeholder={formCopy.studentPlaceholder} />
                    </SelectTrigger>
                    <SelectContent>
                      {(optionsQuery.data?.students ?? []).map((student) => (
                        <SelectItem key={student.id} value={student.id}>
                          {student.label}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                )}
              </label>

              {meQuery.data.role === "admin" && (
                <label className="flex flex-col gap-2 text-sm text-foreground" aria-label={formCopy.parentLabel}>
                  <span className="font-medium">{formCopy.parentLabel}</span>
                  {organizationSlug.length > 0 && isOptionsLoading ? (
                    <div
                      className="h-10 w-full animate-pulse rounded-2xl border border-border bg-secondary/40"
                      aria-hidden="true"
                    />
                  ) : (
                    <Select
                      value={selectedParentUserId}
                      onValueChange={(value) => form.setValue("parentUserId", value, { shouldValidate: true })}
                    >
                      <SelectTrigger className="w-full" aria-label={formCopy.parentLabel}>
                        <SelectValue placeholder={formCopy.parentPlaceholder} />
                      </SelectTrigger>
                      <SelectContent>
                        {(optionsQuery.data?.parents ?? []).map((parent) => (
                          <SelectItem key={parent.id} value={parent.id}>
                            {parent.label}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  )}
                </label>
              )}
            </section>

            <section className="flex flex-col gap-4 rounded-3xl border border-border/80 bg-card/80 p-5">
              <label className="flex flex-col gap-2 text-sm text-foreground" aria-label={formCopy.birthDateLabel}>
                <span className="font-medium">{formCopy.birthDateLabel}</span>
                <input
                  type="date"
                  {...form.register("birthDate", { required: true })}
                  className="w-full rounded-2xl border border-input bg-background px-3 py-2 outline-none focus-visible:ring-2 focus-visible:ring-ring"
                  aria-label={formCopy.birthDateLabel}
                />
              </label>

              <label className="flex flex-col gap-2 text-sm text-foreground" aria-label={formCopy.cedulaLabel}>
                <span className="font-medium">{formCopy.cedulaLabel}</span>
                <input
                  type="text"
                  {...form.register("cedulaNumber", { required: true })}
                  className="w-full rounded-2xl border border-input bg-background px-3 py-2 uppercase outline-none focus-visible:ring-2 focus-visible:ring-ring"
                  aria-label={formCopy.cedulaLabel}
                />
              </label>

              <div className="grid gap-4 sm:grid-cols-2">
                <label className="flex flex-col gap-2 text-sm text-foreground" aria-label={formCopy.gradeLevelLabel}>
                  <span className="font-medium">{formCopy.gradeLevelLabel}</span>
                  <input
                    type="number"
                    min={1}
                    max={12}
                    {...form.register("gradeLevel", { valueAsNumber: true, min: 1, max: 12 })}
                    className="w-full rounded-2xl border border-input bg-background px-3 py-2 outline-none focus-visible:ring-2 focus-visible:ring-ring"
                    aria-label={formCopy.gradeLevelLabel}
                  />
                  <span className="text-xs text-muted-foreground">{formCopy.gradeHint}</span>
                </label>

                <div className="flex flex-col gap-2 text-sm text-foreground" aria-label={formCopy.ageLabel}>
                  <span className="font-medium">{formCopy.ageLabel}</span>
                  <div className="rounded-2xl border border-border bg-secondary/40 px-3 py-2 text-sm font-semibold text-foreground">
                    {age}
                  </div>
                </div>
              </div>
            </section>

            <section
              key={`courses-${summaryMotionKey}`}
              className="lg:col-span-2 rounded-3xl border border-primary/15 bg-primary/5 p-5 motion-safe:animate-in motion-safe:fade-in motion-safe:slide-in-from-bottom-2 motion-safe:duration-300"
            >
              <div className="flex flex-col gap-2">
                <div className="flex flex-wrap items-center gap-2">
                  <h2 className="text-sm font-semibold uppercase tracking-wide text-primary">{formCopy.coursesLabel}</h2>
                  <span
                    className={`rounded-full border px-2.5 py-1 text-xs font-semibold transition-all duration-300 ${coursesStatusClassName}`}
                  >
                    {coursesStatusLabel}
                  </span>
                  <span className="rounded-full border border-primary/20 bg-card px-2.5 py-1 text-xs font-semibold text-foreground transition-all duration-300">
                    {formCopy.coursesCountLabel}: {coursesCount}
                  </span>
                </div>
                <p className="text-sm text-muted-foreground">{formCopy.coursesAutoHint}</p>

                <div className="mt-3 flex flex-wrap gap-2">
                  {(optionsQuery.data?.courses ?? []).map((course) => (
                    <span
                      key={course.id}
                      className="rounded-full border border-primary/25 bg-card px-3 py-1 text-xs font-medium text-foreground"
                    >
                      {course.label}
                    </span>
                  ))}

                  {optionsQuery.data && optionsQuery.data.courses.length === 0 && (
                    <p className="text-sm text-destructive">{formCopy.emptyCourses}</p>
                  )}
                </div>
              </div>
            </section>

            <section
              key={`summary-${summaryMotionKey}`}
              className="lg:col-span-2 rounded-3xl border border-border/80 bg-card/80 p-5 motion-safe:animate-in motion-safe:fade-in motion-safe:slide-in-from-bottom-2 motion-safe:duration-300"
            >
              <div className="flex flex-col gap-3">
                <h2 className="text-sm font-semibold uppercase tracking-wide text-foreground">{formCopy.summaryTitle}</h2>

                <div className="grid gap-3 sm:grid-cols-3">
                  <div className="rounded-2xl border border-border bg-background/80 p-3 motion-safe:animate-in motion-safe:fade-in motion-safe:slide-in-from-bottom-1 motion-safe:duration-300">
                    <p className="text-xs font-semibold uppercase tracking-wide text-muted-foreground">
                      {formCopy.summaryStudent}
                    </p>
                    <p className="mt-1 text-sm font-medium text-foreground">{selectedStudentLabel}</p>
                  </div>

                  <div className="rounded-2xl border border-border bg-background/80 p-3 motion-safe:animate-in motion-safe:fade-in motion-safe:slide-in-from-bottom-1 motion-safe:duration-300 motion-safe:delay-75">
                    <p className="text-xs font-semibold uppercase tracking-wide text-muted-foreground">
                      {formCopy.summaryParent}
                    </p>
                    <p className="mt-1 text-sm font-medium text-foreground">{selectedParentLabel}</p>
                  </div>

                  <div className="rounded-2xl border border-border bg-background/80 p-3 motion-safe:animate-in motion-safe:fade-in motion-safe:slide-in-from-bottom-1 motion-safe:duration-300 motion-safe:delay-150">
                    <p className="text-xs font-semibold uppercase tracking-wide text-muted-foreground">
                      {formCopy.summaryCourses}
                    </p>
                    <p className="mt-1 text-sm font-medium text-foreground">{coursesCount}</p>
                  </div>
                </div>
              </div>
            </section>

            <div className="lg:col-span-2 flex flex-wrap items-center gap-3">
              <Button
                type="submit"
                disabled={submitMutation.isPending || optionsQuery.isLoading}
                aria-label={formCopy.submitLabel}
              >
                {submitMutation.isPending ? formCopy.loadingLabel : formCopy.submitLabel}
              </Button>

              {submitMessage && (
                <p
                  className={submitError ? "text-sm text-destructive" : "text-sm text-primary"}
                  role="status"
                >
                  {submitMessage}
                </p>
              )}
            </div>
          </form>
      </div>
    </div>
  );
}
