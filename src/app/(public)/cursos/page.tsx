import type { Metadata } from "next";

import { SITE_COPY } from "@/lib/site-copy";
import { DEFAULT_LANGUAGE } from "@/lib/i18n";
import { CoursesPageContent } from "../_components/CoursesPageContent";

export const metadata: Metadata = {
  title: SITE_COPY[DEFAULT_LANGUAGE].courses.title,
  description: SITE_COPY[DEFAULT_LANGUAGE].courses.subtitle,
};

export default function CoursesPage() {
  return <CoursesPageContent />;
}
