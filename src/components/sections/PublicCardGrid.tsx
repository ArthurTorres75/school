interface PublicCard {
  tag: string;
  title: string;
  description: string;
}

interface PublicCardGridProps {
  eyebrow: string;
  title: string;
  subtitle: string;
  cards: PublicCard[];
}

/**
 * Reusable content section for public subpages: a titled block followed by a
 * responsive grid of cards using the landing's hover-lift card treatment.
 */
export function PublicCardGrid({ eyebrow, title, subtitle, cards }: PublicCardGridProps) {
  return (
    <section className="space-y-6">
      <div className="space-y-2">
        <p className="text-xs font-semibold uppercase tracking-wide text-primary">{eyebrow}</p>
        <h2 className="font-heading text-2xl font-semibold tracking-tight sm:text-3xl">{title}</h2>
        <p className="max-w-2xl text-sm leading-6 text-muted-foreground sm:text-base">{subtitle}</p>
      </div>

      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
        {cards.map((card) => (
          <article
            key={card.title}
            className="landing-offer-card rounded-xl border border-border bg-card/95 p-5"
          >
            <span className="inline-flex w-fit items-center rounded-md border border-primary/25 bg-primary/10 px-2.5 py-1 text-xs font-semibold text-primary">
              {card.tag}
            </span>
            <h3 className="mt-3 font-heading text-lg font-semibold tracking-tight">{card.title}</h3>
            <p className="mt-2 text-sm leading-6 text-muted-foreground">{card.description}</p>
          </article>
        ))}
      </div>
    </section>
  );
}
