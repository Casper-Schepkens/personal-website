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

Claude → MCP (`scripts/cursor-webhook-mcp.mjs` lokaal, of optioneel `/api/mcp` op casperschepkens.com) → Cursor Automation webhook → draft PR.

- **Claude skill:** `.claude/skills/website-update/`
- **Cursor skill:** `.cursor/skills/website-update/`
- **Automation template:** `.cursor/automations/website-update.md`
- **Setup:** `references/webhook-setup.md`

Vercel env: `CURSOR_AUTOMATION_WEBHOOK_URL`, `CURSOR_AUTOMATION_AUTH_TOKEN`, `MCP_BRIDGE_SECRET`.
