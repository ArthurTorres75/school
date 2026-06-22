"use client";

import Link from "next/link";

import { LanguageSwitcher } from "@/components/LanguageSwitcher";
import { ThemeSwitcher } from "@/components/ThemeSwitcher";
import { cn } from "@/lib/utils";

interface TopControlsHeaderProps {
  brandLabel: string;
  brandHref?: string;
  /** Extra classes for the brand link, e.g. "lg:hidden" to avoid duplicating
   *  a brand already shown elsewhere on wide layouts. */
  brandClassName?: string;
  /** Extra classes for the header element, e.g. "lg:justify-end". */
  className?: string;
}

export function TopControlsHeader({ brandLabel, brandHref = "/", brandClassName, className }: TopControlsHeaderProps) {
  return (
    <header
      className={cn(
        "flex flex-wrap items-center justify-between gap-3 rounded-xl border border-border/90 bg-card/95 px-4 py-3 shadow-sm backdrop-blur-sm",
        className,
      )}
    >
      <Link
        href={brandHref}
        className={cn(
          "inline-flex items-center rounded-md border border-primary/20 bg-primary/8 px-3 py-1.5 text-sm font-semibold tracking-tight text-primary transition-colors hover:bg-primary/12",
          brandClassName,
        )}
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
