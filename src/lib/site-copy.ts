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

interface LandingStatCopy {
  value: string;
  label: string;
}

interface LandingOfferCopy {
  title: string;
  description: string;
  tag: string;
}

interface LandingFlowStepCopy {
  title: string;
  description: string;
}

interface LandingPageCopy {
  badge: string;
  title: string;
  subtitle: string;
  primaryCta: string;
  secondaryCta: string;
  tertiaryCta: string;
  heroDetail: string;
  stats: LandingStatCopy[];
  offersEyebrow: string;
  offersTitle: string;
  offersSubtitle: string;
  offers: LandingOfferCopy[];
  flowEyebrow: string;
  flowTitle: string;
  flowSubtitle: string;
  flowSteps: LandingFlowStepCopy[];
  finalCtaTitle: string;
  finalCtaSubtitle: string;
  finalPrimaryCta: string;
  finalSecondaryCta: string;
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
      title: "Una plataforma escolar moderna para captar familias y operar sin fricción",
      subtitle:
        "Combinamos una experiencia pública pensada para conversión con un sistema privado para docentes, administración y seguimiento académico en tiempo real.",
      primaryCta: "Explorar cursos",
      secondaryCta: "Ver noticias",
      tertiaryCta: "Ingresar al sistema",
      heroDetail:
        "Diseñado para escalar desde una escuela pequeña hasta múltiples sedes, con arquitectura modular y foco en trazabilidad institucional.",
      stats: [
        {
          value: "24/7",
          label: "Acceso web para familias y equipo interno",
        },
        {
          value: "100%",
          label: "Flujos clave centralizados en un solo sistema",
        },
        {
          value: "Roles",
          label: "Permisos separados para admin, docentes y familias",
        },
      ],
      offersEyebrow: "Lo que ofrece",
      offersTitle: "Todo el ciclo escolar en un solo lugar",
      offersSubtitle:
        "Desde la primera visita a la web hasta la gestión interna del colegio, cada módulo está pensado para reducir fricción y mejorar la experiencia.",
      offers: [
        {
          title: "Presencia pública de alto impacto",
          description: "Landing, cursos, noticias y contacto optimizados para comunicar valor institucional y convertir interés en inscripciones.",
          tag: "Marketing escolar",
        },
        {
          title: "Operación académica protegida",
          description: "Dashboard privado para seguimiento de calificaciones, gestión de usuarios y procesos internos con acceso por rol.",
          tag: "Gestión interna",
        },
        {
          title: "Base lista para escalar",
          description: "Arquitectura modular y serverless preparada para sumar cobranzas, reportes y automatizaciones sin rehacer el núcleo.",
          tag: "Escalabilidad",
        },
      ],
      flowEyebrow: "Cómo funciona",
      flowTitle: "Un recorrido claro para familias y equipo escolar",
      flowSubtitle: "Cada etapa fue pensada para que la información fluya y las decisiones sean más rápidas.",
      flowSteps: [
        {
          title: "Descubrimiento",
          description: "Las familias conocen la propuesta educativa y acceden a cursos, novedades e información institucional.",
        },
        {
          title: "Conversión",
          description: "La página de inscripciones guía el proceso con pasos claros, requisitos y llamados a la acción concretos.",
        },
        {
          title: "Operación diaria",
          description: "El equipo interno gestiona académicos y administrativos desde un dashboard unificado con control de acceso.",
        },
      ],
      finalCtaTitle: "Listo para transformar la gestión de tu escuela",
      finalCtaSubtitle:
        "Implementá una experiencia digital profesional, escalable y centrada en resultados para familias, docentes y administración.",
      finalPrimaryCta: "Comenzar ahora",
      finalSecondaryCta: "Ir al dashboard",
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
      title: "A modern school platform to attract families and run operations smoothly",
      subtitle:
        "We combine a conversion-focused public experience with a private system for teachers, administration and real-time academic tracking.",
      primaryCta: "Explore courses",
      secondaryCta: "Read news",
      tertiaryCta: "Enter the system",
      heroDetail:
        "Built to scale from a single school to multiple campuses, with modular architecture and strong institutional traceability.",
      stats: [
        {
          value: "24/7",
          label: "Web access for families and internal teams",
        },
        {
          value: "100%",
          label: "Core school workflows centralized in one platform",
        },
        {
          value: "Roles",
          label: "Permission boundaries for admin, teachers and families",
        },
      ],
      offersEyebrow: "What you get",
      offersTitle: "The full school lifecycle in one place",
      offersSubtitle:
        "From the first website visit to private daily operations, every module is designed to reduce friction and improve experience.",
      offers: [
        {
          title: "High-impact public presence",
          description: "Landing, courses, news and contact pages optimized to communicate school value and convert interest into admissions.",
          tag: "School marketing",
        },
        {
          title: "Protected academic operations",
          description: "Private dashboard for grades tracking, user management and internal workflows with role-based access.",
          tag: "Internal management",
        },
        {
          title: "Scale-ready foundation",
          description: "Modular serverless architecture ready for billing, reporting and automations without rebuilding the core.",
          tag: "Scalability",
        },
      ],
      flowEyebrow: "How it works",
      flowTitle: "A clear path for families and school teams",
      flowSubtitle: "Each stage is crafted so information flows and decisions happen faster.",
      flowSteps: [
        {
          title: "Discovery",
          description: "Families discover your educational offering through courses, updates and institutional information.",
        },
        {
          title: "Conversion",
          description: "The admissions page guides users with clear steps, requirements and focused calls to action.",
        },
        {
          title: "Daily operations",
          description: "Internal teams manage academic and administrative work from a unified, permission-aware dashboard.",
        },
      ],
      finalCtaTitle: "Ready to transform your school management",
      finalCtaSubtitle:
        "Launch a professional, scalable digital experience centered on outcomes for families, teachers and administrators.",
      finalPrimaryCta: "Get started",
      finalSecondaryCta: "Go to dashboard",
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
