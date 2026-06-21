import { DEFAULT_LANGUAGE } from "@/lib/i18n";
import { SITE_COPY } from "@/lib/site-copy";
import { InternalManagementContent } from "@/app/dashboard/(protected)/gestion-interna/_components/InternalManagementContent";

export default function InternalManagementPage() {
  const copy = SITE_COPY[DEFAULT_LANGUAGE].management;

  return (
    <section className="landing-panel animate-fade-in-up relative overflow-hidden rounded-3xl border border-primary/15 bg-card/95 p-6 shadow-xl shadow-primary/10 sm:p-8">
      <div className="landing-orb landing-orb-primary opacity-20" aria-hidden />

      <div className="relative z-10 flex flex-col gap-6">
        <header className="space-y-2">
          <h1 className="font-heading text-3xl font-semibold tracking-tight sm:text-4xl">{copy.title}</h1>
          <p className="text-sm text-muted-foreground sm:text-base">{copy.subtitle}</p>
        </header>

        <article className="rounded-2xl border border-accent/30 bg-accent/22 p-5">
          <p className="text-sm text-foreground sm:text-base">{copy.detail}</p>
        </article>

        <InternalManagementContent />
      </div>
    </section>
  );
}
