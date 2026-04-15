import type { Metadata } from "next";

import { PublicPageIntro } from "@/components/sections/PublicPageIntro";
import { DEFAULT_LANGUAGE } from "@/lib/i18n";
import { SITE_COPY } from "@/lib/site-copy";

export const metadata: Metadata = {
  title: SITE_COPY[DEFAULT_LANGUAGE].courses.title,
  description: SITE_COPY[DEFAULT_LANGUAGE].courses.subtitle,
};

export default function CoursesPage() {
  const copy = SITE_COPY[DEFAULT_LANGUAGE].courses;

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
