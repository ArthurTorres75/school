import Link from "next/link";

import { DEFAULT_LANGUAGE } from "@/lib/i18n";
import { SITE_COPY } from "@/lib/site-copy";
import { getServerSession } from "@/lib/auth";
import { Button } from "@/components/ui/button";

export default async function DashboardHomePage() {
  const session = await getServerSession();
  const copy = SITE_COPY[DEFAULT_LANGUAGE].dashboard;
  const canInscribeStudents = session?.role === "admin" || session?.role === "parent";
  const roleDisplayName =
    session?.role === "admin"
      ? copy.roleNameAdmin
      : session?.role === "parent"
        ? copy.roleNameParent
        : session?.role === "teacher"
          ? copy.roleNameTeacher
          : session?.role === "student"
            ? copy.roleNameStudent
            : copy.roleNameUnknown;

  const visibleModulesCount =
    session?.role === "admin" || session?.role === "parent" || session?.role === "teacher" ? 3 : 2;

  const enrollmentStatusLabel = canInscribeStudents ? "Habilitada" : "Restringida";
  const roleActions =
    session?.role === "admin"
      ? [
          { label: copy.roleActionsAdmin[0], href: "/dashboard/inscripciones" },
          { label: copy.roleActionsAdmin[1], href: "/dashboard/gestion-interna" },
          { label: copy.roleActionsAdmin[2], href: "/dashboard/calificaciones" },
        ]
      : session?.role === "parent"
        ? [
            { label: copy.roleActionsParent[0], href: "/dashboard/inscripciones" },
            { label: copy.roleActionsParent[1], href: "/dashboard/inscripciones" },
            { label: copy.roleActionsParent[2], href: "/dashboard/calificaciones" },
          ]
        : session?.role === "teacher"
          ? [
              { label: copy.roleActionsTeacher[0], href: "/dashboard/calificaciones" },
              { label: copy.roleActionsTeacher[1], href: "/dashboard/calificaciones" },
              { label: copy.roleActionsTeacher[2], href: "/dashboard/calificaciones" },
            ]
          : session?.role === "student"
            ? [
                { label: copy.roleActionsStudent[0], href: "/dashboard" },
                { label: copy.roleActionsStudent[1], href: "/noticias" },
                { label: copy.roleActionsStudent[2], href: "/dashboard" },
              ]
            : [];

        const kpiItems = [
          { value: String(roleActions.length), label: copy.kpiActionsLabel },
          { value: enrollmentStatusLabel, label: copy.kpiEnrollmentLabel },
          { value: String(visibleModulesCount), label: copy.kpiModulesLabel },
          { value: roleDisplayName, label: copy.kpiRoleLabel },
        ];

  return (
          <section className="mx-auto flex w-full max-w-5xl flex-col gap-6 rounded-3xl border border-primary/20 bg-card/96 p-6 shadow-xl shadow-primary/10 sm:p-8">
            <header className="space-y-4">
              <div className="inline-flex w-fit items-center rounded-full border border-primary/25 bg-primary/10 px-3 py-1 text-xs font-semibold tracking-wide text-primary">
                {copy.visualBadge}
              </div>
              <div className="space-y-2">
                <h1 className="text-3xl font-semibold tracking-tight sm:text-4xl">{copy.title}</h1>
                <p className="max-w-3xl text-sm text-muted-foreground sm:text-base">{copy.subtitle}</p>
              </div>
      </header>

            <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
              {kpiItems.map((item) => (
                <article
                  key={item.label}
                  className="rounded-2xl border border-border/70 bg-background/70 px-4 py-4 transition-colors hover:border-primary/30 hover:bg-primary/6"
                >
                  <p className="text-xs font-medium tracking-wide text-muted-foreground">{item.label}</p>
                  <p className="mt-2 text-xl font-semibold text-foreground sm:text-2xl">{item.value}</p>
                </article>
              ))}
            </div>

            <div className="grid gap-4 lg:grid-cols-[1.5fr_1fr]">
              <article className="rounded-2xl border border-secondary/35 bg-secondary/22 p-5">
                <header className="space-y-1">
                  <h2 className="text-lg font-semibold tracking-tight text-foreground">{copy.quickActionsTitle}</h2>
                  <p className="text-sm text-muted-foreground">{copy.quickActionsSubtitle}</p>
                </header>

                {roleActions.length > 0 ? (
                  <ul className="mt-4 space-y-2">
                    {roleActions.map((action) => (
                      <li key={`${action.href}-${action.label}`}>
                        <Link
                          href={action.href}
                          className="block rounded-xl border border-border/70 bg-background/80 px-3 py-3 text-sm text-foreground transition-colors hover:border-primary/45 hover:bg-primary/8"
                        >
                          {action.label}
                        </Link>
                      </li>
                    ))}
                  </ul>
                ) : (
                  <p className="mt-4 text-sm text-muted-foreground">{copy.roleActionsEmpty}</p>
                )}
              </article>

              <article className="flex flex-col gap-4 rounded-2xl border border-primary/25 bg-primary/7 p-5">
                <header className="space-y-1">
                  <h2 className="text-lg font-semibold tracking-tight text-foreground">{copy.sessionStatusTitle}</h2>
                  <p className="text-sm text-primary">{copy.sessionStatusActive}</p>
                </header>

                <dl className="space-y-3 text-sm">
                  <div className="rounded-xl border border-primary/20 bg-card/80 px-3 py-2">
                    <dt className="text-xs font-medium tracking-wide text-muted-foreground">{copy.sessionEmailLabel}</dt>
                    <dd className="mt-1 truncate font-medium text-foreground">{session?.email ?? "-"}</dd>
                  </div>
                  <div className="rounded-xl border border-primary/20 bg-card/80 px-3 py-2">
                    <dt className="text-xs font-medium tracking-wide text-muted-foreground">{copy.sessionRoleLabel}</dt>
                    <dd className="mt-1 font-medium text-foreground">{roleDisplayName}</dd>
                  </div>
                </dl>

                <div className="rounded-xl border border-border/70 bg-background/80 p-3">
                  <p className="text-xs font-medium tracking-wide text-muted-foreground">{copy.nextStepTitle}</p>
                  <p className="mt-1 text-sm text-foreground">{copy.nextStepHint}</p>
                </div>
              </article>
            </div>

      <article className="rounded-2xl border border-border/70 bg-background/70 p-5">
        <header className="space-y-1">
          <h2 className="text-lg font-semibold tracking-tight text-foreground">{copy.roleActionsTitle}</h2>
          <p className="text-sm text-muted-foreground">{copy.roleActionsSubtitle}</p>
        </header>

        {roleActions.length > 0 ? (
                <ul className="mt-4 grid gap-2 sm:grid-cols-2">
            {roleActions.map((action) => (
              <li key={`${action.href}-${action.label}`}>
                <Link
                  href={action.href}
                        className="block rounded-xl border border-border/60 bg-card/70 px-3 py-2 text-sm text-foreground transition-colors hover:border-primary/45 hover:bg-primary/8"
                >
                  {action.label}
                </Link>
              </li>
            ))}
          </ul>
        ) : (
          <p className="mt-4 text-sm text-muted-foreground">{copy.roleActionsEmpty}</p>
        )}
      </article>

      {canInscribeStudents && (
        <article className="flex flex-col gap-3 rounded-2xl border border-accent/35 bg-accent/12 p-5">
          <p className="text-sm text-foreground sm:text-base">{copy.inscriptionCtaHint}</p>
          <div className="flex flex-wrap items-center gap-2">
            <Button asChild aria-label={copy.inscriptionCtaLabel} size="lg">
              <Link href="/dashboard/inscripciones">{copy.inscriptionCtaLabel}</Link>
            </Button>
            <Button asChild aria-label={copy.roleActionsTitle} variant="outline" size="lg">
              <Link href="/dashboard/calificaciones">{copy.roleActionsTitle}</Link>
            </Button>
          </div>
        </article>
      )}

      <article className="rounded-2xl border border-secondary/30 bg-secondary/20 p-5">
        <p className="text-sm text-foreground sm:text-base">{copy.detail}</p>
      </article>
    </section>
  );
}
