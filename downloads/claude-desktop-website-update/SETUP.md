# Website Update — Claude Desktop setup

## Flow

```
/website-update → MCP tool → Cursor webhook → Cloud Agent → draft PR
```

## Setup (3 stappen)

### 1. Cursor Automation

[cursor.com/automations](https://cursor.com/automations) — zie `.cursor/automations/website-update.md` in de repo.

Na opslaan: webhook URL + auth token → Vercel env vars.

### 2. Vercel env vars + redeploy

| Variable | Waarde |
|----------|--------|
| `CURSOR_AUTOMATION_WEBHOOK_URL` | van automation dashboard |
| `CURSOR_AUTOMATION_AUTH_TOKEN` | van "Generate auth header" |
| `MCP_BRIDGE_SECRET` | `openssl rand -hex 32` |

### 3. Claude

- Upload **`website-update-claude-desktop.zip`** (Skills)
- Connector: `https://casperschepkens.nl/api/mcp` + Bearer secret
- Naam connector: `cursor-webhook`

## Test

```
/website-update

Zet IKnowright summary op: "Test via webhook"
```

Zie `website-update/references/webhook-setup.md` in de zip voor details.
