"use client";

import { RichPublicPage } from "@/components/sections/RichPublicPage";
import { SITE_COPY } from "@/lib/site-copy";
import { useLanguage } from "@/providers/LanguageProvider";

export function NewsPageContent() {
  const { language } = useLanguage();

  return <RichPublicPage copy={SITE_COPY[language].news} ctaHref="/contacto" tone="secondary" />;
}
