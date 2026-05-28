"use client";

import Link from "next/link";

import { LanguageSwitcher } from "@/components/LanguageSwitcher";
import { ThemeSwitcher } from "@/components/ThemeSwitcher";

interface TopControlsHeaderProps {
  brandLabel: string;
  brandHref?: string;
}

export function TopControlsHeader({ brandLabel, brandHref = "/" }: TopControlsHeaderProps) {
  return (
    <header className="flex flex-wrap items-center justify-between gap-3 rounded-xl border border-border/90 bg-card/95 px-4 py-3 shadow-sm backdrop-blur-sm">
      <Link
        href={brandHref}
        className="inline-flex items-center rounded-md border border-primary/20 bg-primary/8 px-3 py-1.5 text-sm font-semibold tracking-tight text-primary transition-colors hover:bg-primary/12"
      >
        {brandLabel}
      </Link>

      <div className="flex items-center gap-2">
        <LanguageSwitcher />
        <ThemeSwitcher />
      </div>
    </header>
  );
}
