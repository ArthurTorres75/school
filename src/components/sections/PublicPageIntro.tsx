import { cn } from "@/lib/utils";

interface PublicPageIntroProps {
  eyebrow: string;
  title: string;
  subtitle: string;
  detail: string;
  tone?: "primary" | "secondary" | "accent";
}

/**
 * On-brand hero for public subpages. Reuses the landing visual language
 * (panel + soft orb glow + display heading) so every public page reads as part
 * of the same system instead of a bare placeholder card.
 */
export function PublicPageIntro({
  eyebrow,
  title,
  subtitle,
  detail,
  tone = "primary",
}: PublicPageIntroProps) {
  return (
    <section className="landing-panel animate-fade-in-up relative overflow-hidden rounded-2xl border border-border/90 bg-card/95 p-7 shadow-sm sm:p-10 md:p-14">
      <div className="landing-orb landing-orb-primary opacity-20" aria-hidden />

      <div className="relative z-10 flex max-w-3xl flex-col gap-5">
        <span
          className={cn(
            "inline-flex w-fit items-center rounded-full border px-3 py-1 text-xs font-semibold uppercase tracking-wide",
            tone === "primary" && "border-primary/25 bg-primary/10 text-primary",
            tone === "secondary" && "border-secondary/35 bg-secondary/35 text-secondary-foreground",
            tone === "accent" && "border-accent/35 bg-accent/45 text-accent-foreground",
          )}
        >
          {eyebrow}
        </span>

        <h1 className="font-heading text-4xl font-semibold leading-tight tracking-tight text-balance sm:text-5xl">
          {title}
        </h1>

        <p className="max-w-2xl text-base leading-relaxed text-muted-foreground sm:text-lg">
          {subtitle}
        </p>

        <p className="max-w-2xl border-l-2 border-primary/40 pl-4 text-sm leading-6 text-foreground/80 sm:text-base">
          {detail}
        </p>
      </div>
    </section>
  );
}
