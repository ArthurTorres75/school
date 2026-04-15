import Link from "next/link";

import { Button } from "@/components/ui/button";
import { DEFAULT_LANGUAGE } from "@/lib/i18n";
import { SITE_COPY } from "@/lib/site-copy";

export default function RootPage() {
  const copy = SITE_COPY[DEFAULT_LANGUAGE].landing;

  return (
    <section className="mx-auto flex w-full max-w-4xl flex-col gap-8 rounded-3xl border border-primary/15 bg-card/95 p-6 shadow-xl shadow-primary/10 sm:p-8">
      <header className="space-y-3">
        <p className="inline-flex w-fit rounded-full border border-accent/35 bg-accent/45 px-3 py-1 text-xs font-medium uppercase tracking-wide text-accent-foreground">
          {copy.badge}
        </p>
        <h1 className="text-3xl font-semibold tracking-tight sm:text-4xl">{copy.title}</h1>
        <p className="text-sm text-muted-foreground sm:text-base">{copy.subtitle}</p>
      </header>

      <div className="flex flex-wrap items-center gap-3">
        <Button asChild>
          <Link href="/cursos">{copy.primaryCta}</Link>
        </Button>
        <Button asChild variant="secondary">
          <Link href="/noticias">{copy.secondaryCta}</Link>
        </Button>
        <Button asChild variant="outline">
          <Link href="/dashboard">{copy.tertiaryCta}</Link>
        </Button>
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
  );
}
