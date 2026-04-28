"use client";

import Link from "next/link";
import {
  NavigationMenu,
  NavigationMenuItem,
  NavigationMenuLink,
  NavigationMenuList,
} from "@/components/ui/navigation-menu";
import { Button } from "@/components/ui/button";
import { SITE_COPY } from "@/lib/site-copy";
import { useLanguage } from "@/providers/LanguageProvider";

const SECTION_ID = {
  OFFERS: "ofrece",
  FLOW: "flujo",
  START: "empezar",
} as const;

export function RootPageContent() {
  const { language } = useLanguage();
  const copy = SITE_COPY[language].landing;

  return (
    <div className="relative flex flex-col gap-10 pb-12 sm:gap-14 sm:pb-16">
      <div className="pointer-events-none absolute inset-0 -z-10 overflow-hidden">
        <div className="landing-orb landing-orb-primary" />
        <div className="landing-orb landing-orb-accent" />
      </div>

      <section className="landing-panel mx-auto flex w-full max-w-5xl flex-col gap-8 rounded-4xl border border-primary/20 bg-card/92 px-6 py-8 shadow-xl shadow-primary/10 sm:px-10 sm:py-10">
        <NavigationMenu className="w-full justify-center rounded-full border border-border/70 bg-background/75 px-3 py-2 backdrop-blur-sm">
          <NavigationMenuList className="flex-wrap justify-center">
            <NavigationMenuItem>
              <NavigationMenuLink asChild>
                <Link href={`#${SECTION_ID.OFFERS}`}>{copy.offersEyebrow}</Link>
              </NavigationMenuLink>
            </NavigationMenuItem>
            <NavigationMenuItem>
              <NavigationMenuLink asChild>
                <Link href={`#${SECTION_ID.FLOW}`}>{copy.flowEyebrow}</Link>
              </NavigationMenuLink>
            </NavigationMenuItem>
            <NavigationMenuItem>
              <NavigationMenuLink asChild>
                <Link href="/auth">{copy.finalPrimaryCta}</Link>
              </NavigationMenuLink>
            </NavigationMenuItem>
          </NavigationMenuList>
        </NavigationMenu>

        <header className="flex flex-col gap-5">
          <p className="inline-flex w-fit rounded-full border border-accent/40 bg-accent/45 px-3 py-1 text-xs font-medium uppercase tracking-wide text-accent-foreground motion-safe:animate-fade-in-up">
            {copy.badge}
          </p>
          <h1 className="max-w-3xl text-balance text-3xl font-semibold tracking-tight sm:text-5xl md:text-6xl motion-safe:animate-fade-in-up motion-safe:[animation-delay:120ms]">
            {copy.title}
          </h1>
          <p className="max-w-3xl text-pretty text-sm text-muted-foreground sm:text-base md:text-lg motion-safe:animate-fade-in-up motion-safe:[animation-delay:220ms]">
            {copy.subtitle}
          </p>
        </header>

        <div className="grid gap-4 md:grid-cols-3 motion-safe:animate-fade-in-up motion-safe:[animation-delay:320ms]">
          {copy.stats.map((stat) => (
            <article key={stat.label} className="rounded-2xl border border-border/85 bg-background/70 p-4 backdrop-blur-sm">
              <p className="text-xl font-semibold tracking-tight text-primary">{stat.value}</p>
              <p className="text-sm text-muted-foreground">{stat.label}</p>
            </article>
          ))}
        </div>

        <article className="rounded-3xl border border-secondary/45 bg-secondary/30 p-5 text-sm text-secondary-foreground sm:p-6 sm:text-base motion-safe:animate-fade-in-up motion-safe:[animation-delay:420ms]">
          {copy.heroDetail}
        </article>

        <div className="flex flex-wrap items-center gap-3 motion-safe:animate-fade-in-up motion-safe:[animation-delay:520ms]">
          <Button asChild size="lg">
            <Link href="/cursos">{copy.primaryCta}</Link>
          </Button>
          <Button asChild size="lg" variant="secondary">
            <Link href="/noticias">{copy.secondaryCta}</Link>
          </Button>
          <Button asChild size="lg" variant="outline">
            <Link href="/dashboard">{copy.tertiaryCta}</Link>
          </Button>
        </div>
      </section>

      <section id={SECTION_ID.OFFERS} className="mx-auto flex w-full max-w-5xl scroll-mt-24 flex-col gap-6 rounded-4xl border border-border/80 bg-card/95 px-6 py-8 shadow-lg shadow-primary/5 sm:px-10 sm:py-10">
        <header className="flex flex-col gap-3">
          <p className="text-xs font-medium uppercase tracking-wide text-primary">{copy.offersEyebrow}</p>
          <h2 className="text-2xl font-semibold tracking-tight sm:text-4xl">{copy.offersTitle}</h2>
          <p className="max-w-3xl text-sm text-muted-foreground sm:text-base">{copy.offersSubtitle}</p>
        </header>

        <div className="grid gap-4 md:grid-cols-3">
          {copy.offers.map((offer) => (
            <article
              key={offer.title}
              className="landing-offer-card rounded-3xl border border-border/90 bg-background/80 p-5"
            >
              <p className="inline-flex w-fit rounded-full border border-primary/25 bg-primary/8 px-3 py-1 text-xs font-medium text-primary">
                {offer.tag}
              </p>
              <h3 className="mt-4 text-lg font-semibold tracking-tight">{offer.title}</h3>
              <p className="mt-3 text-sm text-muted-foreground">{offer.description}</p>
            </article>
          ))}
        </div>
      </section>

      <section id={SECTION_ID.FLOW} className="mx-auto flex w-full max-w-5xl scroll-mt-24 flex-col gap-6 rounded-4xl border border-accent/35 bg-accent/15 px-6 py-8 sm:px-10 sm:py-10">
        <header className="flex flex-col gap-3">
          <p className="text-xs font-medium uppercase tracking-wide text-accent-foreground">{copy.flowEyebrow}</p>
          <h2 className="text-2xl font-semibold tracking-tight sm:text-4xl">{copy.flowTitle}</h2>
          <p className="max-w-3xl text-sm text-muted-foreground sm:text-base">{copy.flowSubtitle}</p>
        </header>

        <div className="grid gap-4 md:grid-cols-3">
          {copy.flowSteps.map((step, index) => (
            <article key={step.title} className="rounded-3xl border border-accent/45 bg-card/85 p-5">
              <p className="text-xs font-semibold tracking-wide text-primary">0{index + 1}</p>
              <h3 className="mt-2 text-lg font-semibold tracking-tight">{step.title}</h3>
              <p className="mt-3 text-sm text-muted-foreground">{step.description}</p>
            </article>
          ))}
        </div>
      </section>

      <section
        id={SECTION_ID.START}
        className="landing-panel mx-auto flex w-full max-w-5xl scroll-mt-24 flex-col gap-5 rounded-4xl border border-primary/20 bg-card/95 px-6 py-8 text-center shadow-xl shadow-primary/10 sm:px-10 sm:py-10"
      >
        <h2 className="text-2xl font-semibold tracking-tight sm:text-4xl">{copy.finalCtaTitle}</h2>
        <p className="mx-auto max-w-3xl text-sm text-muted-foreground sm:text-base">{copy.finalCtaSubtitle}</p>

        <div className="flex flex-wrap items-center justify-center gap-3">
          <Button asChild size="lg">
            <Link href="/auth">{copy.finalPrimaryCta}</Link>
          </Button>
          <Button asChild size="lg" variant="outline">
            <Link href="/dashboard">{copy.finalSecondaryCta}</Link>
          </Button>
        </div>
      </section>
    </div>
  );
}
