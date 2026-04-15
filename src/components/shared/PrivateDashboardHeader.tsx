"use client";

import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { useState } from "react";

import { LanguageSwitcher } from "@/components/LanguageSwitcher";
import { ThemeSwitcher } from "@/components/ThemeSwitcher";
import { SITE_COPY } from "@/lib/site-copy";
import { useLanguage } from "@/providers/LanguageProvider";
import { cn } from "@/lib/utils";

export function PrivateDashboardHeader() {
  const pathname = usePathname();
  const router = useRouter();
  const { language } = useLanguage();
  const copy = SITE_COPY[language];
  const [isLoggingOut, setIsLoggingOut] = useState(false);

  const handleLogout = async () => {
    if (isLoggingOut) {
      return;
    }

    setIsLoggingOut(true);

    try {
      await fetch("/api/auth/logout", { method: "POST" });
    } finally {
      router.push("/");
      router.refresh();
      setIsLoggingOut(false);
    }
  };

  const navigationItems = [
    { href: "/dashboard", label: copy.privateNav.dashboard },
    { href: "/dashboard/calificaciones", label: copy.privateNav.grades },
    { href: "/dashboard/gestion-interna", label: copy.privateNav.management },
  ];

  return (
    <header className="flex flex-col gap-4 rounded-3xl border border-primary/15 bg-card/88 px-4 py-4 shadow-lg shadow-primary/8 backdrop-blur sm:px-5">
      <div className="flex flex-wrap items-center justify-between gap-3">
        <Link
          href="/dashboard"
          className="inline-flex items-center rounded-full border border-primary/20 bg-primary/8 px-3 py-1 text-sm font-medium text-primary hover:bg-primary/12"
        >
          {copy.brandLabel}
        </Link>

        <div className="flex items-center gap-2">
          <LanguageSwitcher />
          <ThemeSwitcher />
          <button
            type="button"
            onClick={handleLogout}
            disabled={isLoggingOut}
            className="inline-flex h-8 items-center rounded-full bg-primary px-3 text-sm font-medium text-primary-foreground hover:bg-primary/90 disabled:opacity-70"
            aria-label={copy.privateNav.logout}
          >
            {copy.privateNav.logout}
          </button>
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
