# Cursor Automation: Website Update

Gebruik dit document om een Automation aan te maken op [cursor.com/automations](https://cursor.com/automations), of typ `/automate` in Cursor en plak onderstaande configuratie.

## Instellingen

| Veld | Waarde |
|------|--------|
| **Naam** | Website Update |
| **Trigger** | Webhook |
| **Repository** | `Casper-Schepkens/personal-website` |
| **Branch** | `master` |
| **Tools** | Pull request creation (aan) |
| **Model** | Default (Max Mode) |

## Automation prompt

Plak dit als instructies voor de automation:

```
Je voert een website content-update uit op de Casper Schepkens portfolio-site.

De webhook payload bevat een JSON-object met:
- summary: korte beschrijving
- update_spec: volledige update-specificatie (version 1, changes[])

Werkstappen:
1. Lees .cursor/skills/website-update/SKILL.md en volg die workflow
2. Parse update_spec volgens references/update-spec.md
3. Pas alleen content/ en messages/nl.json aan — geen component-refactors
4. Alle UI-tekst blijft Nederlands
5. Draai npm run lint
6. Commit op een cursor/* branch en open een draft PR

Als update_spec ontbreekt of ongeldig is: stop en rapporteer wat er mis is.

Webhook payload (uit de trigger):
{{payload}}
```

> **Let op:** Cursor vult `{{payload}}` mogelijk automatisch in met de webhook body. Als dat niet werkt, pas de prompt aan naar: "Lees de webhook body van deze run voor de update_spec."

## Na het opslaan

1. Kopieer de **webhook URL** (formaat: `https://api2.cursor.sh/automations/webhook/...`)
2. Klik **Generate auth header** en kopieer de Bearer token
3. Zet in je MCP bridge `.env`:
   ```
   CURSOR_MODE=automation
   CURSOR_AUTOMATION_WEBHOOK_URL=<webhook url>
   CURSOR_AUTOMATION_AUTH_TOKEN=<token zonder "Bearer ">
   ```

## Test

```bash
curl -X POST "$CURSOR_AUTOMATION_WEBHOOK_URL" \
  -H "Authorization: Bearer $CURSOR_AUTOMATION_AUTH_TOKEN" \
  -H "Content-Type: application/json" \
  -d '{
    "event": "website-update",
    "summary": "Test update",
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

Controleer op cursor.com/automations of de run is gestart.
