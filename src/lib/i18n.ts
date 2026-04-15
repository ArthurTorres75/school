export const LANGUAGE = {
  ES: "es",
  EN: "en",
} as const;

export const THEME = {
  LIGHT: "light",
  DARK: "dark",
} as const;

export type Language = (typeof LANGUAGE)[keyof typeof LANGUAGE];
export type Theme = (typeof THEME)[keyof typeof THEME];

export const LANGUAGE_STORAGE_KEY = "school.language";
export const THEME_STORAGE_KEY = "school.theme";
export const THEME_CHANGE_EVENT = "school-theme-change";
export const DEFAULT_LANGUAGE = LANGUAGE.ES;

export function isLanguage(value: string | null): value is Language {
  return value === LANGUAGE.ES || value === LANGUAGE.EN;
}

export function isTheme(value: string | null): value is Theme {
  return value === THEME.LIGHT || value === THEME.DARK;
}
