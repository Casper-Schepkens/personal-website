# Website Update — Claude Desktop setup

## Flow

```
/website-update → MCP tool → Cursor webhook → Cloud Agent → draft PR
```

**Geen website nodig** — alles draait lokaal in Claude Desktop.

## Setup

### 1. Cursor Automation

[cursor.com/automations](https://cursor.com/automations) — zie `.cursor/automations/website-update.md`

Webhook URL + auth token kopiëren.

### 2. Claude Desktop MCP config

`~/Library/Application Support/Claude/claude_desktop_config.json`:

```json
{
  "mcpServers": {
    "cursor-webhook": {
      "command": "node",
      "args": ["/ABSOLUUT/PAD/NAAR/personal-website/scripts/cursor-webhook-mcp.mjs"],
      "env": {
        "CURSOR_AUTOMATION_WEBHOOK_URL": "https://api2.cursor.sh/automations/webhook/...",
        "CURSOR_AUTOMATION_AUTH_TOKEN": "crsr_..."
      }
    }
  }
}
```

Herstart Claude Desktop.

### 3. Skill uploaden

Upload **`website-update-claude-desktop.zip`**

## Test

```
/website-update

Zet IKnowright summary op: "Test via webhook"
```

Zie `website-update/references/webhook-setup.md` voor troubleshooting.
