# Life-Replay

A personal time machine — capture life's small moments and rediscover them years later. To be built with Next.js, PostgreSQL, and Drizzle.

> "What was I doing around this time last year?"

Life Replay isn't a diary. It's a place to drop tiny, everyday moments — a coffee, a finished feature, a run — in 10–15 seconds, so that months or years later they resurface and remind you of a day you'd otherwise have forgotten.

---

## ✨ Core Idea

**Capture → Organize → Revisit → Rediscover**

- **Capture** a small moment in seconds, not a journal entry.
- **Organize** it automatically onto a chronological timeline.
- **Revisit** your archive through search, filters, and browsing.
- **Rediscover** the past through the signature **On This Day** feature — moments from this exact date in previous years, resurfaced automatically.

Life Replay is deliberately *not* a social network, productivity tracker, task manager, traditional diary, or analytics dashboard. It's a calm, personal archive.

---

## 🧩 Features

### MVP
- Register / login / logout (session-based auth)
- Create, view, edit, delete moments
- Categorize moments (Work, Food, Music, Fitness, Learning, Ideas, Personal, Travel, Other)
- Optional image attachment per moment
- Chronological **Timeline** with day/month/year navigation and category filtering
- **Search** across your own moments (title, description, category, date)
- **On This Day** — historical moments from the current calendar date, grouped by year
- Profile management (edit profile, change password, delete account)
- Settings (appearance, notifications, data export, privacy)

### Planned / future
- Mood tracking, location, tags, multiple images per moment
- Voice-captured moments
- AI-assisted recall ("What was I doing last summer?")
- Weekly / monthly / yearly recaps
- Memory map view
- Calendar & photo-library import
- Offline capture / PWA support
- Email & push reminders for On This Day

---

## 🛠 Tech Stack

| Layer | Choice |
|---|---|
| Framework | [Next.js](https://nextjs.org/) (App Router) + TypeScript |
| Styling | Tailwind CSS + [shadcn/ui](https://ui.shadcn.com/) |
| Icons | [Lucide React](https://lucide.dev/) |
| Animation | Framer Motion |
| Forms & Validation | React Hook Form + Zod |
| Database | PostgreSQL |
| ORM | [Drizzle](https://orm.drizzle.team/) |
| Authentication | [Better Auth](https://www.better-auth.com/) |
| Image storage | Cloudinary (or equivalent object storage) |
| Package manager | pnpm |

Life Replay is built as a single full-stack Next.js application — no separate Express backend. Server Components and Server Actions handle data fetching and mutations directly against Drizzle; Route Handlers are used only where a genuine HTTP endpoint is needed.

---

## 🎨 Design System

**Warm Archival Editorial** — a warm, editorial, teal-and-amber identity intended to feel like a personal archive rather than a SaaS dashboard.

- **Palette:** Warm Ivory (`#FAF9F6`), Deep Teal (`#176B67`), Warm Amber (`#D99A3D`), Terracotta (`#C9785D`)
- **Typography:** Plus Jakarta Sans, with Inter/system fallback
- **Personality mix:** 70% editorial · 20% warm memory · 10% modern product
- Full light and dark mode support, dark mode designed intentionally rather than inverted
- Purple/violet/indigo are explicitly avoided to keep a distinct identity

Full design specs (colors, typography scale, spacing, component inventory, and per-screen mobile/desktop/dark-mode breakdowns) live in [`/docs/design`](./docs/design) — see below.

---

## 📱 Responsive Design

Life Replay is designed mobile-first for capture, with a dedicated desktop shell for browsing:

- **Desktop (1280px+):** persistent sidebar navigation, timeline as the visual centerpiece
- **Tablet (768–1199px):** collapsible/compact sidebar, reduced spacing
- **Mobile (360–430px, reference 390×844):** fixed bottom navigation (Home · Timeline · Capture · Search · Profile) with an elevated central Capture button, bottom sheets for filters and secondary actions, and 44×44px minimum touch targets throughout

---

## 🗂 Project Structure

```text
life-replay/
├── app/
│   ├── (auth)/            # login, register
│   ├── (app)/             # dashboard, moments, timeline, search, on-this-day, profile, settings
│   ├── api/                # route handlers (only where genuinely needed)
│   ├── layout.tsx
│   └── page.tsx
├── components/
│   ├── ui/                 # shadcn-based primitives
│   ├── layout/              # sidebar, header, bottom nav
│   ├── timeline/
│   ├── moments/
│   └── dashboard/
├── features/
│   ├── auth/
│   ├── moments/
│   ├── timeline/
│   └── search/
├── actions/                 # Server Actions
├── schemas/                 # Zod schemas
├── db/
│   └── schema.ts            # Drizzle schema
├── drizzle/                 # generated SQL migrations
├── lib/
│   ├── db.ts                # Drizzle client
│   ├── auth.ts               # Better Auth config
│   └── utils.ts
├── types/
├── drizzle.config.ts        # Drizzle Kit config
└── public/
```

This is a guideline, not a rigid contract — folders are added only when there's a real reason for them.

---

## 🚀 Getting Started

> Project is in early setup. This section will be filled in as the app is scaffolded.

```bash
# clone
git clone https://github.com/<your-username>/life-replay.git
cd life-replay

# install
pnpm install

# configure environment
cp .env.example .env
# fill in DATABASE_URL, Better Auth secrets, image storage credentials, etc.

# set up the database
pnpm add drizzle-orm@rc postgres
pnpm add -D drizzle-kit@rc

# run the dev server
pnpm dev
```

---

## 🧭 Roadmap

Development is organized in phases — project setup → UI foundation → database & Drizzle → Better Auth → moments CRUD → timeline → search → images → On This Day → UX polish → performance → deployment. See the [design & planning docs](./docs) for the full phase breakdown.

---

## 🔒 Security & Privacy

Life Replay stores private personal memories, so:

- Every moment is scoped to its owner; user identity is derived from the authenticated session, never from client input
- All mutations are authorized server-side
- Uploaded files are validated before storage
- Users cannot access another user's moments by manipulating an ID in the URL

---

## 📄 License

TBD.