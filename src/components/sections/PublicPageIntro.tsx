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
    <section className="mx-auto flex w-full max-w-4xl flex-col gap-6 rounded-3xl border border-primary/15 bg-card/95 p-6 shadow-xl shadow-primary/10 sm:p-8">
      <div className="space-y-3">
        <p
          className={cn(
            "inline-flex w-fit rounded-full border px-3 py-1 text-xs font-medium uppercase tracking-wide",
            tone === "primary" && "border-primary/25 bg-primary/10 text-primary",
            tone === "secondary" && "border-secondary/35 bg-secondary/35 text-secondary-foreground",
            tone === "accent" && "border-accent/35 bg-accent/45 text-accent-foreground",
          )}
        >
          {eyebrow}
        </p>
        <h1 className="text-3xl font-semibold tracking-tight sm:text-4xl">{title}</h1>
        <p className="max-w-2xl text-sm text-muted-foreground sm:text-base">{subtitle}</p>
      </div>

      <article className="rounded-2xl border border-border bg-background/70 p-5">
        <p className="text-sm text-muted-foreground sm:text-base">{detail}</p>
      </article>
    </section>
  );
}
