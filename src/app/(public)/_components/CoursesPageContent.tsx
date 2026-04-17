"use client";

import { PublicPageIntro } from "@/components/sections/PublicPageIntro";
import { SITE_COPY } from "@/lib/site-copy";
import { useLanguage } from "@/providers/LanguageProvider";

export function CoursesPageContent() {
  const { language } = useLanguage();
  const copy = SITE_COPY[language].courses;

  return (
    <PublicPageIntro
      eyebrow={copy.eyebrow}
      title={copy.title}
      subtitle={copy.subtitle}
      detail={copy.detail}
      tone="primary"
    />
  );
}
