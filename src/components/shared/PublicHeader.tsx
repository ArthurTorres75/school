"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";

import { LanguageSwitcher } from "@/components/LanguageSwitcher";
import { ThemeSwitcher } from "@/components/ThemeSwitcher";
import { SITE_COPY } from "@/lib/site-copy";
import { useLanguage } from "@/providers/LanguageProvider";
import { cn } from "@/lib/utils";

export function PublicHeader() {
  const pathname = usePathname();
  const { language } = useLanguage();
  const copy = SITE_COPY[language];

  const navigationItems = [
    { href: "/", label: copy.publicNav.home },
    { href: "/cursos", label: copy.publicNav.courses },
    { href: "/noticias", label: copy.publicNav.news },
    { href: "/contacto", label: copy.publicNav.contact },
    { href: "/inscripciones", label: copy.publicNav.admissions },
  ];

  return (
    <header className="flex flex-col gap-4 rounded-3xl border border-primary/15 bg-card/85 px-4 py-4 shadow-lg shadow-primary/8 backdrop-blur sm:px-5">
      <div className="flex flex-wrap items-center justify-between gap-3">
        <Link
          href="/"
          className="inline-flex items-center rounded-full border border-primary/20 bg-primary/8 px-3 py-1 text-sm font-medium text-primary hover:bg-primary/12"
        >
          {copy.brandLabel}
        </Link>

        <div className="flex items-center gap-2">
          <LanguageSwitcher />
          <ThemeSwitcher />
        </div>
      </div>

      <nav className="flex flex-wrap items-center gap-2">
        {navigationItems.map((item) => {
          const isActive = pathname === item.href;

          return (
            <Link
              key={item.href}
              href={item.href}
              className={cn(
                "inline-flex h-9 items-center rounded-full border px-3 text-sm font-medium transition-colors",
                isActive
                  ? "border-primary/25 bg-primary/10 text-primary"
                  : "border-border bg-background/70 text-muted-foreground hover:bg-secondary/40 hover:text-foreground",
              )}
            >
              {item.label}
            </Link>
          );
        })}
      </nav>
    </header>
  );
}
