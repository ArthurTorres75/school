"use client";

import { LANGUAGE } from "@/lib/i18n";
import { UI_COPY } from "@/lib/ui-copy";
import { useLanguage } from "@/providers/LanguageProvider";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

export function LanguageSwitcher() {
  const { language, setLanguage } = useLanguage();
  const copy = UI_COPY[language].preferences;

  return (
    <div className="flex items-center gap-2" aria-label={copy.languageTitle}>
      <span className="hidden text-xs font-medium text-muted-foreground sm:inline">{copy.languageTitle}</span>
      <Select
        value={language}
        onValueChange={(nextLanguage) => setLanguage(nextLanguage as typeof LANGUAGE.ES | typeof LANGUAGE.EN)}
      >
        <SelectTrigger size="sm" className="w-[122px]" aria-label={copy.languageTitle}>
          <SelectValue placeholder={copy.languageTitle} />
        </SelectTrigger>
        <SelectContent>
          <SelectItem value={LANGUAGE.ES}>{copy.spanish}</SelectItem>
          <SelectItem value={LANGUAGE.EN}>{copy.english}</SelectItem>
        </SelectContent>
      </Select>
    </div>
  );
}
