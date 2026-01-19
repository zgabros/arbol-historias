# PROJECT BLUEPRINT: Interactive Story Platform (CYOA)

## 1. Project Goal
Create a mobile-first web application for "Choose Your Own Adventure" style novels.
- **Frontend (Reader):** Fast, elegant, immersive reading experience. No login required for readers (progress saved in LocalStorage).
- **Backend (Admin CMS):** A custom internal dashboard for a writer to create stories, write chapters, and link decisions.

## 2. Tech Stack (Cost $0 Strategy)
- **Framework:** Next.js 14+ (App Router).
- **Language:** TypeScript.
- **Styling:** Tailwind CSS + Shadcn/UI (for the Admin Panel).
- **Database:** Supabase (PostgreSQL).
- **Auth:** NextAuth.js (only for the Admin access).
- **Hosting:** Vercel.

## 3. Core Architecture
- **Monorepo:** Both the public reader and the private admin live in the same Next.js app.
- **Routes:**
  - `/` -> Public Home (List of stories).
  - `/story/[slug]/[chapterId]` -> Public Reader View.
  - `/admin/...` -> Protected CMS routes.

## 4. Data Model (Schema Design)

### Table: stories
- `id` (uuid, pk)
- `title` (text)
- `slug` (text, unique)
- `synopsis` (text)
- `cover_url` (text)
- `is_published` (boolean)

### Table: chapters
- `id` (uuid, pk)
- `story_id` (fk -> stories.id)
- `title` (text) - *Internal title for the writer*
- `content` (text/html) - *The story text*
- `is_starting_chapter` (boolean) - *Marks the first chapter of a story*
- `status` (enum: 'draft', 'published')

### Table: options (The Decision Tree)
- `id` (uuid, pk)
- `current_chapter_id` (fk -> chapters.id) - *Where the button appears*
- `target_chapter_id` (fk -> chapters.id) - *Where the button goes*
- `label` (text) - *Text on the button (e.g., "Open the door")*

## 5. Key Features to Implement
1. **The Writer Flow:** Needs a Rich Text Editor in `/admin` to write chapters and a UI to add "Options" that link to other chapters.
2. **The Preview Mode:** The Admin should be able to preview chapters even if they are `draft`.
3. **The Reader Flow:** The public view only fetches `published` chapters.