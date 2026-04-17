"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useMutation, useQuery } from "@tanstack/react-query";
import { Button } from "@/components/ui/button";
import { TopControlsHeader } from "@/components/shared/TopControlsHeader";
import { useLanguage } from "@/providers/LanguageProvider";
import { UI_COPY } from "@/lib/ui-copy";
import { loginSchema, registerUserSchema, type LoginInput, type RegisterUserInput } from "@/modules/auth/auth.schema";
import type { PublicOrganizationItem } from "@/modules/organizations/organization.types";

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

interface AuthPageProps {
  initialMode?: AuthMode;
}

const INPUT_CLASS =
  "mt-1 w-full rounded-xl border border-input bg-background px-3 py-2 text-foreground placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring";

const SELECT_CLASS =
  "mt-1 w-full rounded-xl border border-input bg-background px-3 py-2 text-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring";

const ERROR_TEXT_CLASS = "mt-1 text-xs text-destructive";

export function AuthPage({ initialMode = "login" }: AuthPageProps) {
  const router = useRouter();
  const { language } = useLanguage();
  const copy = UI_COPY[language].auth;

  const [mode, setMode] = useState<AuthMode>(initialMode);
  const [message, setMessage] = useState("");
  const [messageType, setMessageType] = useState<"success" | "error" | "">("");

  const loginForm = useForm<LoginInput>({
    resolver: zodResolver(loginSchema),
    defaultValues: { email: "", password: "" },
  });

  const registerForm = useForm<RegisterUserInput>({
    resolver: zodResolver(registerUserSchema),
    defaultValues: { fullName: "", email: "", password: "", role: "student", organizationSlug: "" },
  });

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
      <div className="min-h-screen bg-linear-to-b from-background via-secondary/30 to-accent/16 px-4 py-6 sm:px-6 sm:py-8">
        <div className="mx-auto w-full max-w-5xl space-y-6">
          <TopControlsHeader brandLabel="School" />

          <div className="flex justify-center">
            <div className="w-full max-w-md space-y-6 rounded-3xl border border-primary/15 bg-card/95 p-6 shadow-xl shadow-primary/10">
              <div className="space-y-2">
                <h1 className="text-2xl font-semibold text-foreground">Sesion activa</h1>
                <p className="text-sm text-muted-foreground">Estas autenticado como:</p>
              </div>

              <div className="space-y-3 rounded-2xl border border-secondary/30 bg-secondary/30 p-4">
                <p className="text-sm text-foreground">
                  <span className="font-semibold">Nombre:</span> {currentUser.data.fullName}
                </p>
                <p className="text-sm text-foreground">
                  <span className="font-semibold">Email:</span> {currentUser.data.email}
                </p>
                <p className="text-sm text-foreground">
                  <span className="font-semibold">Rol:</span>{" "}
                  <span className="inline-block rounded-full border border-primary/20 bg-primary/10 px-2 py-1 text-xs font-semibold uppercase text-primary">
                    {currentUser.data.role}
                  </span>
                </p>
              </div>

              <div className="flex gap-2">
                <Button onClick={() => router.push("/dashboard")} className="flex-1" aria-label="Ir al dashboard">
                  Dashboard
                </Button>
                <Button onClick={handleLogout} variant="outline" className="flex-1" aria-label="Cerrar sesion">
                  Cerrar sesion
                </Button>
              </div>

              <Link href="/" className="block text-center text-sm text-muted-foreground hover:text-foreground">
                Ir al inicio
              </Link>

              <div className="space-y-3 border-t border-border pt-4">
                <p className="text-sm font-semibold text-foreground">Probar endpoint protegido:</p>
                <div className="space-y-2">
                  <Button
                    variant="outline"
                    className="w-full"
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
              </div>

              {message && (
                <div
                  className={`rounded p-3 text-sm ${
                    messageType === "success"
                      ? "border border-border bg-secondary text-secondary-foreground"
                      : "border border-destructive/30 bg-destructive/10 text-destructive"
                  }`}
                >
                  {message}
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-linear-to-b from-background via-secondary/30 to-accent/16 px-4 py-6 sm:px-6 sm:py-8">
      <div className="mx-auto w-full max-w-5xl space-y-6">
        <TopControlsHeader brandLabel="School" />

        <div className="flex justify-center">
          <div className="w-full max-w-md space-y-6 rounded-3xl border border-primary/15 bg-card/95 p-6 shadow-xl shadow-primary/10">
            <div className="space-y-2">
              <h1 className="text-2xl font-semibold text-foreground">
                {mode === "login" ? copy.loginTitle : copy.registerTitle}
              </h1>
              <p className="text-sm text-muted-foreground">
                {mode === "login" ? copy.loginSubtitle : copy.registerSubtitle}
              </p>
            </div>

            {mode === "login" ? (
              <form
                onSubmit={loginForm.handleSubmit((data) => loginMutation.mutate(data))}
                className="space-y-4"
              >
                <div>
                  <label className="block text-sm font-medium text-foreground">{copy.email}</label>
                  <input
                    {...loginForm.register("email")}
                    type="email"
                    className={INPUT_CLASS}
                    placeholder="usuario@example.com"
                    aria-label={copy.email}
                  />
                  {loginForm.formState.errors.email && (
                    <p className={ERROR_TEXT_CLASS}>{loginForm.formState.errors.email.message}</p>
                  )}
                </div>

                <div>
                  <label className="block text-sm font-medium text-foreground">{copy.password}</label>
                  <input
                    {...loginForm.register("password")}
                    type="password"
                    className={INPUT_CLASS}
                    placeholder="••••••••"
                    aria-label={copy.password}
                  />
                  {loginForm.formState.errors.password && (
                    <p className={ERROR_TEXT_CLASS}>{loginForm.formState.errors.password.message}</p>
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
                <div>
                  <label className="block text-sm font-medium text-foreground">{copy.fullName}</label>
                  <input
                    {...registerForm.register("fullName")}
                    type="text"
                    className={INPUT_CLASS}
                    placeholder="Juan Perez"
                    aria-label={copy.fullName}
                  />
                  {registerForm.formState.errors.fullName && (
                    <p className={ERROR_TEXT_CLASS}>{registerForm.formState.errors.fullName.message}</p>
                  )}
                </div>

                <div>
                  <label className="block text-sm font-medium text-foreground">{copy.email}</label>
                  <input
                    {...registerForm.register("email")}
                    type="email"
                    className={INPUT_CLASS}
                    placeholder="usuario@example.com"
                    aria-label={copy.email}
                  />
                  {registerForm.formState.errors.email && (
                    <p className={ERROR_TEXT_CLASS}>{registerForm.formState.errors.email.message}</p>
                  )}
                </div>

                <div>
                  <label className="block text-sm font-medium text-foreground">{copy.password}</label>
                  <input
                    {...registerForm.register("password")}
                    type="password"
                    className={INPUT_CLASS}
                    placeholder="••••••••"
                    aria-label={copy.password}
                  />
                  <p className="mt-1 text-xs text-muted-foreground">{copy.passwordHint}</p>
                  {registerForm.formState.errors.password && (
                    <p className={ERROR_TEXT_CLASS}>{registerForm.formState.errors.password.message}</p>
                  )}
                </div>

                <div>
                  <label className="block text-sm font-medium text-foreground">{copy.role}</label>
                  <select
                    {...registerForm.register("role")}
                    className={SELECT_CLASS}
                    aria-label={copy.role}
                  >
                    <option value="student">{copy.roleStudent}</option>
                    <option value="teacher">{copy.roleTeacher}</option>
                    <option value="parent">{copy.roleParent}</option>
                  </select>
                  {registerForm.formState.errors.role && (
                    <p className={ERROR_TEXT_CLASS}>{registerForm.formState.errors.role.message}</p>
                  )}
                </div>

                {organizations.length > 0 && (
                  <div>
                    <label className="block text-sm font-medium text-foreground">{copy.organization}</label>
                    <select
                      {...registerForm.register("organizationSlug")}
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
                    <p className="mt-1 text-xs text-muted-foreground">{copy.organizationHint}</p>
                    {registerForm.formState.errors.organizationSlug && (
                      <p className={ERROR_TEXT_CLASS}>{registerForm.formState.errors.organizationSlug.message}</p>
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

            {message && (
              <div
                className={`rounded p-3 text-sm ${
                  messageType === "success"
                    ? "border border-border bg-secondary text-secondary-foreground"
                    : "border border-destructive/30 bg-destructive/10 text-destructive"
                }`}
              >
                {message}
              </div>
            )}

            <button
              onClick={() => switchMode(mode === "login" ? "register" : "login")}
              className="w-full text-sm text-muted-foreground hover:text-foreground"
              aria-label={mode === "login" ? copy.switchToRegister : copy.switchToLogin}
            >
              {mode === "login" ? copy.switchToRegister : copy.switchToLogin}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
