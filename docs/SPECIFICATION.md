# School Management SaaS — Especificación maestra

> Documento ancla para Spec-Driven Development (SDD). Define la visión, las
> decisiones de arquitectura bloqueadas, el estado actual vs el objetivo, y el
> alcance del MVP por fases. Cada fase se desarrolla como un cambio SDD propio
> (proposal → spec → design → tasks → apply → verify → archive).
>
> Estado: **borrador inicial** · Última actualización: 2026-06

---

## 1. Visión de producto

SaaS multi-tenant de gestión escolar, vendible a colegios y academias. Combina
un sitio público comercial (captación) con paneles privados por rol (operación
académica, financiera y administrativa), totalmente aislados por institución.

**Objetivo de negocio:** vender suscripciones a instituciones educativas. El
éxito del producto depende de tres pilares no negociables: aislamiento real
entre tenants, integridad financiera (pagos/deudas/recibos), y trazabilidad
académica (notas/asistencia/reportes).

---

## 2. Decisiones de arquitectura (BLOQUEADAS)

| Área | Decisión | Por qué |
|------|----------|---------|
| Base de datos | **PostgreSQL + Prisma** | Dominio relacional con integridad transaccional (ACID) para pagos, notas y reportes. MongoDB no garantiza esto sin dolor. |
| Backend | **NestJS** | API dedicada, modular, con guards/interceptors para RBAC y aislamiento multi-tenant; preparada para escala y equipo. |
| Frontend | **Next.js (App Router) + TypeScript + Tailwind + shadcn/ui + TanStack Query** | Ya construido y rediseñado. Se conserva como capa de presentación. |
| Multi-tenancy | **Shared schema + `tenantId`**, aislamiento por **Postgres RLS + middleware de Prisma**; routing por **subdominio** (`escuela1.dominio.com`) | Estándar SaaS: una base, escala a cientos de colegios, encaja con Neon free. Aislamiento por defecto a nivel de DB y middleware, no depende del dev. |
| Pagos / Suscripciones | **Stripe** (SDK + webhooks) | Estándar de la industria, billing y suscripciones de fábrica. |
| Auth | **Auth.js v5** (Next.js) + validación JWT en NestJS guards | $0, Google/Microsoft built-in, battle-tested. MFA diferido a post-MVP (TOTP con `otplib`). |
| Infra | **Vercel** (frontend) + **Railway/Render** (NestJS) + **Neon** (Postgres) + GitHub Actions | Ruta managed/PaaS: mínimo DevOps, arranca gratis, escala pagando. Detalle en §9. |

> ⚠️ **Implicación clave:** pasar de MongoDB a PostgreSQL y de API routes a
> NestJS es un **re-plataformado**, no un parche. El código de datos actual se
> reescribe; el frontend y la UI se conservan.

### 2.1 Arquitectura de código (decidida)

Principios transversales: **Screaming Architecture** (organizar por dominio de
negocio, no por capa técnica) y **monolito modular** (no microservicios en el MVP).

- **Backend (NestJS)** — monolito modular, **Hexagonal/Clean por módulo**:
  cada módulo (`students`, `grades`, `payments`, ...) con `domain/` (entidades +
  ports), `application/` (casos de uso + DTOs) e `infrastructure/` (Prisma
  adapters + controllers). La lógica de negocio NO conoce Prisma ni Nest.
  Cross-cutting: **tenancy** (guard/interceptor + Prisma middleware que scopea
  toda query por `tenantId`), **RBAC** (guards), **auditoría** (interceptor).
- **Frontend (Next.js)** — feature-based + **Atomic Design** +
  **Container/Presentational**: `app/` solo routing; `features/<dominio>/` con
  `components` (presentacional), `containers` (Server Components que traen datos),
  `hooks` (TanStack Query) y `api` (cliente tipado); `components/ui` átomos shadcn.
- **Monorepo (Turborepo)** — `apps/web` (Next) + `apps/api` (NestJS) +
  `packages/shared` (tipos/DTOs/Zod compartidos) + `packages/config`. Contrato
  único front↔back: un cambio de tipo rompe ambos lados en compile-time.
  (Resuelve la decisión abierta §6 #4.)

---

## 3. Estado actual (lo que YA existe)

Construido sobre Next.js + MongoDB (a migrar):

- **Auth**: email/password con JWT propio (`jose`, HS256), cookie de sesión, validación de entorno con zod. RBAC básico por rol.
- **Modelos** (Prisma/Mongo): `organization`, `user` (roles: admin/teacher/parent/student), `teacher`, `parent`, `student`, `course`, `enrollment`, `grade`, `parentStudent`, `news`.
- **Scoping por organización**: los usuarios tienen `organizationId`. Hay base de multi-org, pero **no aislamiento real** (sin subdominios/routing por tenant, sin enforcement a nivel de query).
- **API routes**: `/api/auth/*`, `/api/organizations`, `/api/students/*`, `/api/system/organizations`, `/api/admin/health`.
- **Sitio público**: landing, cursos, noticias, contacto, inscripciones (con formulario). UI rediseñada y on-brand.
- **Panel interno**: dashboard con KPIs/acciones por rol, calificaciones (overview para representante), gestión interna, inscripciones.
- **Portal representante**: vista básica de calificaciones de hijos.
- **CI/CD**: GitHub Actions (gate reutilizable) + Vercel CD + Dependabot.

---

## 4. Alcance del MVP

MVP acordado (vendible a una institución real), en orden de dependencia:

1. **Multi-tenant** — aislamiento real entre instituciones.
2. **Estudiantes** — registro, expediente, representantes, historial.
3. **Profesores** — perfil, materias, horarios.
4. **Cursos** — cursos, secciones, materias, cupos.
5. **Asistencia** — diaria, justificaciones, reportes.
6. **Calificaciones** — exámenes/tareas/proyectos, promedios automáticos, boletín PDF.
7. **Portal de representantes** — notas, asistencia, pagos, notificaciones.
8. **Pagos** — mensualidades, inscripciones, deudas, recibos PDF (Stripe).
9. **Suscripciones** — billing de las instituciones hacia el SaaS (Stripe).

---

## 5. Roadmap por fases (cada fase = un cambio SDD)

| Fase | Nombre | Entrega | Estado actual |
|------|--------|---------|---------------|
| **0** | **Fundación** | Re-plataformado: Postgres + NestJS scaffold; modelo de tenant + aislamiento; spine de auth/RBAC; plan de migración de datos. | ❌ |
| **1** | Núcleo académico | Estudiantes, Profesores, Cursos/Secciones (CRUD, tenant-scoped). | 🟡 (modelos base, sin Postgres ni aislamiento) |
| **2** | Operación diaria | Asistencia + Calificaciones + Boletines PDF. | 🟡 (grade existe; falta asistencia/boletines) |
| **3** | Familia | Portal del Representante + Portal del Estudiante. | 🟡 (overview básico de notas) |
| **4** | Monetización | Pagos (Stripe) + Suscripciones/billing + Panel Super-Admin global. | ❌ |

**Regla de oro:** nada de la Fase 1+ se construye hasta cerrar la Fase 0. El
aislamiento multi-tenant es la base sobre la que se apoya todo lo demás; meterlo
después es rehacer el sistema.

---

## 6. Decisiones abiertas (a resolver en SDD, antes de la Fase 0)

1. ~~**Estrategia de tenancy**~~ → **RESUELTO** (§2): shared schema + `tenantId` + RLS de Postgres + middleware de Prisma; routing por subdominio.
2. ~~**Reutilización vs reescritura**~~ → **RESUELTO**: se portan componentes UI, copy i18n, estilos Tailwind y lógica de presentación. El backend se reescribe desde cero en NestJS + Postgres. Este repo queda como referencia.
3. ~~**Auth**~~ → **RESUELTO** (§2): Auth.js v5 en Next.js (OAuth flows, sesión) + NestJS valida JWT en guards (RBAC, tenant scoping). MFA diferido a post-MVP.
4. ~~**Estructura de repo**~~ → **RESUELTO** (§2.1): monorepo con Turborepo (`apps/web`, `apps/api`, `packages/shared`).
5. ~~**Migración de datos**~~ → **RESUELTO**: arranque limpio en Postgres. Los datos actuales de Mongo son de desarrollo/seed, no de producción. Se recrean seeds para Postgres.

---

## 7. Fuera de alcance del MVP (visión futura, NO ahora)

Diferidos hasta después del MVP, para no diluir el foco:

- Biblioteca (libros/préstamos)
- Exámenes online (banco de preguntas, quiz, corrección automática)
- Recursos académicos (documentos/videos/material)
- Comunicación avanzada: correos masivos, **WhatsApp**, SMS, push
- Blog, testimonios, demo interactiva (landing comercial completa)
- Integraciones: Google Calendar, Google Meet, Zoom
- Analíticas avanzadas del Super-Admin (MRR/Churn detallado) — versión básica sí en Fase 4
- Roles extendidos (Coordinador, Contador) más allá de los del MVP
- API pública + Webhooks para terceros

---

## 8. Roles del sistema (objetivo)

Super Admin (dueño del SaaS) · Director · Coordinador · Profesor · Estudiante ·
Representante · Contador.

> MVP arranca con: **Super Admin, Director (≈ admin actual), Profesor,
> Estudiante, Representante.** Coordinador y Contador se suman después.

---

## 9. Hosting (ruta managed/PaaS — decidida)

La app se hospeda como **tres piezas independientes**, cada una en su mejor casa:

| Pieza | Servicio | Plan dev | Plan prod (con cliente) |
|-------|----------|----------|--------------------------|
| Frontend (Next.js) | **Vercel** | Free Hobby ($0) | Pro si hace falta |
| Backend (NestJS) | **Render** (free, con cold starts) o **Railway** (~$5/mes, sin cold starts) | $0 / $5 | **Railway** ~$5-10/mes |
| Base de datos (Postgres) | **Neon** | Free (scale-to-zero, branching) | Pro ~$19/mes |
| Imágenes/archivos (fotos, recibos PDF, material) | **Cloudflare R2** | Free 10 GB, **egress $0** | $0.015/GB, sin egress |

**Almacenamiento de archivos (R2):** S3-compatible (se usa con `@aws-sdk/client-s3`
apuntando al endpoint de R2). Egress gratis = clave para servir imágenes repetidas.
Aislamiento multi-tenant por keys prefijadas (`tenants/{tenantId}/...`) y acceso vía
**signed URLs** generadas por el backend — el bucket nunca se expone directo.

**Principio dev vs prod:** los free tiers **pausan o se duermen** (Render cold
starts, Supabase pausa a los 7 días). Sirven para construir; **NO** para un
colegio que paga. Presupuesto de producción mínimo realista: **~$25/mes**
(Railway + Neon Pro). Vercel front se mantiene gratis.

**Descartado:** VPS único (Hostinger/Hetzner) — más barato pero te vuelve
sysadmin (seguridad, backups, uptime) de un SaaS con pagos y datos sensibles.
Se reconsidera solo si el costo del PaaS se vuelve un problema a escala.
