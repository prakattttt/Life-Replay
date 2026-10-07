# Life Replay — AI Agent Instructions

## 1. Project Overview

Life Replay is a private personal memory archive built with Next.js, PostgreSQL, and Drizzle ORM.

The core experience is:

**Capture → Organize → Revisit → Rediscover**

Users should be able to capture a small everyday moment in approximately 10–15 seconds and later rediscover it through their timeline, search, filters, and the "On This Day" feature.

Life Replay is intentionally:

* Personal
* Private
* Calm
* Editorial
* Minimal
* Memory-oriented

Life Replay is **not**:

* A social network
* A productivity tracker
* A task manager
* A traditional long-form diary
* An analytics dashboard

The product should feel like a **personal archive**, not a generic SaaS dashboard.

---

# 2. Core Product Features

## MVP

The MVP includes:

* User registration
* User login
* User logout
* Session-based authentication
* Create moments
* View moments
* Edit moments
* Delete moments
* Moment categories
* Optional image attachment
* Chronological timeline
* Timeline day/month/year navigation
* Category filtering
* Search
* On This Day
* Profile management
* Change password
* Delete account
* Appearance settings
* Notification settings
* Data export
* Privacy settings

### Moment categories

Use these categories unless the product requirements explicitly change:

* Work
* Food
* Music
* Fitness
* Learning
* Ideas
* Personal
* Travel
* Other

---

# 3. Future Features

These are planned but should **not** be implemented unless explicitly requested:

* Mood tracking
* Location
* Tags
* Multiple images per moment
* Voice capture
* AI-assisted recall
* Weekly recaps
* Monthly recaps
* Yearly recaps
* Memory map
* Calendar import
* Photo-library import
* Offline capture
* PWA support
* Email reminders
* Push notifications

Do not prematurely design the architecture around future features if doing so adds unnecessary complexity.

The architecture should remain extensible, but MVP implementation should remain simple.

---

# 4. Technology Stack

Use the following technologies unless the user explicitly changes the stack.

### Framework

* Next.js
* App Router
* TypeScript

### Styling

* Tailwind CSS
* shadcn/ui

### Icons

* Lucide React

### Animation

* Motion / Framer Motion

Prefer the currently installed Motion package/API. Do not introduce another animation library.

### Forms

* React Hook Form

### Validation

* Zod

### Database

* PostgreSQL

### ORM

* Drizzle ORM

### Database tooling

* Drizzle Kit

### Authentication

* Better Auth

### Image storage

* Cloudinary or another explicitly approved object-storage provider

### Package manager

* pnpm

### Additional utilities

Use these where appropriate:

* date-fns for date manipulation
* nuqs for URL/search-parameter state
* next-themes for theme management
* Sonner for notifications

### Optional client-state/server-state libraries

* Zustand — only for genuinely shared client state
* TanStack Query — only where client-side server-state management provides a real benefit

Do not introduce unnecessary libraries.

---

# 5. Architecture

Life Replay is a **single full-stack Next.js application**.

There is no separate Express backend.

Preferred architecture:

```text
Browser
   ↓
Next.js App Router
   ↓
Server Components / Server Actions
   ↓
Better Auth
   ↓
Drizzle ORM
   ↓
PostgreSQL
```

For image uploads:

```text
Client
   ↓
Server Action / approved upload flow
   ↓
Cloudinary
```

Use Route Handlers only when a genuine HTTP endpoint is required.

Do not create API routes simply because an API route feels more familiar.

---

# 6. Server vs Client Components

Next.js Server Components should be the default.

Prefer Server Components for:

* Page-level data fetching
* Timeline data
* Search results
* On This Day
* Dashboard data
* Moment details
* Profile data
* Settings data

Use Client Components only when necessary.

A component should become a Client Component when it requires things such as:

* React state
* Event handlers
* Browser APIs
* Effects
* Interactive UI
* Client-only libraries
* Drag/drop interactions
* Rich client-side animations requiring client execution

Do not add `"use client"` to an entire page when only a small child component needs it.

Prefer:

```text
Server Page
    ↓
Server data
    ↓
Client interactive component
```

over making the entire page client-side.

---

# 7. Data Fetching

Prefer direct server-side database access from Server Components.

Do not create an internal API endpoint solely for a Server Component to call.

Prefer:

```text
Server Component
    ↓
Drizzle
    ↓
PostgreSQL
```

instead of:

```text
Server Component
    ↓
fetch("/api/...")
    ↓
Route Handler
    ↓
Drizzle
    ↓
PostgreSQL
```

Use Route Handlers when there is a real requirement for an HTTP endpoint.

---

# 8. Mutations

Use Server Actions for application mutations whenever appropriate.

Examples:

* Create moment
* Update moment
* Delete moment
* Update profile
* Change password
* Update settings
* Delete account
* Data export initiation

Server Actions must:

1. Authenticate the user.
2. Validate input.
3. Authorize the requested operation.
4. Perform the database operation.
5. Return a predictable result.
6. Handle expected errors safely.

Do not trust the client.

---

# 9. Authentication

Use Better Auth for authentication.

Do not create a second custom authentication system unless explicitly requested.

Authentication is session-based.

Never trust authentication-related information supplied by the client.

For protected operations:

```text
Request
   ↓
Get authenticated session
   ↓
Verify authentication
   ↓
Obtain session.user.id
   ↓
Authorize operation
   ↓
Perform database operation
```

The user's identity must come from the authenticated session.

Never use:

```ts
userId: formData.userId
```

as the source of authorization.

Instead use the authenticated session:

```ts
userId: session.user.id
```

---

# 10. Authorization and Data Isolation

Life Replay contains private personal memories.

Every user's data must be isolated.

Every moment query must be scoped to the authenticated user.

For example, do not query a moment only by its ID:

```ts
eq(moments.id, momentId)
```

when the operation is user-owned.

Prefer:

```ts
and(
  eq(moments.id, momentId),
  eq(moments.userId, session.user.id)
)
```

This prevents users from accessing another user's moment by changing an ID in the URL or request.

Apply this principle to:

* Reading moments
* Updating moments
* Deleting moments
* Searching moments
* Timeline queries
* On This Day queries
* Image operations
* Profile-related data
* Data exports
* Any future user-owned resources

Never assume that hiding an ID in the UI provides security.

Authorization must happen on the server.

---

# 11. Validation

Use Zod for user-controlled input.

Server-side validation is mandatory even when client-side validation exists.

React Hook Form may use the same Zod schema for client-side validation.

Typical flow:

```text
React Hook Form
      ↓
Zod validation
      ↓
Server Action
      ↓
Zod validation again
      ↓
Authorization
      ↓
Database
```

Do not trust client validation.

Validate:

* Text fields
* Categories
* Dates
* IDs
* Query parameters
* File metadata
* Settings values
* Any other user-controlled input

Avoid duplicating validation rules unnecessarily.

---

# 12. Database

Use PostgreSQL with Drizzle ORM.

Database schema should live under:

```text
src/db/
```

Use Drizzle Kit for migrations.

Generated migrations belong under:

```text
drizzle/
```

Do not manually edit generated migrations unless there is a deliberate and documented reason.

Prefer Drizzle's query builder.

Raw SQL may be used when there is a clear technical reason, such as:

* Complex PostgreSQL functionality
* Performance-critical query
* PostgreSQL-specific functionality
* A query that is substantially clearer in SQL

Do not use raw SQL simply because it is familiar.

---

# 13. Database Design

Design the database around actual application requirements.

Avoid speculative tables for future features.

Important MVP concepts include:

```text
User
Session
Account
Verification
Moment
```

Authentication-related tables should follow Better Auth's requirements.

Moment records should contain enough information to support:

* Ownership
* Title
* Description
* Category
* Optional image
* Occurrence date/time
* Creation timestamp
* Update timestamp

Use appropriate PostgreSQL types.

Prefer UUIDs or the project's established identifier strategy consistently.

Do not mix identifier strategies without a reason.

---

# 14. Database Indexing

Add indexes based on actual query patterns.

The application will frequently query moments by:

* User
* Date/time
* Category
* User + date/time
* User + category
* Search-related fields where appropriate

Consider composite indexes for frequently combined filters.

Do not add indexes blindly.

Every index has storage and write-performance costs.

---

# 15. Date and Time Handling

Date handling is critical to Life Replay.

Use `date-fns` for date manipulation unless a more appropriate library is introduced deliberately.

Be careful about:

* Time zones
* User-local calendar dates
* Day boundaries
* Year boundaries
* Daylight saving transitions
* "On This Day"

The "On This Day" feature is based on the user's **calendar date**, not simply a rolling 24-hour period.

For example:

If today is:

```text
October 7, 2026
```

"On This Day" should retrieve moments from:

```text
October 7, 2025
October 7, 2024
October 7, 2023
...
```

It should not simply retrieve moments from the previous 24 hours.

Be deliberate about timezone behavior.

---

# 16. Search

Search must only operate over the authenticated user's moments.

Search should eventually support:

* Title
* Description
* Category
* Date

Do not expose another user's records through search.

For large datasets, consider PostgreSQL-specific indexing/search capabilities rather than loading all moments into memory.

Do not implement client-side filtering of the entire database as the primary search strategy.

---

# 17. Timeline

The timeline is one of the primary product experiences.

It should be:

* Chronological
* Calm
* Easy to scan
* Visually editorial
* Responsive
* Efficient with large numbers of moments

The timeline should support:

* Day navigation
* Month navigation
* Year navigation
* Category filtering
* Pagination or appropriate incremental loading

Do not load the user's entire lifetime archive into the browser unnecessarily.

---

# 18. On This Day

"On This Day" is a signature Life Replay feature.

It should surface historical memories from the same calendar date in previous years.

Results should be grouped by year.

Example:

```text
On This Day

2025
  Finished my portfolio

2024
  Coffee with Alex

2023
  First day at the gym
```

The experience should feel like rediscovering memories rather than browsing an analytics report.

Avoid excessive statistics and dashboard-style presentation.

---

# 19. Images

Moments may optionally contain one image in the MVP.

Images should:

* Be validated before storage.
* Have appropriate file-type restrictions.
* Have reasonable file-size restrictions.
* Be uploaded through a secure server-approved flow.
* Store the remote image URL.
* Store the provider's public ID when deletion is required.

When deleting a moment with an associated image:

1. Authorize the moment.
2. Delete the external image when appropriate.
3. Delete the database record.

Avoid orphaned Cloudinary assets.

Do not expose provider secrets to the client.

---

# 20. Forms

Use React Hook Form for non-trivial forms.

Use Zod with React Hook Form where appropriate.

Forms should provide:

* Clear labels
* Validation feedback
* Loading state
* Disabled state during submission
* Success feedback
* Error feedback
* Accessible controls
* Keyboard support

Do not create unnecessarily complicated form abstractions.

---

# 21. State Management

Use the simplest state solution that solves the problem.

### React state

Use for:

* Local component state
* Modal visibility
* Temporary UI state
* Form-related UI state

### URL state

Use URL/search parameters for state that should be:

* Shareable
* Bookmarkable
* Browser-navigation-friendly
* Represented in the URL

Use `nuqs` when URL state becomes complex.

Examples:

```text
/timeline?year=2026&month=10
/search?q=coffee&category=food
```

### Zustand

Use only for genuinely shared client-side state.

Do not put server data into Zustand merely because Zustand is installed.

### TanStack Query

Use only where client-side server-state behavior provides a meaningful benefit.

Examples:

* Infinite queries
* Optimistic updates
* Interactive client-side data
* Background refetching
* Complex client-driven server state

Do not use TanStack Query for every database query.

---

# 22. UI Design System

Life Replay uses the **Warm Archival Editorial** design language.

The UI should feel:

* Warm
* Personal
* Editorial
* Quiet
* Modern
* Human
* Spacious

Avoid generic SaaS aesthetics.

The personality mix is:

```text
70% Editorial
20% Warm Memory
10% Modern Product
```

---

# 23. Color System

Use the existing CSS variables as the source of truth.

## Light mode

### Backgrounds

```text
background: #FAF9F6
background-secondary: #F3F1EB
background-section: #F7F5F0
```

### Surfaces

```text
surface: #FFFFFF
surface-elevated: #FFFEFC
surface-subtle: #FDFCFА
```

### Primary

```text
teal: #176B67
teal-dark: #12534F
teal-hover: #145E5A
teal-light: #DCEFED
teal-subtle: #EDF7F6
```

### Accent

```text
amber: #D99A3D
amber-dark: #B87A26
amber-light: #FFF1D6
amber-subtle: #FFFAF0
```

### Terracotta

```text
terracotta: #C9785D
terracotta-light: #F5E3DD
```

### Text

```text
foreground: #242321
foreground-secondary: #6E6A63
foreground-muted: #98938A
foreground-disabled: #B8B3AA
```

### Borders

```text
border: #E6E2D9
border-subtle: #EEEAE2
border-strong: #D9D4CA
```

### Semantic

```text
success: #4F8A68
error: #C95C5C
warning: amber
```

---

# 24. Dark Mode

Dark mode must be intentionally designed.

Do not simply invert the light theme.

Use the existing `.dark` design tokens as the source of truth.

Dark mode:

```text
background: #151614
background-secondary: #191B19
background-section: #1C1F1C

surface: #1D1F1C
surface-elevated: #252824
surface-subtle: #2A2E2A
```

Use softened versions of the brand colors.

Avoid harsh pure black backgrounds unless explicitly required.

Avoid pure white text for everything.

Maintain appropriate contrast.

---

# 25. Color Restrictions

Do not introduce:

* Purple
* Violet
* Indigo

as primary design colors.

Existing category colors may use distinct supporting colors when already defined in the design system.

Do not randomly introduce new colors when an existing design token is appropriate.

Prefer semantic tokens:

```text
bg-background
bg-surface
text-foreground
text-foreground-secondary
border-border
text-teal
bg-teal-subtle
```

over hardcoding colors throughout components.

---

# 26. Typography

Primary typeface:

**Plus Jakarta Sans**

Use the existing Next.js font setup.

Fallback:

```text
Inter
system-ui
sans-serif
```

Use typography consistently.

Avoid introducing additional fonts without explicit approval.

---

# 27. Radius and Visual Language

Use the established radius system:

```text
sm: 10px
md: 12px
lg: 14px
xl: 16px
full: 999px
```

The UI should use:

* Soft corners
* Subtle borders
* Restrained shadows
* Spacious layouts

Avoid excessive glassmorphism.

Avoid excessive gradients.

Avoid excessive rounded cards that make the interface feel like a generic dashboard.

---

# 28. Shadows

The primary subtle shadow is:

```text
0 4px 20px rgba(30, 25, 20, 0.06)
```

Use shadows sparingly.

Dark mode intentionally uses little or no shadow.

Prefer:

* Contrast
* Borders
* Surface hierarchy

over heavy shadows.

---

# 29. Responsive Design

Life Replay is mobile-first for capture and desktop-first for browsing.

## Mobile

Reference:

```text
360–430px
390 × 844 reference
```

Use:

* Fixed bottom navigation
* Home
* Timeline
* Capture
* Search
* Profile
* Elevated central Capture button
* Bottom sheets for filters and secondary actions
* Minimum 44 × 44px touch targets

## Tablet

```text
768–1199px
```

Use:

* Compact/collapsible navigation
* Reduced spacing
* Responsive layouts

## Desktop

```text
1280px+
```

Use:

* Persistent sidebar
* Desktop shell
* Timeline as visual centerpiece

Always test important interfaces at mobile and desktop sizes.

---

# 30. Accessibility

Accessibility is part of the implementation, not a later enhancement.

Ensure:

* Proper semantic HTML
* Labels for form controls
* Keyboard navigation
* Visible focus states
* Appropriate ARIA only when needed
* Sufficient color contrast
* Minimum 44 × 44px touch targets
* Buttons are actual buttons
* Links are actual links
* Images have appropriate alt text
* Dialogs are accessible

Do not use `<div>` elements as interactive controls when semantic elements exist.

---

# 31. Animations

Animations should reinforce the calm editorial experience.

Use Motion / Framer Motion where appropriate.

Prefer:

* Subtle entrance animations
* Small transitions
* Gentle hover feedback
* Smooth modal transitions
* Timeline transitions

Avoid:

* Excessive motion
* Distracting animations
* Long animations
* Animations on every element
* Motion that interferes with capture speed

Respect reduced-motion preferences where appropriate.

---

# 32. Loading and Error States

Every data-driven interface should consider:

* Loading state
* Error state
* Empty state
* Success state

Empty states should feel intentional and helpful.

Do not show generic:

```text
No data found.
```

when a more contextual message is possible.

For example:

```text
Nothing here yet.

Capture a small moment and your timeline will begin to grow.
```

---

# 33. Notifications

Use Sonner for lightweight user feedback when appropriate.

Examples:

* Moment created
* Moment updated
* Moment deleted
* Profile updated
* Settings updated
* Upload completed

Do not use notifications as a replacement for inline form validation or important error messages.

---

# 34. Project Structure

The current structure is a guideline, not a rigid contract.

Preferred structure:

```text
life-replay/

├── src/
│   ├── app/
│   │   ├── (auth)/
│   │   ├── (app)/
│   │   ├── api/
│   │   ├── layout.tsx
│   │   └── page.tsx
│   │
│   ├── components/
│   │   ├── ui/
│   │   ├── layout/
│   │   ├── timeline/
│   │   ├── moments/
│   │   └── dashboard/
│   │
│   ├── features/
│   │   ├── auth/
│   │   ├── moments/
│   │   ├── timeline/
│   │   └── search/
│   │
│   ├── actions/
│   ├── schemas/
│   ├── db/
│   ├── lib/
│   ├── hooks/
│   ├── stores/
│   └── types/
│
├── drizzle/
├── docs/
├── public/
├── drizzle.config.ts
├── package.json
└── AGENTS.md
```

Do not create folders merely because they appear in this example.

Add abstractions and directories when there is a real need.

---

# 35. Feature Organization

As features grow, related logic may be colocated.

For example:

```text
features/
└── moments/
    ├── components/
    ├── actions/
    ├── schemas/
    ├── queries/
    └── utils/
```

Do not force every feature into this structure from the beginning.

Avoid both extremes:

### Bad

One giant file containing an entire feature.

### Also bad

Creating ten abstraction layers for a feature that only has two functions.

Prefer the simplest structure that remains maintainable.

---

# 36. Shared Components

Use:

```text
components/ui/
```

for reusable UI primitives, especially shadcn/ui components.

Use:

```text
components/layout/
```

for application shell components.

Feature-specific components should generally live close to their feature.

Before creating a new shared component:

1. Check existing components.
2. Check shadcn/ui.
3. Check whether the component is actually reused.
4. Avoid premature abstraction.

---

# 37. Utilities

`lib/` should contain genuinely shared utilities and infrastructure.

Examples:

```text
lib/
├── auth.ts
├── db.ts
├── cloudinary.ts
├── utils.ts
└── constants.ts
```

Do not put arbitrary feature logic into `utils.ts`.

If a utility only belongs to one feature, keep it close to that feature.

---

# 38. Environment Variables

Never hardcode:

* Database credentials
* Authentication secrets
* Cloudinary secrets
* API keys
* Encryption secrets
* Private tokens

Use environment variables.

Never expose server-only secrets through `NEXT_PUBLIC_*`.

Maintain:

```text
.env.example
```

with placeholder values.

Never commit `.env`.

---

# 39. Security

Security is a first-class requirement.

Always:

* Authenticate protected operations.
* Authorize user-owned resources.
* Validate input server-side.
* Validate uploads.
* Protect secrets.
* Scope database queries to the authenticated user.
* Avoid leaking internal errors.
* Avoid trusting client-provided identity.
* Avoid exposing private data in URLs or responses unnecessarily.

When modifying existing security-sensitive code, review the surrounding authorization logic instead of changing only the immediate line.

---

# 40. Error Handling

Expected application errors should be handled gracefully.

Do not expose:

* Database connection strings
* SQL errors
* Stack traces
* Authentication internals
* Cloud provider secrets

to users.

Use clear user-facing messages.

Keep useful debugging information on the server.

Do not silently swallow errors.

---

# 41. Performance

Do not optimize prematurely.

However, avoid obvious performance problems:

* Do not fetch an entire lifetime archive unnecessarily.
* Do not load huge datasets into Client Components.
* Do not perform database queries in loops when a set-based query is possible.
* Do not repeatedly query the database for the same data unnecessarily.
* Do not send unnecessary fields to the client.
* Use pagination/incremental loading where appropriate.
* Use indexes based on real query patterns.
* Optimize images.

Prefer Server Components to reduce unnecessary client JavaScript.

---

# 42. Git and Changes

Keep changes focused.

When implementing a feature:

* Modify only relevant files.
* Do not refactor unrelated code.
* Do not rename files unnecessarily.
* Do not change dependencies without a reason.
* Do not rewrite working code merely because you prefer another style.

Before finishing a task, inspect the Git diff.

Avoid accidentally including:

* `.env`
* secrets
* debug files
* temporary files
* generated artifacts that should not be committed

---

# 43. AI Agent Development Workflow

AI agents should follow this workflow for non-trivial tasks.

## Step 1 — Understand

Before modifying files:

* Inspect the repository.
* Inspect relevant existing code.
* Inspect relevant documentation.
* Understand the current architecture.
* Identify dependencies.

Do not assume that a file exists simply because the project structure suggests it should.

## Step 2 — Plan

For non-trivial features, first provide:

1. Files that need to be created.
2. Files that need to be modified.
3. Database changes.
4. Server/client boundaries.
5. Authentication requirements.
6. Validation requirements.
7. UI changes.
8. Potential security concerns.
9. Testing requirements.

Do not make major architectural changes without explaining them.

## Step 3 — Implement

Implement only the requested feature.

Follow the existing architecture.

Prefer small, understandable changes.

## Step 4 — Verify

After implementation:

* Run TypeScript checks.
* Run ESLint.
* Run relevant tests.
* Check build errors.
* Review the Git diff.

Fix errors rather than ignoring them.

## Step 5 — Report

Summarize:

* What changed
* Files created
* Files modified
* Database changes
* Important architectural decisions
* Tests/checks performed
* Any remaining issues

---

# 44. AI Coding Principles

The AI agent should behave as a careful senior developer, not as an autonomous code generator.

Prefer:

```text
Inspect → Plan → Implement → Verify → Review
```

over:

```text
Guess → Generate everything → Hope it works
```

Do not:

* Invent APIs.
* Invent existing files.
* Assume dependencies are installed.
* Replace architecture without reason.
* Rewrite large portions of the project unnecessarily.
* Add libraries simply because they are popular.
* Create unnecessary abstractions.
* Ignore TypeScript errors.
* Ignore lint errors.
* Disable lint rules to make code pass.
* Use `any` to silence type errors.
* Remove tests to make them pass.
* Bypass authentication/authorization to simplify development.

When uncertain, inspect the codebase and documentation first.

---

# 45. Dependency Rules

Before installing a dependency:

1. Check whether the project already has a solution.
2. Check whether the dependency is actually necessary.
3. Prefer established libraries already in the stack.
4. Avoid adding multiple libraries that solve the same problem.
5. Explain why a new dependency is needed.

Use pnpm.

Do not switch to npm, yarn, or bun unless explicitly requested.

---

# 46. TypeScript Rules

Use strict TypeScript.

Avoid:

```ts
any
```

unless there is a documented and unavoidable reason.

Prefer:

* Explicit types at boundaries
* Inferred types where inference is clear
* Discriminated unions
* Type-safe database queries
* Type-safe form schemas

Do not create unnecessary duplicate types when types can be derived safely.

---

# 47. Code Style

Prefer readable code over clever code.

Keep functions reasonably focused.

Avoid deeply nested logic.

Use descriptive names.

Avoid abbreviations unless they are universally understood.

Prefer early returns when they improve readability.

Do not over-comment obvious code.

Comments should explain **why**, not merely repeat **what** the code does.

---

# 48. Testing

Testing should be introduced progressively.

Use unit/component tests where they provide meaningful value.

Use Playwright for important end-to-end flows.

Important flows include:

* Registration
* Login
* Logout
* Create moment
* Edit moment
* Delete moment
* Authorization boundaries
* Search
* Timeline
* On This Day
* Profile changes
* Account deletion

Security-sensitive authorization behavior should have strong test coverage.

---

# 49. Definition of Done

A feature is not considered complete merely because the UI appears to work.

For a typical feature, verify:

* [ ] Requirements implemented
* [ ] Authentication handled
* [ ] Authorization handled
* [ ] Server-side validation implemented
* [ ] Database queries scoped correctly
* [ ] Loading state handled
* [ ] Error state handled
* [ ] Empty state handled
* [ ] Success feedback handled where appropriate
* [ ] Mobile UI checked
* [ ] Desktop UI checked
* [ ] Accessibility considered
* [ ] TypeScript passes
* [ ] ESLint passes
* [ ] Relevant tests pass
* [ ] Git diff reviewed
* [ ] No secrets or temporary files included

---

# 50. Important Product Principle

Life Replay should always feel like a **personal time machine**, not a productivity application.

When making UX decisions, prioritize:

1. Fast capture
2. Emotional warmth
3. Easy rediscovery
4. Calm browsing
5. Personal privacy
6. Long-term usability

Do not turn the product into a dashboard full of metrics, charts, scores, streaks, or productivity measurements unless explicitly requested.

The central question behind the product is:

> "What was I doing around this time last year?"

Every major feature should support the feeling of answering that question.
