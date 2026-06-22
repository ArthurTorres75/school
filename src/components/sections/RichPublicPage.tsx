"use client";

import Link from "next/link";

import { PublicCardGrid } from "@/components/sections/PublicCardGrid";
import { PublicPageIntro } from "@/components/sections/PublicPageIntro";
import { Button } from "@/components/ui/button";
import type { RichPublicPageCopy } from "@/lib/site-copy";

interface RichPublicPageProps {
  copy: RichPublicPageCopy;
  /** Where the closing call-to-action links to (e.g. "/inscripciones"). */
  ctaHref: string;
  tone?: "primary" | "secondary" | "accent";
}

/**
 * Composes a public subpage from shared building blocks: on-brand hero, a card
 * grid section, and a closing gradient CTA. Keeps news/contact (and any future
 * public page) consistent and driven entirely by localized copy.
 */
export function RichPublicPage({ copy, ctaHref, tone = "primary" }: RichPublicPageProps) {
  return (
    <div className="space-y-8">
      <PublicPageIntro
        eyebrow={copy.eyebrow}
        title={copy.title}
        subtitle={copy.subtitle}
        detail={copy.detail}
        tone={tone}
      />

      <PublicCardGrid
        eyebrow={copy.sectionEyebrow}
        title={copy.sectionTitle}
        subtitle={copy.sectionSubtitle}
        cards={copy.cards}
      />

      <section className="landing-panel relative overflow-hidden rounded-2xl border border-border/90 bg-card/95 p-7 sm:p-9">
        <div className="landing-animated-gradient opacity-40" aria-hidden />
        <div className="relative z-10 flex flex-col items-start gap-4 sm:flex-row sm:items-center sm:justify-between">
          <div className="space-y-1">
            <h2 className="font-heading text-xl font-semibold tracking-tight sm:text-2xl">
              {copy.ctaTitle}
            </h2>
            <p className="max-w-xl text-sm leading-6 text-muted-foreground">{copy.ctaText}</p>
          </div>
          <Button asChild size="lg" className="shrink-0">
            <Link href={ctaHref}>{copy.ctaLabel}</Link>
          </Button>
        </div>
      </section>
    </div>
  );
}
