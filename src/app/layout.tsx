import type { Metadata } from "next";
import { Geist, Geist_Mono, Figtree } from "next/font/google";
import "./globals.css";
import { cn } from "@/lib/utils";
import { ThemeScript } from "./ThemeScript";
import { DEFAULT_LANGUAGE } from "@/lib/i18n";
import { ThemeProvider } from "@/providers/ThemeProvider";

import { QueryClientProvider } from "@/providers/QueryClientProvider";

const figtree = Figtree({subsets:['latin'],variable:'--font-sans'});

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: {
    template: "%s | School",
    default: "School — Plataforma de Gestión Escolar",
  },
  description:
    "Plataforma web institucional para escuelas primarias. Información de cursos, inscripciones, noticias y acceso privado para alumnos, padres y docentes.",
  openGraph: {
    type: "website",
    siteName: "School",
    locale: "es_AR",
  },
  twitter: {
    card: "summary_large_image",
  },
  robots: {
    index: true,
    follow: true,
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang={DEFAULT_LANGUAGE}
      suppressHydrationWarning
      data-scroll-behavior="smooth"
      className={cn("font-sans", figtree.variable)}
    >
      <head suppressHydrationWarning>
        <ThemeScript />
      </head>
      <body
        suppressHydrationWarning
        className={`${geistSans.variable} ${geistMono.variable} antialiased`}
      >
        <ThemeProvider>
          <QueryClientProvider>{children}</QueryClientProvider>
        </ThemeProvider>
      </body>
    </html>
  );
}
