# GitHub relay MCP + @cursor workflow

Claude kan **niet** schrijven via de standaard GitHub-connector (403 op `issue_write`). Daarom draait er een **eigen MCP-server** op de portfolio-site die met een server-side PAT issues en comments aanmaakt.

## Architectuur

```
Claude: /website-update
  → MCP tool: website_update_dispatch
  → Vercel /api/mcp (github-relay, PAT server-side)
  → GitHub issue + @cursor comment
  → Cursor Cloud Agent
  → Draft PR
```

## Eenmalige setup

### 1. GitHub fine-grained PAT

1. GitHub → **Settings** → **Developer settings** → **Fine-grained tokens** → **Generate**
2. Repository access: **Only** `Casper-Schepkens/personal-website`
3. Permissions:
   - **Issues:** Read and write
   - **Metadata:** Read-only
4. Kopieer token (eenmalig zichtbaar)

### 2. Vercel environment variables

In Vercel dashboard voor `personal-website`:

| Variable | Waarde |
|----------|--------|
| `GITHUB_PAT` | `github_pat_...` |
| `GITHUB_REPO` | `Casper-Schepkens/personal-website` |
| `MCP_BRIDGE_SECRET` | Lang random geheim (bv. `openssl rand -hex 32`) |

Redeploy na het zetten van env vars.

### 3. Cursor ↔ GitHub

[cursor.com/dashboard](https://cursor.com/dashboard) → Integrations → GitHub → `personal-website`

### 4. Claude custom connector

**Claude Desktop / claude.ai:**

1. **Settings** → **Connectors** → **Add custom connector**
2. **URL:** `https://casperschepkens.nl/api/mcp` (of je Vercel preview URL)
3. **Authentication:** Bearer token = je `MCP_BRIDGE_SECRET`
4. Naam: bv. `github-relay`

**Claude Desktop (alternatief via mcp-remote):**

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

Config: `~/Library/Application Support/Claude/claude_desktop_config.json` (macOS)

### 5. Skill uploaden

Upload `website-update-claude-desktop.zip` (Customize → Skills) of gebruik project instructions uit `.claude/skills/website-update/SKILL.md`.

### 6. GitHub label

Maak label **`website-update`** in de repo.

## Test

```
/website-update

Zet IKnowright summary op: "Test via GitHub relay MCP"
```

Verwacht:
1. MCP retourneert issue-URL
2. Issue heeft `@cursor` comment
3. Agent op [cursor.com/agents](https://cursor.com/agents)
4. Draft PR

## MCP tools

| Tool | Doel |
|------|------|
| `website_update_dispatch` | **Primair** — issue + @cursor in één call |
| `create_github_issue` | Laag niveau |
| `add_github_issue_comment` | Laag niveau |
| `get_github_issue` | Status check |

## Handmatige fallback

Zie issue template `.github/ISSUE_TEMPLATE/website-update.md` en plaats `@cursor` comment handmatig.

## Troubleshooting

| Probleem | Oplossing |
|----------|-----------|
| MCP 401 | `MCP_BRIDGE_SECRET` in connector en Vercel moeten matchen |
| GitHub 403 in MCP logs | PAT permissions of repo scope checken |
| `@cursor` reageert niet | Cursor GitHub-integratie |
| Connector URL 404 | Deploy live? Route is `/api/mcp` |
| Claude gebruikt verkeerde GitHub tool | Zeg expliciet: gebruik `website_update_dispatch` |

Zie ook: `references/github-relay-setup.md`
