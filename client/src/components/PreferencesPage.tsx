"use client";

import { useEffect, useState } from "react";
import { useLanguage } from "@/providers/LanguageProvider";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import { LANGUAGE, THEME_STORAGE_KEY, type Language } from "@/lib/i18n";

const THEME = {
  LIGHT: "light",
  DARK: "dark",
} as const;

type Theme = (typeof THEME)[keyof typeof THEME];

const copy = {
  es: {
    title: "Preferencias de la app",
    subtitle: "Elegi idioma y tema visual para tu experiencia.",
    languageTitle: "Idioma",
    themeTitle: "Tema",
    spanish: "Español",
    english: "Inglés",
    light: "Claro",
    dark: "Oscuro",
    previewTitle: "Vista previa",
    previewText:
      "Tu configuración queda guardada en este navegador para las próximas visitas.",
  },
  en: {
    title: "App preferences",
    subtitle: "Pick language and visual theme for your experience.",
    languageTitle: "Language",
    themeTitle: "Theme",
    spanish: "Spanish",
    english: "English",
    light: "Light",
    dark: "Dark",
    previewTitle: "Preview",
    previewText:
      "Your selection is saved in this browser for your next visits.",
  },
} as const;

function isTheme(value: string | null): value is Theme {
  return value === THEME.LIGHT || value === THEME.DARK;
}

export function PreferencesPage() {
  const { language: currentLanguage, setLanguage } = useLanguage();
  const [theme, setTheme] = useState<Theme>(() => {
    if (typeof window === "undefined") {
      return THEME.LIGHT;
    }

    const savedTheme = localStorage.getItem(THEME_STORAGE_KEY);
    if (isTheme(savedTheme)) {
      return savedTheme;
    }

    const prefersDark = window.matchMedia("(prefers-color-scheme: dark)").matches;
    return prefersDark ? THEME.DARK : THEME.LIGHT;
  });

  useEffect(() => {
    localStorage.setItem(THEME_STORAGE_KEY, theme);
    document.documentElement.classList.toggle("dark", theme === THEME.DARK);
  }, [theme]);

  const handleLanguageChange = (newLanguage: Language) => {
    setLanguage(newLanguage);
  };

  const t = copy[currentLanguage];

  return (
    <main className="min-h-screen bg-linear-to-b from-background via-muted/40 to-background px-5 py-10 text-foreground sm:px-8 sm:py-16">
      <section className="mx-auto flex w-full max-w-3xl flex-col gap-8 rounded-3xl border border-border/80 bg-card/95 p-6 shadow-2xl shadow-black/5 backdrop-blur sm:p-8">
        <header className="space-y-2">
          <h1 className="text-3xl font-semibold tracking-tight sm:text-4xl">{t.title}</h1>
          <p className="text-sm text-muted-foreground sm:text-base">{t.subtitle}</p>
        </header>

        <div className="grid gap-5 sm:grid-cols-2">
          <article className="rounded-2xl border border-border bg-background/80 p-4">
            <h2 className="mb-3 text-sm font-medium text-muted-foreground">{t.languageTitle}</h2>
            <div className="flex gap-2">
              <Button
                className="flex-1"
                variant={currentLanguage === LANGUAGE.ES ? "default" : "outline"}
                onClick={() => handleLanguageChange(LANGUAGE.ES)}
              >
                {t.spanish}
              </Button>
              <Button
                className="flex-1"
                variant={currentLanguage === LANGUAGE.EN ? "default" : "outline"}
                onClick={() => handleLanguageChange(LANGUAGE.EN)}
              >
                {t.english}
              </Button>
            </div>
          </article>

          <article className="rounded-2xl border border-border bg-background/80 p-4">
            <h2 className="mb-3 text-sm font-medium text-muted-foreground">{t.themeTitle}</h2>
            <div className="flex gap-2">
              <Button
                className="flex-1"
                variant={theme === THEME.LIGHT ? "default" : "outline"}
                onClick={() => setTheme(THEME.LIGHT)}
              >
                {t.light}
              </Button>
              <Button
                className="flex-1"
                variant={theme === THEME.DARK ? "default" : "outline"}
                onClick={() => setTheme(THEME.DARK)}
              >
                {t.dark}
              </Button>
            </div>
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
