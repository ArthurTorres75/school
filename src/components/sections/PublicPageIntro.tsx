import { cn } from "@/lib/utils";

interface PublicPageIntroProps {
  eyebrow: string;
  title: string;
  subtitle: string;
  detail: string;
  tone?: "primary" | "secondary" | "accent";
}

export function PublicPageIntro({
  eyebrow,
  title,
  subtitle,
  detail,
  tone = "primary",
}: PublicPageIntroProps) {
  return (
    <section className="mx-auto flex w-full max-w-4xl flex-col gap-6 rounded-xl border border-border/90 bg-card/95 p-6 shadow-sm sm:p-8 md:p-10">
      <div className="space-y-2.5">
        <p
          className={cn(
            "inline-flex w-fit rounded-md border px-2.5 py-1 text-xs font-semibold uppercase tracking-wide",
            tone === "primary" && "border-primary/25 bg-primary/10 text-primary",
            tone === "secondary" && "border-secondary/35 bg-secondary/35 text-secondary-foreground",
            tone === "accent" && "border-accent/35 bg-accent/45 text-accent-foreground",
          )}
        >
          {eyebrow}
        </p>
        <h1 className="text-3xl font-semibold tracking-tight sm:text-4xl md:text-[2.75rem]">{title}</h1>
        <p className="max-w-2xl text-sm leading-6 text-muted-foreground sm:text-base">{subtitle}</p>
      </div>

      <article className="rounded-lg border border-border bg-background/80 p-5">
        <p className="text-sm leading-6 text-muted-foreground sm:text-base">{detail}</p>
      </article>
    </section>
  );
}
