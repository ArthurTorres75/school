"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { useState, useMemo } from "react";
import { useForm, useWatch } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useMutation, useQuery } from "@tanstack/react-query";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { AuthShell } from "@/components/AuthShell";
import { useLanguage } from "@/providers/LanguageProvider";
import { UI_COPY } from "@/lib/ui-copy";
import { getAuthSchemas, type LoginFormInput, type LoginInput, type RegisterUserFormInput, type RegisterUserInput } from "@/modules/users/user.schemas.i18n";
import type { PublicOrganizationItem } from "@/modules/organizations/organization.types";
import { cn } from "@/lib/utils";

type AuthMode = "login" | "register";

interface SafeUser {
  id: string;
  fullName: string;
  email: string;
  role: string;
  createdAt: string;
  updatedAt: string;
}

interface AuthResponse {
  success: boolean;
  data?: SafeUser;
  message?: string;
  type?: string;
}

interface OrganizationsResponse {
  success: boolean;
  data: PublicOrganizationItem[];
}

interface RegisterStudentOption {
  email: string;
  label: string;
}

interface RegisterOptionsResponse {
  success: boolean;
  data: {
    students: RegisterStudentOption[];
  };
}

interface AuthPageProps {
  initialMode?: AuthMode;
}

const FIELD_CLASS = "mt-1";

const SELECT_CLASS =
  "mt-1 w-full rounded-md border border-input bg-background px-3 py-2 text-sm text-foreground transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring disabled:cursor-not-allowed disabled:opacity-50";

const ERROR_TEXT_CLASS = "mt-1.5 text-xs text-destructive";

export function AuthPage({ initialMode = "login" }: AuthPageProps) {
  const router = useRouter();
  const { language } = useLanguage();
  const copy = UI_COPY[language].auth;

  const [mode, setMode] = useState<AuthMode>(initialMode);
  const [message, setMessage] = useState("");
  const [messageType, setMessageType] = useState<"success" | "error" | "">("");
  const [studentSearch, setStudentSearch] = useState("");

  // Get schemas based on current language
  const { loginSchema, registerUserSchema } = useMemo(() => getAuthSchemas(language), [language]);

  const loginForm = useForm<LoginFormInput, undefined, LoginInput>({
    resolver: zodResolver(loginSchema),
    defaultValues: { email: "", password: "" },
  });

  const registerForm = useForm<RegisterUserFormInput, undefined, RegisterUserInput>({
    resolver: zodResolver(registerUserSchema),
    defaultValues: {
      fullName: "",
      email: "",
      password: "",
      role: "student",
      organizationSlug: "",
      parentEmail: "",
      representedStudentEmail: "",
    },
  });
  const registerRole = useWatch({
    control: registerForm.control,
    name: "role",
  });
  const watchedOrganizationSlug = useWatch({
    control: registerForm.control,
    name: "organizationSlug",
  });
  const registerOrganizationSlug =
    typeof watchedOrganizationSlug === "string" ? watchedOrganizationSlug : "";
  const watchedRepresentedStudentEmail = useWatch({
    control: registerForm.control,
    name: "representedStudentEmail",
  });
  const representedStudentEmail =
    typeof watchedRepresentedStudentEmail === "string" ? watchedRepresentedStudentEmail : "";

  const { data: currentUser } = useQuery({
    queryKey: ["auth:me"],
    queryFn: async () => {
      const res = await fetch("/api/auth/me");
      if (!res.ok) return null;
      return res.json() as Promise<AuthResponse>;
    },
    retry: false,
  });

  const { data: organizationsData } = useQuery({
    queryKey: ["organizations:public"],
    queryFn: async () => {
      const res = await fetch("/api/organizations");
      if (!res.ok) return { success: false, data: [] };
      return res.json() as Promise<OrganizationsResponse>;
    },
    enabled: mode === "register",
    staleTime: 5 * 60 * 1000,
  });

  const organizations = organizationsData?.data ?? [];

  const { data: registerOptionsData } = useQuery({
    queryKey: ["auth:register-options", registerOrganizationSlug, studentSearch],
    queryFn: async () => {
      const params = new URLSearchParams({ organizationSlug: registerOrganizationSlug });
      const normalizedSearch = studentSearch.trim();

      if (normalizedSearch.length > 0) {
        params.set("q", normalizedSearch);
      }

      const res = await fetch(`/api/auth/register-options?${params.toString()}`);
      if (!res.ok) {
        return { success: false, data: { students: [] } } as RegisterOptionsResponse;
      }
      return res.json() as Promise<RegisterOptionsResponse>;
    },
    enabled: mode === "register" && registerRole === "parent" && Boolean(registerOrganizationSlug),
    staleTime: 60 * 1000,
  });

  const registerStudents = registerOptionsData?.data.students ?? [];
  const filteredRegisterStudents = registerStudents;

  const loginMutation = useMutation({
    mutationFn: async (input: LoginInput) => {
      const res = await fetch("/api/auth/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(input),
      });
      return res.json() as Promise<AuthResponse>;
    },
    onSuccess: (data) => {
      if (data.success) {
        setMessage(copy.loginWelcome(data.data?.fullName ?? ""));
        setMessageType("success");
        loginForm.reset();
        setTimeout(() => {
          router.push("/dashboard");
          router.refresh();
        }, 500);
      } else {
        setMessage(data.message || copy.loginError);
        setMessageType("error");
      }
    },
    onError: (err) => {
      setMessage(err instanceof Error ? err.message : copy.unknownError);
      setMessageType("error");
    },
  });

  const registerMutation = useMutation({
    mutationFn: async (input: RegisterUserInput) => {
      const res = await fetch("/api/auth/register", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(input),
      });
      return res.json() as Promise<AuthResponse>;
    },
    onSuccess: (data) => {
      if (data.success) {
        setMessage(copy.registerWelcome(data.data?.fullName ?? ""));
        setMessageType("success");
        registerForm.reset();
        setTimeout(() => {
          router.push("/dashboard");
          router.refresh();
        }, 500);
      } else {
        setMessage(data.message || copy.registerError);
        setMessageType("error");
      }
    },
    onError: (err) => {
      setMessage(err instanceof Error ? err.message : copy.unknownError);
      setMessageType("error");
    },
  });

  const handleLogout = async () => {
    await fetch("/api/auth/logout", { method: "POST" });
    router.push("/");
    router.refresh();
  };

  const switchMode = (next: AuthMode) => {
    setMode(next);
    setMessage("");
    loginForm.clearErrors();
    registerForm.clearErrors();
  };

  if (currentUser?.data) {
    return (
      <AuthShell
        brandLabel="School"
        title={copy.brandPanelTitle}
        subtitle={copy.brandPanelSubtitle}
        features={copy.brandPanelFeatures}
      >
        <div className="space-y-6 rounded-2xl border border-border bg-card p-8 shadow-lg shadow-black/5 animate-card-scale-in">
            <div className="space-y-1">
              <h1 className="font-heading text-2xl font-semibold tracking-tight">Sesión activa</h1>
              <p className="text-sm text-muted-foreground">Estás autenticado como:</p>
            </div>

            <div className="space-y-2.5 rounded-xl border border-border bg-muted/30 p-4">
              <div className="flex items-center gap-2 text-sm">
                <span className="w-16 shrink-0 text-muted-foreground">Nombre</span>
                <span className="font-medium text-foreground">{currentUser.data.fullName}</span>
              </div>
              <div className="h-px bg-border" />
              <div className="flex items-center gap-2 text-sm">
                <span className="w-16 shrink-0 text-muted-foreground">Email</span>
                <span className="font-medium text-foreground">{currentUser.data.email}</span>
              </div>
              <div className="h-px bg-border" />
              <div className="flex items-center gap-2 text-sm">
                <span className="w-16 shrink-0 text-muted-foreground">Rol</span>
                <span className="inline-flex items-center rounded-full border border-primary/25 bg-primary/10 px-2.5 py-0.5 text-xs font-semibold uppercase tracking-wide text-primary">
                  {currentUser.data.role}
                </span>
              </div>
            </div>

            <div className="flex gap-2">
              <Button onClick={() => router.push("/dashboard")} className="flex-1" aria-label="Ir al dashboard">
                Dashboard
              </Button>
              <Button onClick={handleLogout} variant="outline" className="flex-1" aria-label="Cerrar sesión">
                Cerrar sesión
              </Button>
            </div>

            <Link href="/" className="block text-center text-sm text-muted-foreground transition-colors hover:text-foreground">
              Volver al inicio
            </Link>

            <div className="space-y-3 border-t border-border pt-4">
              <p className="text-xs font-semibold uppercase tracking-wide text-muted-foreground">Probar endpoint protegido</p>
              <Button
                variant="outline"
                size="sm"
                className="w-full font-mono text-xs"
                onClick={async () => {
                  const res = await fetch("/api/admin/health");
                  const data = await res.json();
                  setMessage(`${res.status}: ${JSON.stringify(data.data || data.message)}`);
                  setMessageType(res.ok ? "success" : "error");
                }}
                aria-label="Probar API admin"
              >
                GET /api/admin/health
              </Button>
            </div>

            {message && (
              <div
                className={cn(
                  "rounded-lg border px-4 py-3 text-sm",
                  messageType === "success"
                    ? "border-border bg-secondary/50 text-secondary-foreground"
                    : "border-destructive/30 bg-destructive/8 text-destructive",
                )}
              >
                {message}
              </div>
            )}
          </div>
      </AuthShell>
    );
  }

  return (
    <AuthShell
      brandLabel="School"
      title={copy.brandPanelTitle}
      subtitle={copy.brandPanelSubtitle}
      features={copy.brandPanelFeatures}
    >
        <div className="space-y-6 rounded-2xl border border-border bg-card p-8 shadow-lg shadow-black/5 animate-card-scale-in">
          {/* Header */}
          <div className="space-y-1">
            <h1 className="font-heading text-2xl font-semibold tracking-tight">
              {mode === "login" ? copy.loginTitle : copy.registerTitle}
            </h1>
            <p className="text-sm text-muted-foreground">
              {mode === "login" ? copy.loginSubtitle : copy.registerSubtitle}
            </p>
          </div>

          {/* Forms */}
          {mode === "login" ? (
            <form
              onSubmit={loginForm.handleSubmit((data) => loginMutation.mutate(data))}
              className="space-y-4"
            >
              <div className="space-y-1.5">
                <Label htmlFor="login-email">{copy.email}</Label>
                <Input
                  id="login-email"
                  {...loginForm.register("email")}
                  type="email"
                  className={FIELD_CLASS}
                  placeholder="usuario@example.com"
                  aria-label={copy.email}
                  aria-invalid={!!loginForm.formState.errors.email}
                />
                {loginForm.formState.errors.email && (
                  <p className={ERROR_TEXT_CLASS} role="alert">{loginForm.formState.errors.email.message}</p>
                )}
              </div>

              <div className="space-y-1.5">
                <Label htmlFor="login-password">{copy.password}</Label>
                <Input
                  id="login-password"
                  {...loginForm.register("password")}
                  type="password"
                  className={FIELD_CLASS}
                  placeholder="••••••••"
                  aria-label={copy.password}
                  aria-invalid={!!loginForm.formState.errors.password}
                />
                {loginForm.formState.errors.password && (
                  <p className={ERROR_TEXT_CLASS} role="alert">{loginForm.formState.errors.password.message}</p>
                )}
              </div>

              <Button
                type="submit"
                disabled={loginMutation.isPending}
                className="w-full"
                aria-label={copy.loginAction}
              >
                {loginMutation.isPending ? copy.loading : copy.loginAction}
              </Button>
            </form>
          ) : (
            <form
              onSubmit={registerForm.handleSubmit((data) => registerMutation.mutate(data))}
              className="space-y-4"
            >
              <div className="space-y-1.5">
                <Label htmlFor="reg-fullName">{copy.fullName}</Label>
                <Input
                  id="reg-fullName"
                  {...registerForm.register("fullName")}
                  type="text"
                  className={FIELD_CLASS}
                  placeholder="Juan Pérez"
                  aria-label={copy.fullName}
                  aria-invalid={!!registerForm.formState.errors.fullName}
                />
                {registerForm.formState.errors.fullName && (
                  <p className={ERROR_TEXT_CLASS} role="alert">{registerForm.formState.errors.fullName.message}</p>
                )}
              </div>

              <div className="space-y-1.5">
                <Label htmlFor="reg-email">{copy.email}</Label>
                <Input
                  id="reg-email"
                  {...registerForm.register("email")}
                  type="email"
                  className={FIELD_CLASS}
                  placeholder="usuario@example.com"
                  aria-label={copy.email}
                  aria-invalid={!!registerForm.formState.errors.email}
                />
                {registerForm.formState.errors.email && (
                  <p className={ERROR_TEXT_CLASS} role="alert">{registerForm.formState.errors.email.message}</p>
                )}
              </div>

              <div className="space-y-1.5">
                <Label htmlFor="reg-password">{copy.password}</Label>
                <Input
                  id="reg-password"
                  {...registerForm.register("password")}
                  type="password"
                  className={FIELD_CLASS}
                  placeholder="••••••••"
                  aria-label={copy.password}
                  aria-invalid={!!registerForm.formState.errors.password}
                />
                {copy.passwordHint && (
                  <p className="text-xs text-muted-foreground">{copy.passwordHint}</p>
                )}
                {registerForm.formState.errors.password && (
                  <p className={ERROR_TEXT_CLASS} role="alert">{registerForm.formState.errors.password.message}</p>
                )}
              </div>

              <div className="space-y-1.5">
                <Label htmlFor="reg-role">{copy.role}</Label>
                <select
                  id="reg-role"
                  {...registerForm.register("role")}
                  className={SELECT_CLASS}
                  aria-label={copy.role}
                >
                  <option value="student">{copy.roleStudent}</option>
                  <option value="teacher">{copy.roleTeacher}</option>
                  <option value="parent">{copy.roleParent}</option>
                </select>
                {registerForm.formState.errors.role && (
                  <p className={ERROR_TEXT_CLASS} role="alert">{registerForm.formState.errors.role.message}</p>
                )}
              </div>

              {registerRole === "parent" && (
                <div className="space-y-3 rounded-xl border border-border bg-muted/20 p-4">
                  <div className="space-y-1.5">
                    <Label htmlFor="reg-student-search">{copy.studentSearchLabel}</Label>
                    <Input
                      id="reg-student-search"
                      value={studentSearch}
                      onChange={(event) => setStudentSearch(event.target.value)}
                      type="text"
                      className={FIELD_CLASS}
                      placeholder={copy.studentSearchPlaceholder}
                      aria-label={copy.studentSearchLabel}
                    />
                  </div>

                  <div className="space-y-1.5">
                    <Label htmlFor="reg-student-select">{copy.studentRepresentativeEmail}</Label>
                    <input type="hidden" {...registerForm.register("representedStudentEmail")} />
                    <select
                      id="reg-student-select"
                      value={representedStudentEmail}
                      onChange={(event) =>
                        registerForm.setValue("representedStudentEmail", event.target.value, { shouldValidate: true })
                      }
                      className={SELECT_CLASS}
                      aria-label={copy.studentRepresentativeEmail}
                    >
                      <option value="">{copy.studentSelectPlaceholder}</option>
                      {filteredRegisterStudents.map((student) => (
                        <option key={student.email} value={student.email}>
                          {student.label}
                        </option>
                      ))}
                    </select>
                    {registerOrganizationSlug && filteredRegisterStudents.length === 0 && (
                      <p className="text-xs text-muted-foreground">{copy.noStudentsFound}</p>
                    )}
                    <p className="text-xs text-muted-foreground">{copy.studentRepresentativeEmailHint}</p>
                    {registerForm.formState.errors.representedStudentEmail && (
                      <p className={ERROR_TEXT_CLASS} role="alert">
                        {registerForm.formState.errors.representedStudentEmail.message}
                      </p>
                    )}
                  </div>
                </div>
              )}

              {organizations.length > 0 && (
                <div className="space-y-1.5">
                  <Label htmlFor="reg-org">{copy.organization}</Label>
                  <select
                    id="reg-org"
                    {...registerForm.register("organizationSlug", {
                      onChange: () => {
                        setStudentSearch("");
                        registerForm.setValue("representedStudentEmail", "");
                      },
                    })}
                    className={SELECT_CLASS}
                    aria-label={copy.organization}
                  >
                    <option value="">{copy.organizationPlaceholder}</option>
                    {organizations.map((org) => (
                      <option key={org.slug} value={org.slug}>
                        {org.name}
                      </option>
                    ))}
                  </select>
                  {copy.organizationHint && (
                    <p className="text-xs text-muted-foreground">{copy.organizationHint}</p>
                  )}
                  {registerForm.formState.errors.organizationSlug && (
                    <p className={ERROR_TEXT_CLASS} role="alert">
                      {registerForm.formState.errors.organizationSlug.message}
                    </p>
                  )}
                </div>
              )}

              <Button
                type="submit"
                disabled={registerMutation.isPending}
                className="w-full"
                aria-label={copy.registerAction}
              >
                {registerMutation.isPending ? copy.loading : copy.registerAction}
              </Button>
            </form>
          )}

          {/* Feedback message */}
          {message && (
            <div
              role="status"
              aria-live="polite"
              className={cn(
                "rounded-lg border px-4 py-3 text-sm",
                messageType === "success"
                  ? "border-border bg-secondary/50 text-secondary-foreground"
                  : "border-destructive/30 bg-destructive/8 text-destructive",
              )}
            >
              {message}
            </div>
          )}

          {/* Mode switcher */}
          <Button
            variant="ghost"
            onClick={() => switchMode(mode === "login" ? "register" : "login")}
            className="w-full text-sm text-muted-foreground"
            aria-label={mode === "login" ? copy.switchToRegister : copy.switchToLogin}
          >
            {mode === "login" ? copy.switchToRegister : copy.switchToLogin}
          </Button>
        </div>
    </AuthShell>
  );
}
