import Link from "next/link";

import { DEFAULT_LANGUAGE } from "@/lib/i18n";
import { SITE_COPY } from "@/lib/site-copy";
import { getServerSession } from "@/lib/auth";
import { Button } from "@/components/ui/button";

export default async function DashboardHomePage() {
  const session = await getServerSession();
  const copy = SITE_COPY[DEFAULT_LANGUAGE].dashboard;
  const canInscribeStudents = session?.role === "admin" || session?.role === "parent";
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

  return (
    <section className="mx-auto flex w-full max-w-4xl flex-col gap-6 rounded-3xl border border-primary/15 bg-card/95 p-6 shadow-xl shadow-primary/10 sm:p-8">
      <header className="space-y-2">
        <h1 className="text-3xl font-semibold tracking-tight">{copy.title}</h1>
        <p className="text-sm text-muted-foreground sm:text-base">{copy.subtitle}</p>
      </header>

      <article className="rounded-2xl border border-secondary/30 bg-secondary/28 p-5">
        <p className="text-sm text-foreground sm:text-base">{copy.detail}</p>
      </article>

      <article className="rounded-2xl border border-primary/20 bg-primary/8 p-5">
        <p className="text-sm text-primary sm:text-base">
          Sesión activa para {session?.email ?? "usuario"} con rol {session?.role ?? "sin rol"}.
        </p>
      </article>

      <article className="rounded-2xl border border-border/70 bg-background/70 p-5">
        <header className="space-y-1">
          <h2 className="text-lg font-semibold tracking-tight text-foreground">{copy.roleActionsTitle}</h2>
          <p className="text-sm text-muted-foreground">{copy.roleActionsSubtitle}</p>
        </header>

        {roleActions.length > 0 ? (
          <ul className="mt-4 space-y-2">
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
          <div>
            <Button asChild aria-label={copy.inscriptionCtaLabel}>
              <Link href="/dashboard/inscripciones">{copy.inscriptionCtaLabel}</Link>
            </Button>
          </div>
        </article>
      )}
    </section>
  );
}
