import { PublicPageIntro } from "@/components/sections/PublicPageIntro";
import { DEFAULT_LANGUAGE } from "@/lib/i18n";
import { SITE_COPY } from "@/lib/site-copy";

export default function ContactPage() {
  const copy = SITE_COPY[DEFAULT_LANGUAGE].contact;

  return (
    <PublicPageIntro
      eyebrow={copy.eyebrow}
      title={copy.title}
      subtitle={copy.subtitle}
      detail={copy.detail}
      tone="accent"
    />
  );
}
