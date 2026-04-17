import type { Metadata } from "next";

import { SITE_COPY } from "@/lib/site-copy";
import { DEFAULT_LANGUAGE } from "@/lib/i18n";
import { ContactPageContent } from "../_components/ContactPageContent";

export const metadata: Metadata = {
  title: SITE_COPY[DEFAULT_LANGUAGE].contact.title,
  description: SITE_COPY[DEFAULT_LANGUAGE].contact.subtitle,
};

export default function ContactPage() {
  return <ContactPageContent />;
}
