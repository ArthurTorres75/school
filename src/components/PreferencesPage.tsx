"use client";

import { useLanguage } from "@/providers/LanguageProvider";
import { useTheme } from "@/providers/ThemeProvider";
import { LanguageSwitcher } from "@/components/LanguageSwitcher";
import { ThemeSwitcher } from "@/components/ThemeSwitcher";
import { cn } from "@/lib/utils";
import { THEME } from "@/lib/i18n";

const copy = {
  es: {
    title: "Preferencias de la app",
    subtitle: "Elegí idioma y tema visual para tu experiencia.",
    previewTitle: "Vista previa",
    previewText:
      "Tu configuración queda guardada en este navegador para las próximas visitas.",
  },
  en: {
    title: "App preferences",
    subtitle: "Pick language and visual theme for your experience.",
    previewTitle: "Preview",
    previewText:
      "Your selection is saved in this browser for your next visits.",
  },
} as const;

export function PreferencesPage() {
  const { language } = useLanguage();
  const { theme } = useTheme();

  const t = copy[language];

  return (
    <main className="min-h-screen bg-linear-to-b from-background via-muted/40 to-background px-5 py-10 text-foreground sm:px-8 sm:py-16">
      <section className="mx-auto flex w-full max-w-3xl flex-col gap-8 rounded-3xl border border-border/80 bg-card/95 p-6 shadow-2xl shadow-black/5 backdrop-blur sm:p-8">
        <header className="space-y-2">
          <h1 className="text-3xl font-semibold tracking-tight sm:text-4xl">{t.title}</h1>
          <p className="text-sm text-muted-foreground sm:text-base">{t.subtitle}</p>
        </header>

        <div className="grid gap-5 sm:grid-cols-2">
          <article className="rounded-2xl border border-border bg-background/80 p-4">
            <LanguageSwitcher />
          </article>

          <article className="rounded-2xl border border-border bg-background/80 p-4">
            <ThemeSwitcher />
          </article>
        </div>

        <section
          className={cn(
            "rounded-2xl border border-border p-5 transition-colors",
            theme === THEME.DARK
              ? "bg-secondary text-secondary-foreground"
              : "bg-muted text-foreground"
          )}
        >
          <p className="text-sm font-medium">{t.previewTitle}</p>
          <p className="mt-2 text-sm text-muted-foreground">{t.previewText}</p>
        </section>
      </section>
    </main>
  );
}
