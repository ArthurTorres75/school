import type { Metadata } from "next";

import { SITE_COPY } from "@/lib/site-copy";
import { DEFAULT_LANGUAGE } from "@/lib/i18n";
import { NewsPageContent } from "../_components/NewsPageContent";

export const metadata: Metadata = {
  title: SITE_COPY[DEFAULT_LANGUAGE].news.title,
  description: SITE_COPY[DEFAULT_LANGUAGE].news.subtitle,
};

export default function NewsPage() {
  return <NewsPageContent />;
}
