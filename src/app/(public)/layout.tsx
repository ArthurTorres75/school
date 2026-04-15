import type { ReactNode } from "react";

import { PublicHeader } from "@/components/shared/PublicHeader";
import { DEFAULT_LANGUAGE } from "@/lib/i18n";
import { LanguageProvider } from "@/providers/LanguageProvider";

interface PublicLayoutProps {
  children: ReactNode;
}

export default function PublicLayout({ children }: PublicLayoutProps) {
  return (
    <LanguageProvider language={DEFAULT_LANGUAGE}>
      <main className="min-h-screen bg-linear-to-b from-background via-secondary/30 to-accent/18 px-4 py-6 text-foreground sm:px-6 sm:py-8">
        <div className="mx-auto w-full max-w-5xl space-y-6">
          <PublicHeader />
          {children}
        </div>
      </main>
    </LanguageProvider>
  );
}
