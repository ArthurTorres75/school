import Link from "next/link";
import { redirect } from "next/navigation";

import { getServerSession } from "@/lib/auth";
import { DEFAULT_LANGUAGE } from "@/lib/i18n";
import { UI_COPY } from "@/lib/ui-copy";

export default async function DashboardPage() {
  const session = await getServerSession();

  if (!session) {
    redirect("/login");
  }

  const copy = UI_COPY[DEFAULT_LANGUAGE].dashboard;

  return (
    <main className="min-h-screen bg-background px-6 py-14 text-foreground sm:px-10">
      <section className="mx-auto flex w-full max-w-3xl flex-col gap-8 rounded-3xl border border-border bg-card p-8 shadow-xl">
        <header className="space-y-2">
          <h1 className="text-3xl font-semibold tracking-tight">{copy.title}</h1>
          <p className="text-sm text-muted-foreground">{copy.subtitle}</p>
        </header>

        <article className="rounded-2xl border border-border bg-muted/30 p-5">
          <p className="text-sm text-foreground">{copy.welcome(session.email, session.role)}</p>
        </article>

        <article className="rounded-2xl border border-border bg-background p-5">
          <h2 className="text-lg font-semibold">{copy.ctaTitle}</h2>
          <p className="mt-2 text-sm text-muted-foreground">{copy.ctaText}</p>
        </article>

        <div className="flex flex-wrap items-center gap-3">
          <Link
            href="/"
            className="inline-flex h-9 items-center rounded-4xl border border-border px-4 text-sm font-medium hover:bg-muted"
          >
            Home
          </Link>
          <form action="/api/auth/logout" method="post">
            <button
              type="submit"
              className="inline-flex h-9 items-center rounded-4xl bg-primary px-4 text-sm font-medium text-primary-foreground hover:bg-primary/90"
              aria-label={copy.logout}
            >
              {copy.logout}
            </button>
          </form>
        </div>
      </section>
    </main>
  );
}
