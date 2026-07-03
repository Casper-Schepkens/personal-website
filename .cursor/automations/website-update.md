# Cursor Automation: Website Update

Maak deze automation aan op [cursor.com/automations](https://cursor.com/automations).

## Instellingen

| Veld | Waarde |
|------|--------|
| **Naam** | Website Update |
| **Trigger** | Webhook |
| **Repository** | `Casper-Schepkens/personal-website` |
| **Branch** | `master` |
| **Tools** | Pull request creation (aan) |

## Agent instructions

**Plak de volledige prompt uit:** `website-update-agent-instructions.md`

Die file bevat alles wat de agent moet weten over payload, change types, bestanden en PR-afronding.

## Na opslaan

1. Kopieer **webhook URL** → `CURSOR_AUTOMATION_WEBHOOK_URL` (lokaal MCP config of optioneel Vercel)
2. **Generate auth header** → `CURSOR_AUTOMATION_AUTH_TOKEN`
3. Configureer Claude Desktop MCP — zie `references/webhook-setup.md`

## Test (handmatig)

```bash
curl -X POST "$CURSOR_AUTOMATION_WEBHOOK_URL" \
  -H "Authorization: Bearer $CURSOR_AUTOMATION_AUTH_TOKEN" \
  -H "Content-Type: application/json" \
  -d '{
    "event": "website-update",
    "summary": "Test",
    "update_spec": {
      "version": 1,
      "summary": "Test",
      "changes": [{
        "type": "ui_text",
        "updates": { "home.tagline": "Student · Ondernemer · Bouwer" }
      }]
    }
  }'
```

Check [cursor.com/automations](https://cursor.com/automations) voor de run.
