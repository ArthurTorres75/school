import { DEFAULT_LANGUAGE } from "@/lib/i18n";
import { SITE_COPY } from "@/lib/site-copy";

export default function GradesPage() {
  const copy = SITE_COPY[DEFAULT_LANGUAGE].grades;

  return (
    <section className="mx-auto flex w-full max-w-4xl flex-col gap-6 rounded-3xl border border-primary/15 bg-card/95 p-6 shadow-xl shadow-primary/10 sm:p-8">
      <header className="space-y-2">
        <h1 className="text-3xl font-semibold tracking-tight">{copy.title}</h1>
        <p className="text-sm text-muted-foreground sm:text-base">{copy.subtitle}</p>
      </header>

      <article className="rounded-2xl border border-secondary/30 bg-secondary/28 p-5">
        <p className="text-sm text-foreground sm:text-base">{copy.detail}</p>
      </article>
    </section>
  );
}
