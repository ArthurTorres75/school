import type { Metadata } from "next";

import { PublicPageIntro } from "@/components/sections/PublicPageIntro";
import { DEFAULT_LANGUAGE } from "@/lib/i18n";
import { SITE_COPY } from "@/lib/site-copy";

export const metadata: Metadata = {
  title: SITE_COPY[DEFAULT_LANGUAGE].news.title,
  description: SITE_COPY[DEFAULT_LANGUAGE].news.subtitle,
};

export default function NewsPage() {
  const copy = SITE_COPY[DEFAULT_LANGUAGE].news;

  return (
    <PublicPageIntro
      eyebrow={copy.eyebrow}
      title={copy.title}
      subtitle={copy.subtitle}
      detail={copy.detail}
      tone="secondary"
    />
  );
}
