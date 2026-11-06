# Ahmed Ezz — Personal Educational Platform

A modern, documentation-style personal educational platform designed for backend engineers and students arriving from YouTube.

Designed strictly in accordance with [`Agents.md`](./Agents.md) for **100% zero-cost free hosting**, extreme maintainability, dark-mode first elegance, and an isolated API abstraction layer ready for a future Go REST backend.

---

## 🚀 Tech Stack

- **Frontend**: Vue 3, Vite, TypeScript, Vue Router 4, Pinia, Tailwind CSS, Axios
- **Documentation Engine**: Marked (GFM), Highlight.js (syntax highlighting & copy code), Mermaid.js (state & sequence diagrams)
- **Backend Services**: Supabase (PostgreSQL, Storage, Authentication, Row Level Security)
- **Deployment**: Cloudflare Pages / Vercel (100% Free Hosting)

---

## 🏛 Clean Architecture & Go-Ready Service Layer

Per architectural guidelines, **Vue components NEVER import or invoke Supabase directly**.

```
Vue Views / Components 
        ↓
Pinia Stores / Composables
        ↓
Service Contracts (Interfaces: ICourseService, ILessonService, etc.)
        ↓
Provider Adapters:
  ├── SupabaseAdapter (Active V1 Provider)
  └── GoApiAdapter     (Drop-in replacement for V2 without UI rewrites)
```

If Supabase credentials are not provided or if `VITE_DATA_PROVIDER=mock`, the application automatically falls back to an in-memory service populated with production-ready backend engineering lessons (Raft Consensus in Go, PostgreSQL Internals, Linux Sockets & epoll).

---

## ⚡ Quick Start

### 1. Install dependencies
```bash
npm install
```

### 2. Configure Environment (Optional for local preview)
Copy the sample environment file:
```bash
cp .env.example .env
```
Populate your Supabase project keys:
```env
VITE_SUPABASE_URL=https://your-project.supabase.co
VITE_SUPABASE_ANON_KEY=your-anon-public-key
```
*(If left blank, the platform runs in offline development mock mode with pre-seeded lessons.)*

### 3. Run Development Server
```bash
npm run dev
```
Open [http://localhost:3000](http://localhost:3000) in your browser.

### 4. Build for Production
```bash
npm run build
```

---

## 🗄 Database & Supabase Setup

The entire database schema, UUID keys, RLS security policies, and storage buckets are scripted in:
👉 [`supabase/schema.sql`](./supabase/schema.sql)

### Setup Steps in Supabase:
1. Create a free project at [supabase.com](https://supabase.com).
2. Go to the **SQL Editor** tab.
3. Paste the contents of `supabase/schema.sql` and click **Run**.
4. The script creates:
   - Tables: `profiles`, `categories`, `courses`, `lessons`, `tags`, `lesson_tags`, `attachments`
   - Row Level Security (RLS) policies allowing public read of published lessons and admin-only mutations.
   - Storage buckets: `lesson-images`, `lesson-files`, `course-covers`, `profile-images`.

---

## 🛡 Administrator Access

- The public portal requires **no login** for visitors.
- Single administrator access is protected at `/admin`.
- In demo/preview mode:
  - **Email**: `admin@ahmedezz.dev`
  - **Password**: `password`
- With Supabase connected, administrator authentication uses Supabase Auth email/password.

---

## 🌐 Free Hosting Deployment

### Cloudflare Pages
- **Build command**: `npm run build`
- **Build output directory**: `dist`
- Cloudflare Pages routing rule is pre-configured in [`public/_routes.json`](./public/_routes.json).

### Vercel
- **Build command**: `npm run build`
- **Output directory**: `dist`
- SPA rewrites and caching headers are pre-configured in [`vercel.json`](./vercel.json).
