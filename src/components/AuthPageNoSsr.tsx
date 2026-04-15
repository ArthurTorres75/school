"use client";

import dynamic from "next/dynamic";

import { DEFAULT_LANGUAGE } from "@/lib/i18n";
import { LanguageProvider } from "@/providers/LanguageProvider";

type AuthMode = "login" | "register";

interface AuthPageNoSsrProps {
  initialMode?: AuthMode;
}

const AuthPageClient = dynamic(
  () => import("@/components/AuthPage").then((module) => module.AuthPage),
  {
    ssr: false,
    loading: () => (
      <div className="flex min-h-screen items-center justify-center bg-linear-to-b from-background via-secondary/30 to-accent/16 p-4">
        <div className="w-full max-w-md rounded-3xl border border-primary/15 bg-card/95 p-6 text-sm text-muted-foreground shadow-xl shadow-primary/10">
          Cargando autenticación...
        </div>
      </div>
    ),
  },
);

export function AuthPageNoSsr({ initialMode = "login" }: AuthPageNoSsrProps) {
  return (
    <LanguageProvider language={DEFAULT_LANGUAGE}>
      <AuthPageClient initialMode={initialMode} />
    </LanguageProvider>
  );
}
