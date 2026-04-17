import type { Metadata } from "next";

import { RootPageContent } from "./_components/RootPageContent";

export const metadata: Metadata = {
  title: {
    absolute: "School — Plataforma de Gestión Escolar",
  },
  description:
    "Plataforma web institucional para escuelas primarias. Inscripciones, cursos, noticias y sistema de gestión académica para alumnos, padres y docentes.",
};

export default function RootPage() {
  return <RootPageContent />;
}
