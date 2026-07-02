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

Content updates use the `website-update` skills with a **GitHub relay MCP** (`/api/mcp`):

- **Claude:** `.claude/skills/website-update/` — calls `website_update_dispatch` MCP tool
- **Server:** `lib/github-relay.js` + `app/api/[transport]/route.js` — creates issues with PAT
- **Cursor:** `.cursor/skills/website-update/` — executes changes when triggered via `@cursor`

Requires Vercel env: `GITHUB_PAT`, `MCP_BRIDGE_SECRET`. See `references/github-relay-setup.md`.
