import type { Metadata } from "next";

import { SITE_COPY } from "@/lib/site-copy";
import { DEFAULT_LANGUAGE } from "@/lib/i18n";
import { AdmissionsPageContent } from "@/app/(public)/_components/AdmissionsPageContent";

export const metadata: Metadata = {
  title: SITE_COPY[DEFAULT_LANGUAGE].admissions.title,
  description: SITE_COPY[DEFAULT_LANGUAGE].admissions.subtitle,
};

export default function ProtectedInscriptionsPage() {
  return <AdmissionsPageContent />;
}
