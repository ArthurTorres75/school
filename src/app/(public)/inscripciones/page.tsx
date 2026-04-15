import { PublicPageIntro } from "@/components/sections/PublicPageIntro";
import { DEFAULT_LANGUAGE } from "@/lib/i18n";
import { SITE_COPY } from "@/lib/site-copy";

export default function AdmissionsPage() {
  const copy = SITE_COPY[DEFAULT_LANGUAGE].admissions;

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
