import type { ReactNode } from "react";
import { redirect } from "next/navigation";

import { PrivateDashboardHeader } from "@/components/shared/PrivateDashboardHeader";
import { getServerSession } from "@/lib/auth";
import { DEFAULT_LANGUAGE } from "@/lib/i18n";
import { LanguageProvider } from "@/providers/LanguageProvider";

interface ProtectedDashboardLayoutProps {
  children: ReactNode;
}

export default async function ProtectedDashboardLayout({ children }: ProtectedDashboardLayoutProps) {
  const session = await getServerSession();

  if (!session) {
    redirect("/login");
  }

  return (
    <LanguageProvider language={DEFAULT_LANGUAGE}>
      <main className="min-h-screen bg-linear-to-b from-background via-secondary/30 to-accent/16 px-4 py-6 text-foreground sm:px-6 sm:py-8">
        <div className="mx-auto w-full max-w-5xl space-y-6">
          <PrivateDashboardHeader />
          {children}
        </div>
      </main>
    </LanguageProvider>
  );
}
