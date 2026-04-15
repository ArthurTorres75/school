export const LANGUAGE = {
  ES: "es",
  EN: "en",
} as const;

export type Language = (typeof LANGUAGE)[keyof typeof LANGUAGE];

export const LANGUAGE_STORAGE_KEY = "school.language";
export const THEME_STORAGE_KEY = "school.theme";
export const DEFAULT_LANGUAGE = LANGUAGE.ES;

export function isLanguage(value: string | null): value is Language {
  return value === LANGUAGE.ES || value === LANGUAGE.EN;
}
