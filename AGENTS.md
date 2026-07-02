# AGENTS.md

## Cursor Cloud specific instructions

This is a static personal portfolio site built with Next.js (App Router), Tailwind CSS, Framer Motion, and MDX. There is no backend, database, or auth — content lives in `content/` (MDX) and `messages/nl.json`. The UI is in Dutch.

### Services

Single service: the Next.js app.

- Dev server: `npm run dev` (serves on http://localhost:3000). Use this for development — it has hot reload.
- Lint: `npm run lint` (currently passes with one non-blocking `no-page-custom-font` warning in `app/layout.js`).
- Production build/serve: `npm run build` then `npm run start` (not needed for normal dev work).

### Notes

- `next lint` prints a deprecation notice (removed in Next.js 16) but still works; ignore it.
- Routes: `/`, `/projects`, `/projects/[slug]`, `/about`, `/roadmap`. Project/roadmap pages are generated from MDX files in `content/`.
- `next.config.mjs` sets `pageExtensions` to include `md`/`mdx`, so MDX files are treated as pages/content.

### Website content updates

Content updates (project phases, roadmap, UI text) use the `website-update` skills:

- **Claude:** `.claude/skills/website-update/` — creates GitHub issue + `@cursor` comment
- **Cursor:** `.cursor/skills/website-update/` — executes changes when triggered via `@cursor` on a `website-update` issue

See `.cursor/skills/website-update/references/github-workflow.md` for setup.
