import Link from "next/link";

import { DEFAULT_LANGUAGE } from "@/lib/i18n";
import { UI_COPY } from "@/lib/ui-copy";
import { TopControlsHeader } from "@/components/shared/TopControlsHeader";
import { LanguageProvider } from "@/providers/LanguageProvider";

export default function RootPage() {
  const copy = UI_COPY[DEFAULT_LANGUAGE].landing;

  return (
    <LanguageProvider language={DEFAULT_LANGUAGE}>
      <main className="min-h-screen bg-linear-to-b from-background via-secondary/30 to-accent/18 px-4 py-6 text-foreground sm:px-6 sm:py-8">
        <div className="mx-auto w-full max-w-5xl space-y-6">
          <TopControlsHeader brandLabel="School" />

          <section className="mx-auto flex w-full max-w-4xl flex-col gap-8 rounded-3xl border border-primary/15 bg-card/95 p-6 shadow-xl shadow-primary/10 sm:p-8">
            <header className="space-y-3">
              <p className="inline-flex w-fit rounded-full border border-accent/35 bg-accent/45 px-3 py-1 text-xs font-medium uppercase tracking-wide text-accent-foreground">
                {copy.badge}
              </p>
              <h1 className="text-3xl font-semibold tracking-tight sm:text-4xl">{copy.title}</h1>
              <p className="text-sm text-muted-foreground sm:text-base">{copy.subtitle}</p>
            </header>

            <div className="flex flex-wrap items-center gap-3">
              <Link
                href="/login"
                className="inline-flex h-10 items-center rounded-4xl bg-primary px-5 text-sm font-medium text-primary-foreground hover:bg-primary/90"
              >
                {copy.login}
              </Link>
              <Link
                href="/register"
                className="inline-flex h-10 items-center rounded-4xl border border-secondary/40 bg-secondary/35 px-5 text-sm font-medium text-secondary-foreground hover:bg-secondary/55"
              >
                {copy.register}
              </Link>
              <Link
                href="/dashboard"
                className="inline-flex h-10 items-center rounded-4xl border border-primary/20 bg-primary/8 px-5 text-sm font-medium text-primary hover:bg-primary/14"
              >
                {copy.dashboard}
              </Link>
            </div>

            <div className="grid gap-4 sm:grid-cols-2">
              <article className="rounded-2xl border border-secondary/30 bg-secondary/28 p-5">
                <h2 className="text-base font-semibold">{copy.publicSectionTitle}</h2>
                <p className="mt-2 text-sm text-muted-foreground">{copy.publicSectionText}</p>
              </article>

              <article className="rounded-2xl border border-accent/30 bg-accent/22 p-5">
                <h2 className="text-base font-semibold">{copy.privateSectionTitle}</h2>
                <p className="mt-2 text-sm text-muted-foreground">{copy.privateSectionText}</p>
              </article>
            </div>
          </section>
        </div>
      </main>
    </LanguageProvider>
  );
}
