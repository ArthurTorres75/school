import { LANGUAGE, type Language } from "@/lib/i18n";

interface PreferenceSwitcherCopy {
  languageTitle: string;
  themeTitle: string;
  spanish: string;
  english: string;
  light: string;
  dark: string;
}

interface AuthCopy {
  loginTitle: string;
  registerTitle: string;
  loginSubtitle: string;
  registerSubtitle: string;
  fullName: string;
  email: string;
  password: string;
  role: string;
  roleStudent: string;
  roleTeacher: string;
  roleParent: string;
  roleAdmin: string;
  passwordHint: string;
  loginAction: string;
  registerAction: string;
  loading: string;
  switchToRegister: string;
  switchToLogin: string;
  loginWelcome: (fullName: string) => string;
  registerWelcome: (fullName: string) => string;
  loginError: string;
  registerError: string;
  unknownError: string;
}

interface LandingCopy {
  badge: string;
  title: string;
  subtitle: string;
  login: string;
  register: string;
  dashboard: string;
  publicSectionTitle: string;
  publicSectionText: string;
  privateSectionTitle: string;
  privateSectionText: string;
}

interface DashboardCopy {
  title: string;
  subtitle: string;
  welcome: (identity: string, role: string) => string;
  ctaTitle: string;
  ctaText: string;
  logout: string;
}

interface UiCopy {
  preferences: PreferenceSwitcherCopy;
  auth: AuthCopy;
  landing: LandingCopy;
  dashboard: DashboardCopy;
}

export const UI_COPY: Record<Language, UiCopy> = {
  [LANGUAGE.ES]: {
    preferences: {
      languageTitle: "Idioma",
      themeTitle: "Tema",
      spanish: "Español",
      english: "Inglés",
      light: "Claro",
      dark: "Oscuro",
    },
    auth: {
      loginTitle: "Iniciar sesión",
      registerTitle: "Crear cuenta",
      loginSubtitle: "Entrá con tus credenciales.",
      registerSubtitle: "Registrate para acceder al panel.",
      fullName: "Nombre completo",
      email: "Email",
      password: "Contraseña",
      role: "Rol",
      roleStudent: "Estudiante",
      roleTeacher: "Docente",
      roleParent: "Padre/Madre",
      roleAdmin: "Administrador",
      passwordHint: "Mínimo 8 caracteres, con mayúscula, minúscula y número.",
      loginAction: "Entrar",
      registerAction: "Registrarme",
      loading: "Procesando...",
      switchToRegister: "¿No tenés cuenta? Registrate",
      switchToLogin: "¿Ya tenés cuenta? Iniciá sesión",
      loginWelcome: (fullName: string) => `Bienvenido ${fullName}.`,
      registerWelcome: (fullName: string) => `Cuenta creada para ${fullName}.`,
      loginError: "No se pudo iniciar sesión.",
      registerError: "No se pudo registrar la cuenta.",
      unknownError: "Error desconocido.",
    },
    landing: {
      badge: "School SaaS",
      title: "Plataforma escolar con panel público e interno",
      subtitle:
        "Empezamos la base del proyecto separando páginas públicas y privadas, con autenticación, idioma y tema reutilizable.",
      login: "Ir a login",
      register: "Ir a registro",
      dashboard: "Ir al dashboard",
      publicSectionTitle: "Zona pública",
      publicSectionText: "Acá van las páginas institucionales, propuesta educativa y contacto.",
      privateSectionTitle: "Zona interna",
      privateSectionText: "Acá van tableros de admin, docentes, familias y estudiantes.",
    },
    dashboard: {
      title: "Dashboard interno",
      subtitle: "Acceso protegido por sesión autenticada.",
      welcome: (identity: string, role: string) => `Hola ${identity}. Tu rol actual es ${role}.`,
      ctaTitle: "Próximo paso",
      ctaText:
        "Podemos construir ahora los módulos internos por rol y enlazarlos desde este punto.",
      logout: "Cerrar sesión",
    },
  },
  [LANGUAGE.EN]: {
    preferences: {
      languageTitle: "Language",
      themeTitle: "Theme",
      spanish: "Spanish",
      english: "English",
      light: "Light",
      dark: "Dark",
    },
    auth: {
      loginTitle: "Sign in",
      registerTitle: "Create account",
      loginSubtitle: "Use your credentials to continue.",
      registerSubtitle: "Register to access the dashboard.",
      fullName: "Full name",
      email: "Email",
      password: "Password",
      role: "Role",
      roleStudent: "Student",
      roleTeacher: "Teacher",
      roleParent: "Parent",
      roleAdmin: "Admin",
      passwordHint: "Minimum 8 chars, with uppercase, lowercase and number.",
      loginAction: "Sign in",
      registerAction: "Create account",
      loading: "Processing...",
      switchToRegister: "No account yet? Register",
      switchToLogin: "Already have an account? Sign in",
      loginWelcome: (fullName: string) => `Welcome ${fullName}.`,
      registerWelcome: (fullName: string) => `Account created for ${fullName}.`,
      loginError: "Could not sign in.",
      registerError: "Could not create account.",
      unknownError: "Unknown error.",
    },
    landing: {
      badge: "School SaaS",
      title: "School platform with public and private areas",
      subtitle:
        "The project base now separates public and internal pages, with authentication plus reusable language and theme controls.",
      login: "Go to login",
      register: "Go to register",
      dashboard: "Go to dashboard",
      publicSectionTitle: "Public area",
      publicSectionText: "Institutional pages, educational proposal and contact go here.",
      privateSectionTitle: "Private area",
      privateSectionText: "Admin, teacher, parent and student dashboards go here.",
    },
    dashboard: {
      title: "Internal dashboard",
      subtitle: "Protected by authenticated session.",
      welcome: (identity: string, role: string) => `Hi ${identity}. Your active role is ${role}.`,
      ctaTitle: "Next step",
      ctaText: "We can now build role-based internal modules from this entry point.",
      logout: "Sign out",
    },
  },
};
