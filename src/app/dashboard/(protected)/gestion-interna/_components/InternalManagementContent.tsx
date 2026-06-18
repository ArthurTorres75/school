"use client";

import { useState } from "react";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useLanguage } from "@/providers/LanguageProvider";
import type { ApiSuccessBody } from "@/modules/users/user.types";

interface OrganizationItem {
  id: string;
  name: string;
  slug: string;
}

interface CreateOrganizationPayload {
  name: string;
  slug?: string;
}

interface CreateOrganizationResponse {
  id: string;
  name: string;
  slug: string;
  isActive: boolean;
  createdAt: string;
  updatedAt: string;
}

interface ApiErrorBody {
  success: false;
  message: string;
  errorCode: string;
}

const MANAGEMENT_UI_COPY = {
  es: {
    sectionTitle: "Organizaciones",
    sectionSubtitle: "Alta y listado rápido para operación interna.",
    createTitle: "Crear organización",
    createDescription:
      "Solo usuarios autorizados en SYSTEM_ADMIN_EMAILS pueden crear organizaciones.",
    invalidName: "El nombre debe tener al menos 2 caracteres.",
    nameLabel: "Nombre",
    namePlaceholder: "Colegio San Martín",
    slugLabel: "Slug (opcional)",
    slugPlaceholder: "colegio-san-martin",
    createAction: "Crear organización",
    creatingAction: "Creando...",
    loadError: "No se pudo cargar el listado de organizaciones.",
    emptyState: "Todavía no hay organizaciones registradas.",
    loadingState: "Cargando organizaciones...",
    createdOk: "Organización creada correctamente.",
    genericCreateError: "No se pudo crear la organización.",
    listTitle: "Listado actual",
  },
  en: {
    sectionTitle: "Organizations",
    sectionSubtitle: "Quick create and list flow for internal operations.",
    createTitle: "Create organization",
    createDescription:
      "Only users listed in SYSTEM_ADMIN_EMAILS can create organizations.",
    invalidName: "Name must contain at least 2 characters.",
    nameLabel: "Name",
    namePlaceholder: "San Martin School",
    slugLabel: "Slug (optional)",
    slugPlaceholder: "san-martin-school",
    createAction: "Create organization",
    creatingAction: "Creating...",
    loadError: "Could not load organizations.",
    emptyState: "No organizations found yet.",
    loadingState: "Loading organizations...",
    createdOk: "Organization created successfully.",
    genericCreateError: "Could not create organization.",
    listTitle: "Current list",
  },
} as const;

export function InternalManagementContent() {
  const { language } = useLanguage();
  const queryClient = useQueryClient();
  const [name, setName] = useState("");
  const [slug, setSlug] = useState("");
  const [submitMessage, setSubmitMessage] = useState("");
  const [submitError, setSubmitError] = useState(false);
  const copy = language === "en" ? MANAGEMENT_UI_COPY.en : MANAGEMENT_UI_COPY.es;

  const organizationsQuery = useQuery({
    queryKey: ["organizations:public"],
    queryFn: async () => {
      const response = await fetch("/api/organizations");

      if (!response.ok) {
        throw new Error(copy.loadError);
      }

      const body = (await response.json()) as ApiSuccessBody<OrganizationItem[]>;
      return body.data;
    },
    staleTime: 60 * 1000,
  });

  const createMutation = useMutation({
    mutationFn: async (payload: CreateOrganizationPayload) => {
      const response = await fetch("/api/system/organizations", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(payload),
      });

      const body = (await response.json()) as ApiSuccessBody<CreateOrganizationResponse> | ApiErrorBody;

      if (!response.ok || body.success === false) {
        throw new Error(body.message || copy.genericCreateError);
      }

      return body.data;
    },
    onSuccess: async () => {
      setSubmitMessage(copy.createdOk);
      setSubmitError(false);
      setName("");
      setSlug("");
      await queryClient.invalidateQueries({ queryKey: ["organizations:public"] });
    },
    onError: (error) => {
      setSubmitMessage(error instanceof Error ? error.message : copy.genericCreateError);
      setSubmitError(true);
    },
  });

  const onSubmit = (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();

    const normalizedName = name.trim();
    const normalizedSlug = slug.trim().toLowerCase();

    if (normalizedName.length < 2) {
      setSubmitMessage(copy.invalidName);
      setSubmitError(true);
      return;
    }

    setSubmitMessage("");
    setSubmitError(false);

    createMutation.mutate({
      name: normalizedName,
      slug: normalizedSlug.length > 0 ? normalizedSlug : undefined,
    });
  };

  return (
    <section className="grid gap-4 lg:grid-cols-[1fr_1.25fr]">
      <article className="rounded-2xl border border-border/70 bg-background/75 p-5">
        <header className="space-y-1">
          <h2 className="text-lg font-semibold tracking-tight">{copy.createTitle}</h2>
          <p className="text-sm text-muted-foreground">{copy.createDescription}</p>
        </header>

        <form onSubmit={onSubmit} className="mt-4 space-y-4">
          <div className="space-y-1.5">
            <Label htmlFor="organization-name">{copy.nameLabel}</Label>
            <Input
              id="organization-name"
              value={name}
              onChange={(event) => setName(event.target.value)}
              placeholder={copy.namePlaceholder}
              required
              minLength={2}
            />
          </div>

          <div className="space-y-1.5">
            <Label htmlFor="organization-slug">{copy.slugLabel}</Label>
            <Input
              id="organization-slug"
              value={slug}
              onChange={(event) => setSlug(event.target.value)}
              placeholder={copy.slugPlaceholder}
              autoCapitalize="none"
              autoCorrect="off"
            />
          </div>

          <Button type="submit" disabled={createMutation.isPending} className="w-full">
            {createMutation.isPending ? copy.creatingAction : copy.createAction}
          </Button>

          {submitMessage && (
            <p
              className={[
                "rounded-lg border px-3 py-2 text-sm",
                submitError
                  ? "border-destructive/30 bg-destructive/10 text-destructive"
                  : "border-primary/20 bg-primary/10 text-primary",
              ].join(" ")}
            >
              {submitMessage}
            </p>
          )}
        </form>
      </article>

      <article className="rounded-2xl border border-border/70 bg-background/75 p-5">
        <header className="space-y-1">
          <h2 className="text-lg font-semibold tracking-tight">{copy.listTitle}</h2>
          <p className="text-sm text-muted-foreground">{copy.sectionSubtitle}</p>
        </header>

        {organizationsQuery.isLoading && (
          <p className="mt-4 text-sm text-muted-foreground">{copy.loadingState}</p>
        )}

        {organizationsQuery.isError && (
          <p className="mt-4 rounded-lg border border-destructive/30 bg-destructive/10 px-3 py-2 text-sm text-destructive">
            {(organizationsQuery.error as Error).message || copy.loadError}
          </p>
        )}

        {!organizationsQuery.isLoading && !organizationsQuery.isError && (organizationsQuery.data?.length ?? 0) === 0 && (
          <p className="mt-4 text-sm text-muted-foreground">{copy.emptyState}</p>
        )}

        {(organizationsQuery.data?.length ?? 0) > 0 && (
          <ul className="mt-4 space-y-2">
            {organizationsQuery.data?.map((organization) => (
              <li
                key={organization.id}
                className="rounded-xl border border-border/70 bg-card/70 px-3 py-3"
              >
                <p className="text-sm font-medium text-foreground">{organization.name}</p>
                <p className="text-xs text-muted-foreground">/{organization.slug}</p>
              </li>
            ))}
          </ul>
        )}
      </article>
    </section>
  );
}