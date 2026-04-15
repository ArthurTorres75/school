import { PreferencesPage } from "@/components/PreferencesPage";
import { LanguageProvider } from "@/providers/LanguageProvider";
import { DEFAULT_LANGUAGE } from "@/lib/i18n";

export default function RootPage() {
  return (
    <LanguageProvider language={DEFAULT_LANGUAGE}>
      <PreferencesPage />
    </LanguageProvider>
  );
}

