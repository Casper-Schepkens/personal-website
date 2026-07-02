# GitHub relay MCP — technische setup

De MCP-server draait als Next.js API route: `app/api/[transport]/route.js` → bereikbaar op `/api/mcp`.

## Lokale ontwikkeling

```bash
cp .env.example .env.local
# Vul GITHUB_PAT en MCP_BRIDGE_SECRET in

npm install
npm run dev
```

Test health (dev zonder secret als `MCP_BRIDGE_SECRET` leeg is):

```bash
curl -X POST http://localhost:3000/api/mcp \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer JOUW_SECRET" \
  -d '{"jsonrpc":"2.0","id":1,"method":"tools/list"}'
```

## Vercel productie

1. Zet env vars in Vercel (zie `github-workflow.md`)
2. Deploy `master`
3. Connector URL: `https://<jouw-domein>/api/mcp`

## Security

- `GITHUB_PAT` staat **alleen** server-side (Vercel env) — nooit in Claude, skills, of git
- `MCP_BRIDGE_SECRET` beschermt de MCP endpoint; alleen jij kent dit in Claude connector config
- PAT is scoped tot één repo, alleen issues write

## PAT aanmaken (stappen)

1. https://github.com/settings/personal-access-tokens/new
2. Resource owner: `Casper-Schepkens`
3. Repository access: **Only select repositories** → `personal-website`
4. Permissions → Repository permissions:
   - Issues: **Read and write**
   - Metadata: **Read-only**
5. Generate → kopieer naar `GITHUB_PAT` in Vercel

## Code-locaties

| Bestand | Rol |
|---------|-----|
| `lib/github-relay.js` | GitHub REST API + issue formatting |
| `app/api/[transport]/route.js` | MCP handler + auth |
| `.env.example` | Benodigde env vars |

## Waarom geen GitHub Copilot MCP?

De officiële `api.githubcopilot.com/mcp/` connector gebruikt OAuth zonder `issues:write` scope → 403. Onze relay gebruikt een PAT met expliciete issue-permissions.
