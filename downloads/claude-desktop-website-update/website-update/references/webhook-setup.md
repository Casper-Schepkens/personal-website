# Webhook setup — zo simpel mogelijk

```
Claude → MCP (/api/mcp) → Cursor Automation webhook → Cloud Agent → draft PR
```

Geen GitHub issues. Geen PAT. Drie dingen instellen.

## 1. Cursor Automation (5 min)

[cursor.com/automations](https://cursor.com/automations) → nieuwe automation volgens `.cursor/automations/website-update.md`:

- Trigger: **Webhook**
- Repo: `personal-website`
- PR creation: **aan**

Na opslaan:
- Webhook URL → `CURSOR_AUTOMATION_WEBHOOK_URL`
- Auth token → `CURSOR_AUTOMATION_AUTH_TOKEN`

## 2. Vercel env vars

| Variable | Waarde |
|----------|--------|
| `CURSOR_AUTOMATION_WEBHOOK_URL` | van automation dashboard |
| `CURSOR_AUTOMATION_AUTH_TOKEN` | van "Generate auth header" |
| `MCP_BRIDGE_SECRET` | `openssl rand -hex 32` |

Redeploy.

## 3. Claude connector

**URL:** `https://casperschepkens.nl/api/mcp`  
**Auth:** Bearer = `MCP_BRIDGE_SECRET`  
**Naam:** `cursor-webhook`

**Claude Desktop (mcp-remote):**

```json
{
  "cursor-webhook": {
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

## 4. Skill uploaden

`downloads/claude-desktop-website-update/website-update-claude-desktop.zip`

## Test

```
/website-update

Zet IKnowright summary op: "Test via webhook"
```

→ [cursor.com/automations](https://cursor.com/automations) → draft PR

## Troubleshooting

| Probleem | Fix |
|----------|-----|
| MCP 401 | `MCP_BRIDGE_SECRET` matcht niet |
| Webhook 401 | Auth token opnieuw genereren in automation |
| Agent start niet | Repo gekoppeld in automation? |
| Geen PR | Check run logs in automations dashboard |
