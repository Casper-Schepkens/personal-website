# Website Update — Claude Desktop setup

## Wat je nodig hebt

1. **Skill zip** — `website-update-claude-desktop.zip`
2. **GitHub relay MCP** — draait op je site (`/api/mcp`) na Vercel deploy
3. **GitHub PAT** + **MCP_BRIDGE_SECRET** — in Vercel env vars
4. **Cursor** — GitHub-integratie voor `personal-website`

> De standaard GitHub-connector van Claude kan **geen issues aanmaken** (403). Daarom de eigen MCP relay.

## Stap 1 — Vercel env vars (eerst!)

Vercel dashboard → project → Settings → Environment Variables:

| Variable | Waarde |
|----------|--------|
| `GITHUB_PAT` | Fine-grained PAT, issues read/write op `personal-website` |
| `GITHUB_REPO` | `Casper-Schepkens/personal-website` |
| `MCP_BRIDGE_SECRET` | `openssl rand -hex 32` |

Redeploy. Zie `website-update/references/github-relay-setup.md` in de zip.

## Stap 2 — Skill uploaden

1. Claude Desktop → **Settings** → **Customize** → **Skills**
2. **Code execution** aan
3. **+** → **Upload a skill** → `website-update-claude-desktop.zip`
4. Skill **aan**

## Stap 3 — MCP connector toevoegen

**Optie A — Custom connector (claude.ai / Desktop):**

1. **Settings** → **Connectors** → **Add custom connector**
2. URL: `https://casperschepkens.nl/api/mcp`
3. Auth: **Bearer** = je `MCP_BRIDGE_SECRET`
4. Naam: `github-relay`

**Optie B — mcp-remote (Claude Desktop config):**

```json
{
  "github-relay": {
    "command": "npx",
    "args": [
      "-y",
      "mcp-remote",
      "https://casperschepkens.nl/api/mcp",
      "--header",
      "Authorization: Bearer JOUW_MCP_BRIDGE_SECRET"
    ]
  }
}
```

Bestand (macOS): `~/Library/Application Support/Claude/claude_desktop_config.json`

## Stap 4 — Cursor

[cursor.com/dashboard](https://cursor.com/dashboard) → GitHub → `personal-website`

## Stap 5 — Test

```
/website-update

Zet IKnowright summary op: "Test via GitHub relay"
```

Verwacht: MCP geeft issue-URL → `@cursor` comment → draft PR.

## Troubleshooting

| Probleem | Fix |
|----------|-----|
| MCP 401 | Secret in Vercel = secret in connector |
| GitHub 403 in MCP | PAT permissions checken |
| Claude gebruikt verkeerde GitHub tool | Zeg: gebruik `website_update_dispatch` |
| `@cursor` reageert niet | Cursor GitHub-integratie |
