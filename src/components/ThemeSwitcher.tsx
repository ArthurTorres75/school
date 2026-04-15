"use client";

import { THEME } from "@/lib/i18n";
import { UI_COPY } from "@/lib/ui-copy";
import { useLanguage } from "@/providers/LanguageProvider";
import { useTheme } from "@/providers/ThemeProvider";
import { Button } from "@/components/ui/button";

export function ThemeSwitcher() {
  const { language } = useLanguage();
  const { theme, setTheme } = useTheme();
  const copy = UI_COPY[language].preferences;

  const isLight = theme === THEME.LIGHT;
  const nextTheme = isLight ? THEME.DARK : THEME.LIGHT;
  const buttonLabel = isLight ? copy.dark : copy.light;

  return (
    <div className="flex items-center" aria-label={copy.themeTitle}>
      <Button
        type="button"
        variant="outline"
        size="icon-sm"
        onClick={() => setTheme(nextTheme)}
        aria-label={buttonLabel}
        title={buttonLabel}
      >
        {isLight ? (
          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" aria-hidden="true">
            <circle cx="12" cy="12" r="4" />
            <path d="M12 2v2" />
            <path d="M12 20v2" />
            <path d="m4.93 4.93 1.41 1.41" />
            <path d="m17.66 17.66 1.41 1.41" />
            <path d="M2 12h2" />
            <path d="M20 12h2" />
            <path d="m6.34 17.66-1.41 1.41" />
            <path d="m19.07 4.93-1.41 1.41" />
          </svg>
        ) : (
          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" aria-hidden="true">
            <path d="M12 3a7.5 7.5 0 1 0 9 9A9 9 0 1 1 12 3z" />
          </svg>
        )}
      </Button>
    </div>
  );
}
