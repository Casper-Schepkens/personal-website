# Webhook setup

```
Claude → website_update_dispatch → Cursor Automation webhook → Cloud Agent → draft PR
```

## Waarom niet rechtstreeks naar Cursor?

Claude kan **geen willekeurige webhooks** aanroepen. Connectors spreken **MCP**. De Cursor webhook is gewoon HTTP POST. Daarom een dunne MCP-laag die POST doet.

**Die MCP-laag hoeft NIET op je website te draaien.**

## Aanbevolen: lokaal in Claude Desktop (geen website)

### 1. Cursor Automation

[cursor.com/automations](https://cursor.com/automations) — zie `.cursor/automations/website-update.md`

Kopieer webhook URL + auth token.

### 2. Claude Desktop config

Bestand (macOS): `~/Library/Application Support/Claude/claude_desktop_config.json`

```json
{
  "mcpServers": {
    "cursor-webhook": {
      "command": "node",
      "args": ["/ABSOLUUT/PAD/NAAR/personal-website/scripts/cursor-webhook-mcp.mjs"],
      "env": {
        "CURSOR_AUTOMATION_WEBHOOK_URL": "https://api2.cursor.sh/automations/webhook/JOUW_ID",
        "CURSOR_AUTOMATION_AUTH_TOKEN": "crsr_..."
      }
    }
  }
}
```

Herstart Claude Desktop.

### 3. Skill uploaden

`downloads/claude-desktop-website-update/website-update-claude-desktop.zip`

### 4. Test

```
/website-update

Zet IKnowright summary op: "Test via webhook"
```

---

## Optioneel: via website (alleen voor claude.ai in browser)

Als je Claude in de **browser** gebruikt zonder Desktop, heb je een publieke MCP-URL nodig. Dan pas:

- Deploy `/api/mcp` op `casperschepkens.com`
- Vercel env: `CURSOR_AUTOMATION_WEBHOOK_URL`, `CURSOR_AUTOMATION_AUTH_TOKEN`, `MCP_BRIDGE_SECRET`
- Connector: `https://casperschepkens.com/api/mcp` + Bearer secret

Voor Claude Desktop: **skip dit** — lokaal script is simpeler.

## Troubleshooting

| Probleem | Fix |
|----------|-----|
| Tool niet zichtbaar | Herstart Claude; check pad in config |
| Webhook 401 | Auth token opnieuw genereren |
| Agent start niet | Repo in automation gekoppeld? |
