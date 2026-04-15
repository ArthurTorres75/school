import { LANGUAGE, type Language } from "@/lib/i18n";

interface NavigationCopy {
  home: string;
  courses: string;
  news: string;
  contact: string;
  admissions: string;
}

interface PrivateNavigationCopy {
  dashboard: string;
  grades: string;
  management: string;
  logout: string;
}

interface LandingPageCopy {
  badge: string;
  title: string;
  subtitle: string;
  primaryCta: string;
  secondaryCta: string;
  tertiaryCta: string;
  publicSectionTitle: string;
  publicSectionText: string;
  privateSectionTitle: string;
  privateSectionText: string;
}

interface PublicPageCopy {
  eyebrow: string;
  title: string;
  subtitle: string;
  detail: string;
}

interface PrivatePageCopy {
  title: string;
  subtitle: string;
  detail: string;
}

interface SiteCopy {
  brandLabel: string;
  publicNav: NavigationCopy;
  privateNav: PrivateNavigationCopy;
  landing: LandingPageCopy;
  courses: PublicPageCopy;
  news: PublicPageCopy;
  contact: PublicPageCopy;
  admissions: PublicPageCopy;
  dashboard: PrivatePageCopy;
  grades: PrivatePageCopy;
  management: PrivatePageCopy;
}

export const SITE_COPY: Record<Language, SiteCopy> = {
  [LANGUAGE.ES]: {
    brandLabel: "School",
    publicNav: {
      home: "Inicio",
      courses: "Cursos",
      news: "Noticias",
      contact: "Contacto",
      admissions: "Inscripciones",
    },
    privateNav: {
      dashboard: "Dashboard",
      grades: "Calificaciones",
      management: "Gestión interna",
      logout: "Cerrar sesión",
    },
    landing: {
      badge: "School SaaS",
      title: "Dos mundos claros: experiencia pública y sistema privado",
      subtitle:
        "La app ya puede crecer con una capa pública orientada a marketing e información, y una capa privada para operación escolar y seguimiento académico.",
      primaryCta: "Explorar cursos",
      secondaryCta: "Ver noticias",
      tertiaryCta: "Ingresar al sistema",
      publicSectionTitle: "Mundo público",
      publicSectionText: "Landing, cursos, noticias, contacto e inscripciones para captar, informar y convertir.",
      privateSectionTitle: "Mundo privado",
      privateSectionText: "Dashboard, calificaciones y gestión interna para operar el colegio con acceso protegido.",
    },
    courses: {
      eyebrow: "Oferta académica",
      title: "Cursos y programas",
      subtitle: "Presentá niveles, propuestas y beneficios con foco comercial e institucional.",
      detail: "Este espacio sirve para mostrar la propuesta educativa, diferenciales y llamados a inscripción.",
    },
    news: {
      eyebrow: "Novedades",
      title: "Noticias y comunicados",
      subtitle: "Publicá eventos, anuncios y novedades del colegio con una estructura lista para crecer.",
      detail: "Después podemos sumar listados, categorías, destacados y detalle de noticia.",
    },
    contact: {
      eyebrow: "Relación institucional",
      title: "Contacto",
      subtitle: "Canal claro para familias interesadas, consultas administrativas y derivación comercial.",
      detail: "Más adelante podemos sumar formulario, mapa, horarios y múltiples sedes.",
    },
    admissions: {
      eyebrow: "Conversión",
      title: "Inscripciones",
      subtitle: "Página orientada a captación con pasos, requisitos y CTA claros hacia el proceso de admisión.",
      detail: "Es un buen lugar para montar formularios, agenda de entrevistas y seguimiento del funnel.",
    },
    dashboard: {
      title: "Dashboard",
      subtitle: "Centro de operaciones para usuarios autenticados.",
      detail: "Desde acá se distribuyen los accesos principales del sistema según el rol activo.",
    },
    grades: {
      title: "Calificaciones",
      subtitle: "Base inicial para notas, boletines y seguimiento académico.",
      detail: "Después podemos dividir por alumno, curso, período y permisos por rol.",
    },
    management: {
      title: "Gestión interna",
      subtitle: "Operación administrativa y académica bajo autenticación.",
      detail: "Este módulo puede concentrar usuarios, cursos, cobranzas, noticias internas y configuraciones.",
    },
  },
  [LANGUAGE.EN]: {
    brandLabel: "School",
    publicNav: {
      home: "Home",
      courses: "Courses",
      news: "News",
      contact: "Contact",
      admissions: "Admissions",
    },
    privateNav: {
      dashboard: "Dashboard",
      grades: "Grades",
      management: "Internal management",
      logout: "Sign out",
    },
    landing: {
      badge: "School SaaS",
      title: "Two clear worlds: public experience and private system",
      subtitle:
        "The app can now grow with a public marketing and information layer, plus a private layer for school operations and academic follow-up.",
      primaryCta: "Explore courses",
      secondaryCta: "Read news",
      tertiaryCta: "Enter the system",
      publicSectionTitle: "Public world",
      publicSectionText: "Landing, courses, news, contact and admissions to attract, inform and convert.",
      privateSectionTitle: "Private world",
      privateSectionText: "Dashboard, grades and internal management for protected school operations.",
    },
    courses: {
      eyebrow: "Academic offer",
      title: "Courses and programs",
      subtitle: "Present levels, educational offerings and benefits with institutional and marketing focus.",
      detail: "This space is meant to showcase the educational proposal, differentiators and admission CTAs.",
    },
    news: {
      eyebrow: "Updates",
      title: "News and announcements",
      subtitle: "Publish events, announcements and school updates with a structure ready to scale.",
      detail: "Later we can add lists, categories, highlights and full news detail pages.",
    },
    contact: {
      eyebrow: "Institutional relationship",
      title: "Contact",
      subtitle: "A clear channel for interested families, administrative questions and commercial routing.",
      detail: "Later we can add a form, map, schedule and multiple campus locations.",
    },
    admissions: {
      eyebrow: "Conversion",
      title: "Admissions",
      subtitle: "Conversion-oriented page with steps, requirements and clear CTAs into the admission process.",
      detail: "It is a strong place to build forms, interview scheduling and funnel tracking.",
    },
    dashboard: {
      title: "Dashboard",
      subtitle: "Operations center for authenticated users.",
      detail: "From here we can route the main system access points by active role.",
    },
    grades: {
      title: "Grades",
      subtitle: "Initial foundation for grades, report cards and academic tracking.",
      detail: "Later we can split by student, course, period and role-based permissions.",
    },
    management: {
      title: "Internal management",
      subtitle: "Administrative and academic operations under authentication.",
      detail: "This module can group users, courses, billing, internal news and settings.",
    },
  },
};
