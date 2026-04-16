"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { useMutation, useQuery } from "@tanstack/react-query";
import { Button } from "@/components/ui/button";
import { TopControlsHeader } from "@/components/shared/TopControlsHeader";
import { useLanguage } from "@/providers/LanguageProvider";
import { UI_COPY } from "@/lib/ui-copy";

type AuthMode = "login" | "register";
type UserRole = "student" | "teacher" | "parent";

interface LoginInput {
  email: string;
  password: string;
}

interface RegisterInput extends LoginInput {
  fullName: string;
  role: UserRole;
}

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

interface AuthPageProps {
  initialMode?: AuthMode;
}

export function AuthPage({ initialMode = "login" }: AuthPageProps) {
  const router = useRouter();
  const { language } = useLanguage();
  const copy = UI_COPY[language].auth;

  const [mode, setMode] = useState<AuthMode>(initialMode);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [fullName, setFullName] = useState("");
  const [role, setRole] = useState<UserRole>("student");
  const [message, setMessage] = useState("");
  const [messageType, setMessageType] = useState<"success" | "error" | "">("");

  const { data: currentUser } = useQuery({
    queryKey: ["auth:me"],
    queryFn: async () => {
      const res = await fetch("/api/auth/me");
      if (!res.ok) return null;
      return res.json() as Promise<AuthResponse>;
    },
    retry: false,
  });

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
        setEmail("");
        setPassword("");
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
    mutationFn: async (input: RegisterInput) => {
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
        setEmail("");
        setPassword("");
        setFullName("");
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

  if (currentUser?.data) {
    return (
      <div className="min-h-screen bg-linear-to-b from-background via-secondary/30 to-accent/16 px-4 py-6 sm:px-6 sm:py-8">
        <div className="mx-auto w-full max-w-5xl space-y-6">
          <TopControlsHeader brandLabel="School" />

          <div className="flex justify-center">
            <div className="w-full max-w-md space-y-6 rounded-3xl border border-primary/15 bg-card/95 p-6 shadow-xl shadow-primary/10">
              <div className="space-y-2">
                <h1 className="text-2xl font-semibold text-foreground">Sesión activa</h1>
                <p className="text-sm text-muted-foreground">Estás autenticado como:</p>
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
                <Button
                  onClick={handleLogout}
                  variant="outline"
                  className="flex-1"
                  aria-label="Cerrar sesión"
                >
                  Cerrar sesión
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
                {mode === "login"
                  ? copy.loginSubtitle
                  : copy.registerSubtitle}
              </p>
            </div>

            <form
              onSubmit={(e) => {
                e.preventDefault();
                if (mode === "login") {
                  loginMutation.mutate({ email, password });
                } else {
                  registerMutation.mutate({ email, password, fullName, role });
                }
              }}
              className="space-y-4"
            >
              {mode === "register" && (
                <div>
                  <label className="block text-sm font-medium text-foreground" aria-label={copy.fullName}>
                    {copy.fullName}
                  </label>
                  <input
                    type="text"
                    value={fullName}
                    onChange={(e) => setFullName(e.target.value)}
                    required={mode === "register"}
                    className="mt-1 w-full rounded-xl border border-input bg-background px-3 py-2 text-foreground placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
                    placeholder="Juan Pérez"
                    aria-label={copy.fullName}
                  />
                </div>
              )}

              <div>
                <label className="block text-sm font-medium text-foreground" aria-label={copy.email}>
                  {copy.email}
                </label>
                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value.toLowerCase())}
                  required
                  className="mt-1 w-full rounded-xl border border-input bg-background px-3 py-2 text-foreground placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
                  placeholder="usuario@example.com"
                  aria-label={copy.email}
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-foreground" aria-label={copy.password}>
                  {copy.password}
                </label>
                <input
                  type="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  required
                  className="mt-1 w-full rounded-xl border border-input bg-background px-3 py-2 text-foreground placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
                  placeholder="••••••••"
                  aria-label={copy.password}
                />
                {mode === "register" && (
                  <p className="mt-1 text-xs text-muted-foreground">
                    {copy.passwordHint}
                  </p>
                )}
              </div>

              {mode === "register" && (
                <div>
                  <label className="block text-sm font-medium text-foreground" aria-label={copy.role}>
                    {copy.role}
                  </label>
                  <select
                    value={role}
                    onChange={(e) => setRole(e.target.value as UserRole)}
                    className="mt-1 w-full rounded-xl border border-input bg-background px-3 py-2 text-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
                    aria-label={copy.role}
                  >
                    <option value="student">{copy.roleStudent}</option>
                    <option value="teacher">{copy.roleTeacher}</option>
                    <option value="parent">{copy.roleParent}</option>
                  </select>
                </div>
              )}

              <Button
                type="submit"
                disabled={loginMutation.isPending || registerMutation.isPending}
                className="w-full"
                aria-label={mode === "login" ? copy.loginAction : copy.registerAction}
              >
                {loginMutation.isPending || registerMutation.isPending
                  ? copy.loading
                  : mode === "login"
                    ? copy.loginAction
                    : copy.registerAction}
              </Button>
            </form>

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
              onClick={() => {
                setMode(mode === "login" ? "register" : "login");
                setMessage("");
              }}
              className="w-full text-sm text-muted-foreground hover:text-foreground"
              aria-label={mode === "login" ? copy.switchToRegister : copy.switchToLogin}
            >
              {mode === "login"
                ? copy.switchToRegister
                : copy.switchToLogin}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
