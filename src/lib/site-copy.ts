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
  notebookEyebrow: string;
  notebookTitle: string;
  notebookSubtitle: string;
  notebookFeatureOneTitle: string;
  notebookFeatureOneDescription: string;
  notebookFeatureTwoTitle: string;
  notebookFeatureTwoDescription: string;
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

interface PublicCardCopy {
  tag: string;
  title: string;
  description: string;
}

interface CoursesPageCopy extends PublicPageCopy {
  programsEyebrow: string;
  programsTitle: string;
  programsSubtitle: string;
  programs: PublicCardCopy[];
  ctaTitle: string;
  ctaText: string;
  ctaLabel: string;
}

export interface RichPublicPageCopy extends PublicPageCopy {
  sectionEyebrow: string;
  sectionTitle: string;
  sectionSubtitle: string;
  cards: PublicCardCopy[];
  ctaTitle: string;
  ctaText: string;
  ctaLabel: string;
}

interface AdmissionsFormCopy {
  title: string;
  subtitle: string;
  organizationLabel: string;
  organizationPlaceholder: string;
  studentLabel: string;
  studentPlaceholder: string;
  parentLabel: string;
  parentPlaceholder: string;
  birthDateLabel: string;
  gradeLevelLabel: string;
  cedulaLabel: string;
  gradeHint: string;
  coursesLabel: string;
  coursesAutoHint: string;
  coursesCountLabel: string;
  coursesStateLoading: string;
  coursesStateReady: string;
  coursesStateEmpty: string;
  emptyCourses: string;
  summaryTitle: string;
  summaryStudent: string;
  summaryParent: string;
  summaryCourses: string;
  submitLabel: string;
  loadingLabel: string;
  successLabel: string;
  genericErrorLabel: string;
  unauthorizedLabel: string;
  forbiddenLabel: string;
  loginLabel: string;
  ageLabel: string;
}

interface PrivatePageCopy {
  title: string;
  subtitle: string;
  detail: string;
  inscriptionCtaLabel?: string;
  inscriptionCtaHint?: string;
}

interface DashboardPageCopy extends PrivatePageCopy {
  visualBadge: string;
  quickActionsTitle: string;
  quickActionsSubtitle: string;
  sessionStatusTitle: string;
  sessionStatusActive: string;
  sessionEmailLabel: string;
  sessionRoleLabel: string;
  nextStepTitle: string;
  nextStepHint: string;
  kpiActionsLabel: string;
  kpiEnrollmentLabel: string;
  kpiModulesLabel: string;
  kpiRoleLabel: string;
  enrollmentEnabledLabel: string;
  enrollmentRestrictedLabel: string;
  roleNameAdmin: string;
  roleNameParent: string;
  roleNameTeacher: string;
  roleNameStudent: string;
  roleNameUnknown: string;
  roleActionsTitle: string;
  roleActionsSubtitle: string;
  roleActionsEmpty: string;
  roleActionsAdmin: string[];
  roleActionsParent: string[];
  roleActionsTeacher: string[];
  roleActionsStudent: string[];
}

interface GradesPageCopy extends PrivatePageCopy {
  parentChildrenTitle: string;
  parentChildrenSubtitle: string;
  adminChildrenTitle: string;
  adminChildrenSubtitle: string;
  parentChildrenLoading: string;
  parentChildrenError: string;
  parentNoChildren: string;
  parentOpenGradesLabel: string;
  parentInscriptionStatusInscribed: string;
  parentInscriptionStatusPending: string;
  parentGradesListTitle: string;
  parentSelectedChildLabel: string;
  parentAverageLabel: string;
  parentNoGrades: string;
  parentGradesLoading: string;
  parentGradesError: string;
}

interface SiteCopy {
  brandLabel: string;
  publicNav: NavigationCopy;
  privateNav: PrivateNavigationCopy;
  landing: LandingPageCopy;
  courses: CoursesPageCopy;
  news: RichPublicPageCopy;
  contact: RichPublicPageCopy;
  admissions: PublicPageCopy;
  admissionsForm: AdmissionsFormCopy;
  dashboard: DashboardPageCopy;
  grades: GradesPageCopy;
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
      notebookEyebrow: "Vista interactiva",
      notebookTitle: "Un cuaderno 3D que se abre mientras hacés scroll",
      notebookSubtitle:
        "Integramos animación inmersiva para reforzar el relato institucional y mostrar innovación sin sacrificar claridad.",
      notebookFeatureOneTitle: "Animación guiada por scroll",
      notebookFeatureOneDescription:
        "La apertura del cuaderno responde al avance de lectura para mantener una narrativa visual coherente.",
      notebookFeatureTwoTitle: "Escena optimizada con Three.js",
      notebookFeatureTwoDescription:
        "Modelo liviano con luces y materiales equilibrados para funcionar fluido en desktop y mobile.",
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
      programsEyebrow: "Niveles",
      programsTitle: "Una propuesta para cada etapa",
      programsSubtitle: "Acompañamos el recorrido académico completo, con foco en cada momento del desarrollo.",
      programs: [
        {
          tag: "Inicial",
          title: "Educación inicial",
          description: "Primeros años con juego, exploración y bases socioemocionales sólidas.",
        },
        {
          tag: "Primaria",
          title: "Educación primaria",
          description: "Lectoescritura, pensamiento lógico y hábitos de estudio en un entorno contenedor.",
        },
        {
          tag: "Secundaria",
          title: "Educación secundaria",
          description: "Preparación académica integral con orientación para la siguiente etapa.",
        },
      ],
      ctaTitle: "¿Lista tu familia para sumarse?",
      ctaText: "Conocé el proceso de inscripción y asegurá el cupo para el próximo ciclo.",
      ctaLabel: "Ir a inscripciones",
    },
    news: {
      eyebrow: "Novedades",
      title: "Noticias y comunicados",
      subtitle: "Publicá eventos, anuncios y novedades del colegio con una estructura lista para crecer.",
      detail: "Después podemos sumar listados, categorías, destacados y detalle de noticia.",
      sectionEyebrow: "Categorías",
      sectionTitle: "Lo que vas a encontrar acá",
      sectionSubtitle: "Mantené a la comunidad al día con todo lo que pasa en el colegio.",
      cards: [
        {
          tag: "Eventos",
          title: "Eventos institucionales",
          description: "Actos, jornadas y actividades abiertas a las familias.",
        },
        {
          tag: "Comunicados",
          title: "Comunicados oficiales",
          description: "Información importante de administración y dirección.",
        },
        {
          tag: "Vida escolar",
          title: "Vida escolar",
          description: "Logros, proyectos y el día a día de nuestros estudiantes.",
        },
      ],
      ctaTitle: "¿No te querés perder nada?",
      ctaText: "Escribinos y te mantenemos al tanto de las próximas novedades.",
      ctaLabel: "Ir a contacto",
    },
    contact: {
      eyebrow: "Relación institucional",
      title: "Contacto",
      subtitle: "Canal claro para familias interesadas, consultas administrativas y derivación comercial.",
      detail: "Más adelante podemos sumar formulario, mapa, horarios y múltiples sedes.",
      sectionEyebrow: "Canales",
      sectionTitle: "¿Con quién querés hablar?",
      sectionSubtitle: "Elegí el canal según tu consulta y te respondemos a la brevedad.",
      cards: [
        {
          tag: "Admisiones",
          title: "Sumate a la comunidad",
          description: "Escribinos para iniciar el proceso de inscripción y conocer el colegio.",
        },
        {
          tag: "Administración",
          title: "Pagos y documentación",
          description: "Consultas sobre cuotas, constancias y trámites administrativos.",
        },
        {
          tag: "Visitas",
          title: "Conocé el campus",
          description: "Agendá un recorrido para vivir la experiencia en persona.",
        },
      ],
      ctaTitle: "¿Listo para dar el primer paso?",
      ctaText: "Iniciá la inscripción y asegurá el lugar de tu familia.",
      ctaLabel: "Ir a inscripciones",
    },
    admissions: {
      eyebrow: "Conversión",
      title: "Inscripciones",
      subtitle: "Página orientada a captación con pasos, requisitos y CTA claros hacia el proceso de admisión.",
      detail: "Es un buen lugar para montar formularios, agenda de entrevistas y seguimiento del funnel.",
    },
    admissionsForm: {
      title: "Inscripción escolar",
      subtitle: "Completá los datos del estudiante. Las materias activas se asignan automáticamente.",
      organizationLabel: "Organización",
      organizationPlaceholder: "Seleccioná una organización",
      studentLabel: "Estudiante",
      studentPlaceholder: "Seleccioná un estudiante",
      parentLabel: "Representante",
      parentPlaceholder: "Seleccioná un representante",
      birthDateLabel: "Fecha de nacimiento",
      gradeLevelLabel: "Grado a cursar",
      cedulaLabel: "Cédula del estudiante",
      gradeHint: "Usá un valor entre 1 y 12.",
      coursesLabel: "Materias asignadas automáticamente",
      coursesAutoHint: "En nivel escolar se asignan todas las materias activas, sin selección manual.",
      coursesCountLabel: "Materias activas",
      coursesStateLoading: "Cargando",
      coursesStateReady: "Listo",
      coursesStateEmpty: "Sin materias",
      emptyCourses: "No hay materias activas para esta organización.",
      summaryTitle: "Resumen de inscripción",
      summaryStudent: "Estudiante",
      summaryParent: "Representante",
      summaryCourses: "Materias a asignar",
      submitLabel: "Confirmar inscripción",
      loadingLabel: "Guardando inscripción...",
      successLabel: "Inscripción completada correctamente.",
      genericErrorLabel: "No se pudo completar la inscripción.",
      unauthorizedLabel: "Necesitás iniciar sesión para inscribir estudiantes.",
      forbiddenLabel: "Solo administradores y representantes pueden realizar inscripciones.",
      loginLabel: "Ir a autenticación",
      ageLabel: "Edad calculada",
    },
    dashboard: {
      title: "Dashboard",
      subtitle: "Centro de operaciones para usuarios autenticados.",
      detail: "Desde acá se distribuyen los accesos principales del sistema según el rol activo.",
      visualBadge: "Vista operativa",
      quickActionsTitle: "Atajos de operación",
      quickActionsSubtitle: "Entrá rápido a los módulos clave según tu perfil activo.",
      sessionStatusTitle: "Estado de sesión",
      sessionStatusActive: "Activa",
      sessionEmailLabel: "Cuenta",
      sessionRoleLabel: "Rol",
      nextStepTitle: "Siguiente paso recomendado",
      nextStepHint: "Usá un acceso directo para continuar tu flujo principal de hoy.",
      kpiActionsLabel: "Acciones habilitadas",
      kpiEnrollmentLabel: "Inscripción",
      kpiModulesLabel: "Módulos visibles",
      kpiRoleLabel: "Perfil activo",
      enrollmentEnabledLabel: "Habilitada",
      enrollmentRestrictedLabel: "Restringida",
      roleNameAdmin: "Administrador",
      roleNameParent: "Representante",
      roleNameTeacher: "Docente",
      roleNameStudent: "Estudiante",
      roleNameUnknown: "Sin rol",
      inscriptionCtaLabel: "Ir a inscribir estudiante",
      inscriptionCtaHint: "Disponible para administradores y representantes.",
      roleActionsTitle: "Acciones disponibles según tu rol",
      roleActionsSubtitle: "Estas acciones se habilitan o restringen automáticamente por permisos.",
      roleActionsEmpty: "No hay acciones configuradas para tu rol en este momento.",
      roleActionsAdmin: [
        "Inscribir estudiantes y asignar representante cuando corresponda.",
        "Gestionar organizaciones, usuarios y configuraciones internas.",
        "Supervisar calificaciones y estado general de la operación.",
      ],
      roleActionsParent: [
        "Inscribir a tus estudiantes vinculados dentro de tu organización.",
        "Consultar estado de inscripción y materias asignadas.",
        "Hacer seguimiento académico desde las vistas habilitadas.",
      ],
      roleActionsTeacher: [
        "Consultar cursos y estudiantes asignados.",
        "Registrar o revisar calificaciones según permisos vigentes.",
        "Dar seguimiento académico de los grupos a cargo.",
      ],
      roleActionsStudent: [
        "Consultar información académica y estado personal.",
        "Ver materias y novedades publicadas por la institución.",
        "Seguir tus avances en los módulos habilitados.",
      ],
    },
    grades: {
      title: "Calificaciones",
      subtitle: "Base inicial para notas, boletines y seguimiento académico.",
      detail: "Después podemos dividir por alumno, curso, período y permisos por rol.",
      parentChildrenTitle: "Mis hijos",
      parentChildrenSubtitle: "Seleccioná un estudiante para ver sus calificaciones y estado de inscripción.",
      adminChildrenTitle: "Estudiantes",
      adminChildrenSubtitle: "Seleccioná un estudiante para ver sus calificaciones y estado de inscripción.",
      parentChildrenLoading: "Cargando hijos...",
      parentChildrenError: "No se pudo cargar la lista de hijos.",
      parentNoChildren: "No encontramos estudiantes vinculados a tu perfil.",
      parentOpenGradesLabel: "Ver calificaciones",
      parentInscriptionStatusInscribed: "Inscripto",
      parentInscriptionStatusPending: "Sin inscripción",
      parentGradesListTitle: "Detalle de calificaciones",
      parentSelectedChildLabel: "Estudiante seleccionado",
      parentAverageLabel: "Promedio general",
      parentNoGrades: "Este estudiante todavía no tiene calificaciones registradas.",
      parentGradesLoading: "Cargando calificaciones...",
      parentGradesError: "No se pudieron cargar las calificaciones del estudiante.",
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
      notebookEyebrow: "Interactive view",
      notebookTitle: "A 3D notebook that opens as users scroll",
      notebookSubtitle:
        "We add immersive motion to strengthen the institutional narrative while preserving clarity and usability.",
      notebookFeatureOneTitle: "Scroll-driven animation",
      notebookFeatureOneDescription:
        "The notebook opening is tied to reading progress to keep the visual story aligned with the content flow.",
      notebookFeatureTwoTitle: "Optimized Three.js scene",
      notebookFeatureTwoDescription:
        "Lightweight model with balanced lights and materials for smooth performance on desktop and mobile.",
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
      programsEyebrow: "Levels",
      programsTitle: "A path for every stage",
      programsSubtitle: "We support the full academic journey, focused on each stage of development.",
      programs: [
        {
          tag: "Early years",
          title: "Early childhood education",
          description: "First years built on play, exploration and strong social-emotional foundations.",
        },
        {
          tag: "Primary",
          title: "Primary education",
          description: "Literacy, logical thinking and study habits in a caring environment.",
        },
        {
          tag: "Secondary",
          title: "Secondary education",
          description: "Comprehensive academic preparation with guidance for what comes next.",
        },
      ],
      ctaTitle: "Ready to join your family?",
      ctaText: "Learn about the admission process and secure a spot for the next term.",
      ctaLabel: "Go to admissions",
    },
    news: {
      eyebrow: "Updates",
      title: "News and announcements",
      subtitle: "Publish events, announcements and school updates with a structure ready to scale.",
      detail: "Later we can add lists, categories, highlights and full news detail pages.",
      sectionEyebrow: "Categories",
      sectionTitle: "What you'll find here",
      sectionSubtitle: "Keep the community up to date with everything happening at school.",
      cards: [
        {
          tag: "Events",
          title: "Institutional events",
          description: "Ceremonies, open days and activities for families.",
        },
        {
          tag: "Announcements",
          title: "Official announcements",
          description: "Important information from administration and leadership.",
        },
        {
          tag: "School life",
          title: "School life",
          description: "Achievements, projects and our students' day to day.",
        },
      ],
      ctaTitle: "Don't want to miss a thing?",
      ctaText: "Reach out and we'll keep you posted on what's coming.",
      ctaLabel: "Go to contact",
    },
    contact: {
      eyebrow: "Institutional relationship",
      title: "Contact",
      subtitle: "A clear channel for interested families, administrative questions and commercial routing.",
      detail: "Later we can add a form, map, schedule and multiple campus locations.",
      sectionEyebrow: "Channels",
      sectionTitle: "Who would you like to talk to?",
      sectionSubtitle: "Pick the channel that fits your question and we'll reply shortly.",
      cards: [
        {
          tag: "Admissions",
          title: "Join the community",
          description: "Reach out to start the enrollment process and get to know the school.",
        },
        {
          tag: "Administration",
          title: "Payments and paperwork",
          description: "Questions about tuition, certificates and administrative procedures.",
        },
        {
          tag: "Visits",
          title: "Visit the campus",
          description: "Schedule a tour to experience it in person.",
        },
      ],
      ctaTitle: "Ready to take the first step?",
      ctaText: "Start the enrollment and secure your family's spot.",
      ctaLabel: "Go to admissions",
    },
    admissions: {
      eyebrow: "Conversion",
      title: "Admissions",
      subtitle: "Conversion-oriented page with steps, requirements and clear CTAs into the admission process.",
      detail: "It is a strong place to build forms, interview scheduling and funnel tracking.",
    },
    admissionsForm: {
      title: "School enrollment",
      subtitle: "Complete the student data. Active subjects are auto-assigned.",
      organizationLabel: "Organization",
      organizationPlaceholder: "Select an organization",
      studentLabel: "Student",
      studentPlaceholder: "Select a student",
      parentLabel: "Guardian",
      parentPlaceholder: "Select a guardian",
      birthDateLabel: "Birth date",
      gradeLevelLabel: "Grade level",
      cedulaLabel: "Student national ID",
      gradeHint: "Use a value between 1 and 12.",
      coursesLabel: "Subjects auto-assigned",
      coursesAutoHint: "In school mode all active subjects are assigned automatically.",
      coursesCountLabel: "Active subjects",
      coursesStateLoading: "Loading",
      coursesStateReady: "Ready",
      coursesStateEmpty: "No subjects",
      emptyCourses: "No active subjects available for this organization.",
      summaryTitle: "Enrollment summary",
      summaryStudent: "Student",
      summaryParent: "Guardian",
      summaryCourses: "Subjects to assign",
      submitLabel: "Confirm enrollment",
      loadingLabel: "Saving enrollment...",
      successLabel: "Enrollment completed successfully.",
      genericErrorLabel: "Enrollment could not be completed.",
      unauthorizedLabel: "You need to sign in to enroll students.",
      forbiddenLabel: "Only admins and guardians can enroll students.",
      loginLabel: "Go to authentication",
      ageLabel: "Calculated age",
    },
    dashboard: {
      title: "Dashboard",
      subtitle: "Operations center for authenticated users.",
      detail: "From here we can route the main system access points by active role.",
      visualBadge: "Operational view",
      quickActionsTitle: "Operational shortcuts",
      quickActionsSubtitle: "Jump into key modules quickly based on your active profile.",
      sessionStatusTitle: "Session status",
      sessionStatusActive: "Active",
      sessionEmailLabel: "Account",
      sessionRoleLabel: "Role",
      nextStepTitle: "Recommended next step",
      nextStepHint: "Use a direct access card to continue your main workflow today.",
      kpiActionsLabel: "Enabled actions",
      kpiEnrollmentLabel: "Enrollment",
      kpiModulesLabel: "Visible modules",
      kpiRoleLabel: "Active profile",
      enrollmentEnabledLabel: "Enabled",
      enrollmentRestrictedLabel: "Restricted",
      roleNameAdmin: "Administrator",
      roleNameParent: "Guardian",
      roleNameTeacher: "Teacher",
      roleNameStudent: "Student",
      roleNameUnknown: "No role",
      inscriptionCtaLabel: "Go to student enrollment",
      inscriptionCtaHint: "Available for admins and guardians.",
      roleActionsTitle: "Available actions for your role",
      roleActionsSubtitle: "These actions are enabled or restricted automatically by permissions.",
      roleActionsEmpty: "There are no actions configured for your role at the moment.",
      roleActionsAdmin: [
        "Enroll students and assign guardians when needed.",
        "Manage organizations, users and internal settings.",
        "Monitor grades and overall operational status.",
      ],
      roleActionsParent: [
        "Enroll your linked students within your organization.",
        "Check enrollment status and assigned subjects.",
        "Track academic progress from enabled views.",
      ],
      roleActionsTeacher: [
        "Review assigned courses and students.",
        "Register or review grades based on active permissions.",
        "Follow academic progress for your groups.",
      ],
      roleActionsStudent: [
        "Review academic information and personal status.",
        "See subjects and institutional updates.",
        "Track your progress in enabled modules.",
      ],
    },
    grades: {
      title: "Grades",
      subtitle: "Initial foundation for grades, report cards and academic tracking.",
      detail: "Later we can split by student, course, period and role-based permissions.",
      parentChildrenTitle: "My children",
      parentChildrenSubtitle: "Select a student to view grades and enrollment status.",
      adminChildrenTitle: "Students",
      adminChildrenSubtitle: "Select a student to view grades and enrollment status.",
      parentChildrenLoading: "Loading children...",
      parentChildrenError: "The children list could not be loaded.",
      parentNoChildren: "No students are linked to your profile.",
      parentOpenGradesLabel: "View grades",
      parentInscriptionStatusInscribed: "Enrolled",
      parentInscriptionStatusPending: "Not enrolled",
      parentGradesListTitle: "Grades detail",
      parentSelectedChildLabel: "Selected student",
      parentAverageLabel: "Overall average",
      parentNoGrades: "This student has no grades yet.",
      parentGradesLoading: "Loading grades...",
      parentGradesError: "The student grades could not be loaded.",
    },
    management: {
      title: "Internal management",
      subtitle: "Administrative and academic operations under authentication.",
      detail: "This module can group users, courses, billing, internal news and settings.",
    },
  },
};
