# Digital Welfare Services

**MyWelfare-style Government Digital Service Prototype**

A fully interactive prototype of a government-to-citizen digital service, inspired by publicly
documented information about Ireland's MyWelfare platform. It demonstrates an end-to-end online
benefit application: sign-in, a multi-step application wizard, a demonstration eligibility rules
engine, document upload, declaration, review, submission, application tracking, and a separate
officer/admin case-management portal with an audit trail and notifications.

This is an educational demonstration, not a production system and not affiliated with any
government department or its suppliers. No real personal data is collected, and nothing is sent
to a server — everything lives in your browser's local storage.

## Running it

```bash
cd digital-welfare-services
npm install
npm run dev
```

Then open the printed local URL (typically `http://localhost:5173`).

Other scripts:

```bash
npm run build    # type-checks (tsc -b) and builds a production bundle
npm run preview  # serves the production build locally
npm run lint     # runs oxlint
```

No environment variables, API keys, or backend services are required.

### Trying the full journey quickly

1. From the homepage, click **Start an application** (or **Sign in** → **Continue as demo
   citizen**).
2. On the Personal details step, click **Load demo application** to pre-fill every field and
   upload sample documents for the rest of the journey (Alex Morgan, unemployed, income below the
   demonstration threshold).
3. Step through Employment & income → Eligibility questions (click **Check eligibility &
   continue**) → Document upload → Declaration (tick the confirmation checkbox) → Review → Submit.
4. After submitting, go to **My Applications** or the dashboard to see the application and its
   tracking timeline.
5. Open the **Officer portal** (link in the header, or `/admin`) to see the submitted application
   in the officer dashboard, open its case file at `/admin/case/:id`, and **Approve**, **Reject**,
   **Request information**, or route it for manual review. Return to the citizen dashboard to see
   the status and a new notification reflect the change immediately.

Progress is saved automatically as you move through the application (and on **Save and exit**), so
refreshing or closing the browser and coming back later resumes exactly where you left off.

## Tech stack

- **React 19 + TypeScript + Vite** — build tooling and dev server.
- **Tailwind CSS v4** — styling, via the `@tailwindcss/vite` plugin and CSS-first theme tokens in
  `src/index.css`.
- **React Router** — client-side routing (`src/App.tsx`).
- **Lucide** — icons.
- **`localStorage`** — the only persistence layer; no backend is used or required.

## Architecture

The goal of this prototype is to demonstrate a **configurable service platform**, not seven
hand-built pages. The important pieces:

- **`src/types/index.ts`** — the shared domain model: `WelfareApplication`, `ServiceDefinition`,
  `StepConfig`, `FieldConfig`, `AuditEvent`, `AppNotification`, etc.
- **`src/config/services/*`** — each government service (Employment Support Benefit, Housing
  Support, Child Benefit) is defined as **data**: its steps, fields, validation rules and required
  documents. `employmentSupport.ts` is the fully working example with all seven steps; the other
  two are catalogue-only definitions that prove the same engine can render additional services
  from configuration alone.
- **`src/config/rulesEngine.ts`** — a small, explicitly-labelled **demonstration** eligibility
  rules engine (`evaluateEmploymentSupportEligibility`). It is intentionally simple and is never
  presented as a real legal or benefit determination.
- **`src/pages/application/ApplicationWizard.tsx`** — the reusable **application engine**. It
  reads a service's step configuration and renders the right step UI (form, eligibility, document
  upload, declaration, review, submit) generically, handles validation, autosave, back/continue
  navigation, and routes to submission.
- **`src/services/*`** — a repository/service layer (`applicationService`, `authService`,
  `notificationService`, `caseService`) with an async, Promise-based API
  (`await applicationService.saveApplication(...)`, etc.) that mimics what a real REST/GraphQL
  client would look like. `src/services/storage.ts` is the only module that touches
  `localStorage` directly (with a simulated network delay). **Swapping the mock layer for a real
  backend means rewriting `src/services/*` only — nothing above that layer needs to change.**
- **`src/pages/admin/*`** — the officer/admin portal: a dashboard with received/pending/automatic/
  manual/approved/rejected counts and a case table, and a case-management screen with officer
  actions that append audit events and citizen notifications.
- **`src/pages/Architecture.tsx`** (`/architecture` route, "How the platform works") — a
  conceptual layered-architecture diagram (Citizen → Digital Experience Layer → Application Engine
  → Reusable Services → Rules Engine → API/Integration Layer → Government Systems → Case
  Management), explicitly labelled as **conceptual for this prototype**, not the actual MyWelfare
  architecture.

### Automated vs. manual processing

On submission, `applicationService.submitApplication` re-runs the eligibility rules engine and
records a `ProcessingRoute` (`automatic` or `manual`) alongside the eligibility result. The officer
dashboard surfaces both the eligibility outcome and the route for every submitted application, and
counts them separately in the stats cards — this is the visible demonstration of "some applications
can be processed automatically, the rest are routed for officer review."

### Audit trail

Every meaningful action — creating a draft, completing a step, adding/removing a document,
accepting the declaration, submitting, evaluating eligibility, and every officer action (starting
review, requesting information, approving, rejecting) — appends an `AuditEvent`
(`{ timestamp, actor, action, description }`) to the application. The full history is visible to
both the citizen (application status page) and the officer (case management screen).

## What's simulated vs. what a real deployment would need

This prototype intentionally has **no backend**. Everything below is simulated in the browser and
would need real infrastructure in production:

| Area | In this prototype | In a real deployment |
| --- | --- | --- |
| Identity / sign-in | A "Digital ID" button and a labelled demo account, both of which just set a mock user in `localStorage` | A real government identity/verification service (e.g. an eIDAS-style broker), with MFA and proper session/token management |
| Data storage | `localStorage` in the citizen's own browser (`src/services/storage.ts`) | A real database and API tier, with proper multi-user, multi-device access and backups |
| Document upload | Files are read for name/size/type only; nothing leaves the browser (clearly labelled "Demo mode") | Secure document storage (e.g. blob storage), virus scanning, encryption at rest/in transit |
| Eligibility rules engine | A small hard-coded, clearly-labelled demonstration function | A real, auditable rules/decision engine integrated with authoritative government data sources |
| Automated vs. manual routing | A boolean derived from the demo rules engine | Real workflow/orchestration and case-management systems, likely integrated with the rules engine above |
| Officer/case management | An open `/admin` route with client-side actions, no authentication | A separately authenticated, access-controlled internal application with role-based permissions |
| Notifications | In-app only, stored in `localStorage` | Email/SMS/postal notifications via a notification service, plus in-app |
| Cross-device sync | None — data is per-browser | A real backend so a citizen's progress and status follow them across devices |
| Government system integration | None | Integration layer/APIs to authoritative registers, payment systems, etc. |
| Hosting/infrastructure | Static site, run locally via Vite | Cloud hosting with the scaling, security, monitoring and resilience a public service requires |

## Project structure

```
src/
  types/            Shared domain types
  config/            Service definitions (data) + demonstration rules engine + demo data
  services/          Mock API / repository layer (localStorage-backed, async)
  context/           Auth + notification React context providers
  components/
    ui/              Generic building blocks (Button, Field, Card, Badge, ProgressStepper, ...)
    layout/          Header, footer, notification panel
    application/      Step renderers used by the application engine
  pages/             Route-level pages, including pages/application (citizen wizard) and
                      pages/admin (officer portal)
```

## Notes on this being a prototype

- Illustrative statistics on the landing page (applications this month, % automated, etc.) are
  clearly labelled as illustrative, not live data.
- The "How the platform works" architecture page is explicitly labelled as conceptual for this
  prototype, not a disclosure of MyWelfare's actual internal architecture.
- The eligibility rules engine is explicitly labelled as a demonstration and never produces a
  final legal or benefit determination.
