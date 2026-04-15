import { LanguageProvider } from "@/providers/LanguageProvider";
import { LANGUAGE, isLanguage } from "@/lib/i18n";
import { notFound } from "next/navigation";

interface MarkdownLayoutProps {
  children: React.ReactNode;
  params: Promise<{ lang: string }>;
}

export async function generateStaticParams() {
  return [{ lang: LANGUAGE.ES }, { lang: LANGUAGE.EN }];
}

export default async function LanguageLayout({ children, params }: MarkdownLayoutProps) {
  const { lang } = await params;

  if (!isLanguage(lang)) {
    notFound();
  }

  return (
    <LanguageProvider language={lang}>
      <div lang={lang}>{children}</div>
    </LanguageProvider>
  );
}
