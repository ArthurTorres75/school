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
    <header className="flex flex-wrap items-center justify-between gap-3">
      <Link
        href={brandHref}
        className="inline-flex items-center rounded-full border border-primary/20 bg-primary/8 px-3 py-1 text-sm font-medium text-primary hover:bg-primary/12"
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
