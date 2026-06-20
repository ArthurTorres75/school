import type { ReactNode } from "react";

import { TopControlsHeader } from "@/components/shared/TopControlsHeader";

interface AuthShellProps {
  brandLabel: string;
  title: string;
  subtitle: string;
  features: string[];
  children: ReactNode;
}

/**
 * Two-column auth layout: an immersive brand panel (desktop only) reusing the
 * landing visual language, and a form panel that hosts the controls header and
 * the auth card. All auth copy stays localized via the props passed in.
 */
export function AuthShell({ brandLabel, title, subtitle, features, children }: AuthShellProps) {
  return (
    <div className="grid min-h-screen lg:grid-cols-2">
      <aside className="landing-panel relative hidden flex-col justify-between overflow-hidden bg-secondary/40 p-10 lg:flex xl:p-14">
        <div className="landing-animated-gradient" aria-hidden />
        <div className="landing-orb landing-orb-primary" aria-hidden />
        <div className="landing-orb landing-orb-accent" aria-hidden />

        <div className="relative z-10 flex items-center gap-2.5">
          <span className="inline-flex h-9 w-9 items-center justify-center rounded-xl bg-primary/15 font-heading text-base font-bold text-primary">
            {brandLabel.charAt(0)}
          </span>
          <span className="font-heading text-lg font-semibold tracking-tight">{brandLabel}</span>
        </div>

        <div className="relative z-10 max-w-md space-y-6 animate-fade-in-up">
          <h2 className="font-heading text-3xl font-semibold leading-tight tracking-tight text-balance xl:text-4xl">
            {title}
          </h2>
          <p className="text-base leading-relaxed text-muted-foreground">{subtitle}</p>
          <ul className="space-y-3">
            {features.map((feature) => (
              <li key={feature} className="flex items-start gap-3 text-sm text-foreground/90">
                <span className="mt-0.5 inline-flex h-5 w-5 shrink-0 items-center justify-center rounded-full bg-primary/15 text-primary">
                  <svg
                    viewBox="0 0 16 16"
                    className="h-3 w-3"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth={2.5}
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    aria-hidden
                  >
                    <path d="m3 8 3.5 3.5L13 4.5" />
                  </svg>
                </span>
                <span>{feature}</span>
              </li>
            ))}
          </ul>
        </div>

        <p className="relative z-10 text-xs text-muted-foreground">
          © {new Date().getFullYear()} {brandLabel}
        </p>
      </aside>

      <main className="relative flex flex-col bg-background px-4 py-6 sm:px-6 sm:py-8">
        <div className="mx-auto w-full max-w-md">
          <TopControlsHeader brandLabel={brandLabel} brandClassName="lg:hidden" className="lg:justify-end" />
        </div>
        <div className="flex flex-1 items-center justify-center py-6">
          <div className="w-full max-w-md">{children}</div>
        </div>
      </main>
    </div>
  );
}
