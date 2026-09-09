# App-Censo - Developer Agent Guidelines

## 1. Project Overview & Tech Stack
App-Censo is a field survey and data collection web application featuring GPS geolocation, role-based authentication, interactive map tracking, and Excel reporting.

- **Framework**: Next.js (App Router, React Server/Client Components)
- **Language**: TypeScript (strict mode, zero `any`)
- **Styling**: Tailwind CSS (modern, minimal, mobile-first responsive design)
- **Backend & Auth**: Supabase (Supabase Auth, PostgreSQL, Row Level Security)
- **Validation**: Zod (schemas centralized in `src/schemas/`)
- **Icons**: Lucide React
- **Data Export**: xlsx (SheetJS)

---

## 2. Core Development Rules (Strict)

1. **Incremental & Modular Execution**:
   - Make single, focused changes. Do not bundle unrelated refactors into a task.
   - Separate concerns cleanly: UI components (`src/components/`), schemas (`src/schemas/`), types (`src/types/`), and utilities (`src/lib/`).

2. **Always Ask Before Overwriting**:
   - Before modifying an existing file, request the current file contents if not already provided or in context.
   - Do not guess imports or remove existing user styling/functions without permission.

3. **Type Safety & Zod First**:
   - All forms must be validated via centralized Zod schemas before database submission.
   - When extracting Zod errors, use `resultado.error.issues` for type safety.
   - Shared domain types must live in `src/types/index.ts`.

4. **Authentication & Roles**:
   - Handle sessions using official `@supabase/supabase-js` auth methods (`onAuthStateChange`, `signInWithPassword`, `signOut`).
   - Roles are managed via `user_metadata.role`:
     - `admin`: Access to Form, Map, Global Metrics, and Excel Export.
     - `encuestador`: Access only to the survey submission form.

---

## 3. Responsiveness & Mobile-First Standards (Field Work Optimized)

The application is heavily used in the field via mobile devices (smartphones and tablets) under bright light conditions:

- **Mobile-First Approach**:
  - Always design base classes for mobile screens (`w-full`, `flex-col`, `gap-3`) and scale up using breakpoint prefixes (`sm:`, `md:`, `lg:`).
  - Multi-column grids (like Cédula / Teléfono) must stack cleanly or use proportional gaps (`grid-cols-1 sm:grid-cols-2 gap-3`).
  - No horizontal scrolling (`overflow-x-hidden` on main layouts).

- **Touch & Accessibility Target Sizes**:
  - Minimum touch target for all buttons and interactive elements is `44px` (e.g., `py-3` or `py-3.5` on mobile).
  - Input font sizes must be at least `text-base` (16px) on mobile inputs to prevent automatic iOS/Android browser zooming.

- **Adaptive Headers & Navigation**:
  - Headers must collapse into stacked or wrapped layouts on mobile (`flex-col sm:flex-row`).
  - Tab bars and action buttons must expand to full width on narrow screens or use scrollable/flex-wrapped containers.

---

## 4. UI/UX & Design System (Modern SaaS Aesthetic)

When creating or modifying components, adhere to this design language:

- **Color Palette**:
  - **Backgrounds**: Soft Slate/Zinc gradients (`bg-gradient-to-br from-slate-50 via-gray-50 to-slate-100` in light mode).
  - **Surfaces/Cards**: Clean white (`bg-white`), subtle borders (`border border-slate-200/80`), refined elevations (`shadow-sm`, `shadow-md` on hover).
  - **Primary Action (Brand)**: Vibrant Blue / Indigo (`bg-blue-600 hover:bg-blue-700 active:bg-blue-800`).
  - **Success / Positive**: Emerald (`bg-emerald-600`, badges in `bg-emerald-50 text-emerald-700 border border-emerald-200`).
  - **Warnings / Error**: Crimson / Rose (`text-rose-600`, inputs `border-rose-500 bg-rose-50/20`).
  - **Typography**: Dark slate (`text-slate-900` for titles, `text-slate-600` for body, `text-slate-400` for captions/icons).

- **Form & Input Guidelines**:
  - Rounded corners: `rounded-2xl` for main cards/modals, `rounded-xl` or `rounded-lg` for inputs/buttons.
  - Interactive states: Smooth transitions (`transition-all duration-150`), clear focus rings (`focus:ring-2 focus:ring-blue-600/20 focus:border-blue-600 outline-none`).
  - Responsive padding: `p-4 sm:p-6 md:p-8` for forms and layout wrappers.

- **Modals & Overlays**:
  - Center modals with screen safety margins (`p-4`).
  - Backdrop: `backdrop-blur-sm bg-black/40`.
  - Animate modals smoothly (`animate-in fade-in zoom-in-95 duration-150`).

---

## 5. Prompting Instructions for the Agent
When executing user requests:
1. Identify the exact file(s) involved.
2. Confirm the proposed approach before writing large boilerplate.
3. Provide complete, paste-ready TypeScript/React code blocks without leaving `// ... rest of code` placeholders.
4. Ensure responsive classes (`sm:`, `md:`) and modern Tailwind palette are always included.