# Design: EduSchool — SaaS Escolar Multi-Tenant

## Visual Direction

- **Product tone**: professional, trustworthy, warm-academic
- **Density mode**: default (dashboard) / comfortable (public landing)
- **Radius profile**: sm (inputs, chips) → md (cards, botones) → lg (panels) → xl (hero sections)
- **Theme**: dual — light default, dark opcionalmente activable por el usuario

---

## Token Decisions

### Spacing Scale (8pt system)

- Base unit: `8px`
- Valid values: `4, 8, 12, 16, 24, 32, 40, 48, 64`

| Área                     | Valor    |
|--------------------------|----------|
| Page container padding   | 24px desktop / 16px tablet / 12px mobile |
| Card padding             | 16px default / 24px hero cards |
| Section gap              | 24–32px  |
| Form row gap             | 16px     |
| Dashboard row gap        | 8–12px   |
| Table toolbar gap        | 12px     |

### Typography

- **Font heading**: Geist (Inter fallback) — moderno, limpio, sin serifa
- **Font body**: Geist — consistente, legible en dashboards
- **Base body size**: 14px / line-height 22px (dashboard) — 16px / 24px (landing pública)
- **Numeric data**: `font-variant-numeric: tabular-nums` — siempre en tablas y KPIs

| Token role | Size     | Weight | Uso                           |
|------------|----------|--------|-------------------------------|
| display    | 36–48px  | 600    | Hero headline landing         |
| headline   | 28–36px  | 600    | Page titles                   |
| title      | 18–22px  | 500-600| Section headings, card titles |
| body       | 14–16px  | 400    | Contenido general             |
| label      | 12–13px  | 500    | Etiquetas, metadatos, captions|
| caption    | 11px     | 400    | Texto secundario denso        |

- Máximo 4 tamaños activos por pantalla
- Weight policy: 400 (body), 500 (label/title emphasis), 600 (heading único por sección)

### Shape and Elevation

| Token       | Valor  | Uso                              |
|-------------|--------|----------------------------------|
| radius-xs   | 4px    | Inputs, chips, badges            |
| radius-sm   | 6px    | Botones, small tags              |
| radius-md   | 8px    | Cards, popovers, selects         |
| radius-lg   | 12px   | Dialogs, drawers, modals         |
| radius-xl   | 16px   | Landing sections, hero cards     |
| radius-2xl  | 24px   | Hero panel principal             |

- Max 3 niveles de radius por pantalla
- Border strategy: `border-border` sobre fondos neutros; `border-primary/20` en hover/focus
- Elevation: preferir `border + shadow-sm` — nada dramático en dashboard

### Color Semantics

#### Brand Primary — Azul educativo (oklch ~0.57 h:257)
- Acciones principales, links, focus rings, progreso
- NO usar para decoración — solo para guidance y acción

#### Functional Colors
| Estado      | Token           | Uso                          |
|-------------|-----------------|------------------------------|
| success     | oklch(0.65 0.18 150) | Notas aprobadas, pagos OK  |
| warning     | oklch(0.78 0.16 85)  | Avisos, deudas pendientes  |
| error       | oklch(0.58 0.24 27)  | Errores, notas desaprobadas|
| info        | oklch(0.62 0.14 220) | Información neutral        |

- Los colores funcionales son CONSTANTES — no redefinir por módulo

#### Neutral Ramp (superficie → texto)
| Rol              | Light             | Dark              |
|------------------|-------------------|-------------------|
| Background       | oklch(0.985 0.006 240) | oklch(0.20 0.028 255) |
| Surface/Card     | oklch(0.995 0.004 240) | oklch(0.255 0.03 255) |
| Border           | oklch(0.89 0.018 240)  | oklch(0.36 0.03 248/70%) |
| Text primary     | oklch(0.245 0.03 248)  | oklch(0.95 0.01 240) |
| Text muted       | oklch(0.53 0.035 240)  | oklch(0.76 0.018 240) |

---

## Layout Blueprint

### Public Landing
- Shell: header flotante + contenido centrado + footer
- Max-width contenido: `1024px` (max-w-5xl)
- Padding: `px-6 sm:px-12`
- Secciones: cards redondeados `rounded-3xl` separados con `gap-8 sm:gap-12`
- Grid hero: `lg:grid-cols-[1.05fr_0.95fr]`

### Dashboard (admin / teacher / parent / student)
- Shell: sidebar fijo (240px) + topbar (56px) + content fluid
- Content padding: `p-6` (desktop) / `p-4` (tablet)
- Grid KPI: `grid-cols-2 lg:grid-cols-4`
- Max-width contenido: sin límite (100% del área disponible)

### Auth Pages
- Shell: full-height centrado con decoración lateral en desktop
- Max-width form: `400px`
- Padding card: `p-8`

---

## Component Patterns

### Tabla (DataTable)
- Header sticky para listas largas
- Columnas numéricas: right-aligned, `tabular-nums`
- Row actions: trailing column consistente
- Hover: `bg-muted/50`
- Selección: `bg-primary/8`
- Empty state: siempre con ilustración + texto + CTA

### Formularios
- Labels siempre visibles (NUNCA placeholder-only)
- Campos agrupados en cards con título de sección
- Validación inline: debajo del campo en color `destructive`
- Errores de submit: banner al top del form
- Loading state: skeleton o spinner en botón submit

### Cards KPI (Dashboard)
- Estructura fija: [ícono/trend] [title] [valor principal] [delta] [período]
- Colores de delta: solo semánticos (success/destructive/muted)
- Hover: `shadow-md` + `border-primary/20`

### Navigation (Dashboard)
- Primary IA: sidebar izquierdo colapsable
- Secondary: topbar con búsqueda + usuario + notificaciones
- Breadcrumb: en páginas con jerarquía (detalle de alumno, etc.)

### Empty / Error / Loading
- Empty: ícono + título + descripción + CTA (siempre los 4)
- Error: ícono de error + mensaje + botón reintentar
- Loading: skeleton que replica la forma del contenido real

---

## Accessibility Rules

- Contrast mínimo: WCAG AA (4.5:1 texto, 3:1 UI components)
- Focus: outline visible `2px ring offset 2px` en modo keyboard
- Hit area mínimo: `44px × 44px` en touch (comfortable density)
- `aria-label` en español para todos los controles sin texto visible
- No depender del color solo para transmitir estado (ícono + texto también)

---

## Motion Rules

| Tipo            | Duración | Easing              |
|-----------------|----------|---------------------|
| Micro (hover)   | 120ms    | ease-out            |
| Standard        | 180ms    | ease-out            |
| Panel / Dialog  | 240ms    | ease-out (enter)    |
| Exit            | 160ms    | ease-in             |
| Page transition | 300ms    | ease-in-out         |

- Una sola familia de easing por producto
- Motion reservado para clarificar cambios de estado
- Dashboard: NO parallax, NO animaciones decorativas de fondo
- Landing pública: orbs y gradientes SOLO si no afectan rendimiento
- `prefers-reduced-motion: reduce` → remover todas las animaciones

---

## Do / Don't

### ✅ Do
- Usar `color-mix()` para variaciones de opacidad sobre tokens
- `tabular-nums` en todos los valores numéricos de tablas/KPIs
- Validar siempre con Zod antes de mostrar datos al usuario
- Mantener densidad consistente dentro de una misma vista
- Usar skeleton loaders que repliquen el contenido real
- Aria-labels en español en todos los controles sin texto

### ❌ Don't
- Hardcodear colores (`#3b82f6`) — siempre tokens
- Usar `any` o `unknown` sin validación
- Poner lógica de negocio en componentes UI
- Usar más de 3 radii diferentes en una misma pantalla
- Múltiples variantes de sombra en un mismo módulo
- Definir colores funcionales distintos por feature (error es error siempre)
- Placeholder-only labels en formularios
- Animaciones que duren más de 400ms en dashboard

---

## Fuentes y Assets

### Recomendación tipográfica

```tsx
// src/app/layout.tsx — instalar con next/font
import { Geist, Geist_Mono } from "next/font/google";

const fontSans = Geist({ subsets: ["latin"], variable: "--font-sans" });
const fontMono = Geist_Mono({ subsets: ["latin"], variable: "--font-mono" });
```

- `Geist` reemplaza el sans genérico — lectura excelente en dashboards y landing
- `Geist_Mono` para código y datos técnicos
- Fallback: `ui-sans-serif, system-ui, sans-serif`

---

## Módulos y Paleta por Rol

| Módulo      | Color de acento sugerido     | Ícono sugerido     |
|-------------|------------------------------|---------------------|
| Alumnos     | primary (azul)               | GraduationCap       |
| Cursos      | secondary (teal)             | BookOpen            |
| Notas       | chart-3 (amber)              | ClipboardList       |
| Pagos       | success (verde)              | CreditCard          |
| Noticias    | accent (warm amber)          | Newspaper           |
| Usuarios    | muted                        | Users               |
| Config      | muted                        | Settings            |
