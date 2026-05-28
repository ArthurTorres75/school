"use client";

import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import Link from "next/link";
import { useEffect, useRef } from "react";
import {
  NavigationMenu,
  NavigationMenuItem,
  NavigationMenuLink,
  NavigationMenuList,
} from "@/components/ui/navigation-menu";
import { Button } from "@/components/ui/button";
import { SITE_COPY } from "@/lib/site-copy";
import { cn } from "@/lib/utils";
import { useLanguage } from "@/providers/LanguageProvider";
import { NotebookScene } from "./NotebookScene";

const SECTION_ID = {
  OFFERS: "ofrece",
  FLOW: "flujo",
  NOTEBOOK: "cuaderno",
  START: "empezar",
} as const;

export function RootPageContent() {
  const { language } = useLanguage();
  const copy = SITE_COPY[language].landing;
  const rootRef = useRef<HTMLDivElement>(null);
  const mosaicTiles = [
    {
      value: copy.stats[0]?.value,
      label: copy.stats[0]?.label,
    },
    {
      value: copy.stats[1]?.value,
      label: copy.stats[1]?.label,
    },
    {
      value: copy.stats[2]?.value,
      label: copy.stats[2]?.label,
    },
    {
      value: copy.offers[0]?.tag,
      label: copy.offers[0]?.title,
    },
    {
      value: copy.flowEyebrow,
      label: copy.flowTitle,
    },
  ];

  useEffect(() => {
    if (!rootRef.current) {
      return;
    }

    const reducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    if (reducedMotion) {
      return;
    }

    gsap.registerPlugin(ScrollTrigger);

    const ctx = gsap.context(() => {
      const revealElements = gsap.utils.toArray<HTMLElement>("[data-reveal]");

      revealElements.forEach((element) => {
        gsap.fromTo(
          element,
          { autoAlpha: 0, y: 28 },
          {
            autoAlpha: 1,
            y: 0,
            duration: 0.75,
            ease: "power2.out",
            scrollTrigger: {
              trigger: element,
              start: "top 84%",
              toggleActions: "play none none reverse",
            },
          },
        );
      });

      gsap.to(".landing-orb-primary", {
        y: -36,
        scrollTrigger: {
          trigger: rootRef.current,
          start: "top top",
          end: "bottom top",
          scrub: 1,
        },
      });

      gsap.to(".landing-orb-accent", {
        y: 28,
        scrollTrigger: {
          trigger: rootRef.current,
          start: "top top",
          end: "bottom top",
          scrub: 1,
        },
      });
    }, rootRef);

    return () => {
      ctx.revert();
    };
  }, []);

  return (
    <div ref={rootRef} className="relative flex flex-col gap-8 pb-14 sm:gap-10">
      <div className="pointer-events-none absolute inset-0 -z-10 overflow-hidden">
        <div className="landing-animated-gradient" />
        <div className="landing-noise-overlay" />
        <div className="landing-orb landing-orb-primary" />
        <div className="landing-orb landing-orb-accent" />
      </div>

      <section
        data-reveal
        className="landing-panel mx-auto flex w-full max-w-6xl flex-col gap-8 rounded-xl border border-border/90 bg-card px-6 py-10 shadow-sm sm:px-10 sm:py-12"
      >
        <NavigationMenu className="w-full justify-center rounded-lg border border-border bg-background/60 px-3 py-2 backdrop-blur-sm">
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

        <div className="grid gap-6 lg:grid-cols-[1.05fr_0.95fr] lg:items-center">
          <div className="flex flex-col gap-5">
            <header className="flex flex-col gap-4">
              <p className="inline-flex w-fit rounded-md border border-primary/30 bg-primary/8 px-2.5 py-1 text-xs font-semibold uppercase tracking-wide text-primary motion-safe:animate-fade-in-up">
                {copy.badge}
              </p>
              <h1 className="max-w-3xl text-balance text-4xl font-semibold tracking-tight sm:text-5xl lg:text-[3.5rem] motion-safe:animate-fade-in-up motion-safe:[animation-delay:120ms]">
                {copy.title}
              </h1>
              <p className="max-w-3xl text-pretty text-base leading-7 text-muted-foreground sm:text-lg motion-safe:animate-fade-in-up motion-safe:[animation-delay:220ms]">
                {copy.subtitle}
              </p>
            </header>

            <article className="rounded-lg border border-secondary/45 bg-secondary/35 p-5 text-sm leading-6 text-secondary-foreground sm:p-6 sm:text-base motion-safe:animate-fade-in-up motion-safe:[animation-delay:420ms]">
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
          </div>

          <div id={SECTION_ID.NOTEBOOK} className="rounded-lg border border-border bg-background/70 p-4 sm:p-5">
            <div className="h-64 overflow-hidden rounded-md border border-border bg-background sm:h-72 lg:h-80">
              <NotebookScene openProgress={0} />
            </div>
          </div>
        </div>

        <div className="grid gap-4 md:grid-cols-3 motion-safe:animate-fade-in-up motion-safe:[animation-delay:320ms]">
          {copy.stats.map((stat) => (
            <article key={stat.label} className="rounded-lg border border-border bg-card/60 p-4">
              <p className="tabular-nums text-lg font-semibold tracking-tight text-primary">{stat.value}</p>
              <p className="mt-1 text-sm text-muted-foreground">{stat.label}</p>
            </article>
          ))}
        </div>
      </section>

      <section
        data-reveal
        className="mx-auto flex w-full max-w-6xl flex-col gap-6 rounded-xl border border-border/90 bg-card px-6 py-8 shadow-sm sm:px-10 sm:py-10"
      >
        <header className="flex flex-col gap-2">
          <p className="text-xs font-semibold uppercase tracking-widest text-primary">{copy.offersEyebrow}</p>
          <h2 className="text-2xl font-semibold tracking-tight sm:text-3xl">{copy.offersTitle}</h2>
        </header>

        <div className="grid auto-rows-[104px] gap-3 sm:grid-cols-2 lg:grid-cols-4">
          {mosaicTiles.map((tile, index) => (
            <article
              key={`${tile.value}-${index}`}
              className={cn(
                "landing-mosaic-card rounded-xl border border-border bg-background/55 px-4 pt-4 pb-5",
                index === 0 && "sm:col-span-2",
                index === 3 && "lg:row-span-2 lg:min-h-46",
                index === 4 && "sm:col-span-2",
              )}
            >
              <p className="tabular-nums text-lg font-semibold tracking-tight text-primary">{tile.value}</p>
              <p className="mt-1 text-sm text-muted-foreground">{tile.label}</p>
            </article>
          ))}
        </div>
      </section>

      <section
        id={SECTION_ID.OFFERS}
        data-reveal
        className="mx-auto flex w-full max-w-6xl scroll-mt-24 flex-col gap-6 rounded-xl border border-border/90 bg-card px-6 py-10 shadow-sm sm:px-10 sm:py-12"
      >
        <header className="flex flex-col gap-2">
          <p className="text-xs font-semibold uppercase tracking-widest text-primary">{copy.offersEyebrow}</p>
          <h2 className="text-3xl font-semibold tracking-tight sm:text-4xl">{copy.offersTitle}</h2>
          <p className="mt-2 max-w-3xl text-base text-muted-foreground">{copy.offersSubtitle}</p>
        </header>

        <div className="grid gap-4 md:grid-cols-3">
          {copy.offers.map((offer) => (
            <article
              key={offer.title}
              className="landing-offer-card rounded-lg border border-border bg-background/45 p-5 transition-colors hover:bg-background/70"
            >
              <p className="inline-flex w-fit rounded-sm border border-primary/30 bg-primary/8 px-2.5 py-1 text-xs font-semibold text-primary">
                {offer.tag}
              </p>
              <h3 className="mt-4 text-base font-semibold tracking-tight">{offer.title}</h3>
              <p className="mt-3 text-sm text-muted-foreground">{offer.description}</p>
            </article>
          ))}
        </div>
      </section>

      <section
        id={SECTION_ID.FLOW}
        data-reveal
        className="mx-auto flex w-full max-w-6xl scroll-mt-24 flex-col gap-6 rounded-xl border border-accent/40 bg-accent/12 px-6 py-10 sm:px-10 sm:py-12"
      >
        <header className="flex flex-col gap-2">
          <p className="text-xs font-semibold uppercase tracking-widest text-accent-foreground">{copy.flowEyebrow}</p>
          <h2 className="text-3xl font-semibold tracking-tight sm:text-4xl">{copy.flowTitle}</h2>
          <p className="mt-2 max-w-3xl text-base text-muted-foreground">{copy.flowSubtitle}</p>
        </header>

        <div className="grid gap-4 md:grid-cols-3">
          {copy.flowSteps.map((step, index) => (
            <article key={step.title} className="rounded-lg border border-accent/30 bg-card/98 p-5">
              <p className="text-xs font-semibold tracking-widest text-primary">0{index + 1}</p>
              <h3 className="mt-3 text-base font-semibold tracking-tight">{step.title}</h3>
              <p className="mt-2 text-sm text-muted-foreground">{step.description}</p>
            </article>
          ))}
        </div>
      </section>

      <section
        id={SECTION_ID.START}
        data-reveal
        className="landing-panel mx-auto flex w-full max-w-6xl scroll-mt-24 flex-col gap-6 rounded-xl border border-border/90 bg-card px-6 py-10 text-center shadow-sm sm:px-10 sm:py-12"
      >
        <h2 className="text-3xl font-semibold tracking-tight sm:text-4xl">{copy.finalCtaTitle}</h2>
        <p className="mx-auto max-w-2xl text-base text-muted-foreground">{copy.finalCtaSubtitle}</p>

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
