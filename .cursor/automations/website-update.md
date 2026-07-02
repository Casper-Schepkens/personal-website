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

## Prompt (plak als instructies)

```
Je voert een website content-update uit op de Casper Schepkens portfolio-site.

De webhook payload bevat:
- summary: korte beschrijving
- update_spec: JSON met version 1, summary, changes[]

Werkstappen:
1. Lees .cursor/skills/website-update/SKILL.md en volg die workflow
2. Parse update_spec volgens references/update-spec.md
3. Pas alleen content/ en messages/nl.json aan
4. Alle UI-tekst blijft Nederlands
5. Draai npm run lint
6. Commit op een cursor/* branch en open een draft PR

Webhook payload:
{{payload}}
```

## Na opslaan

1. Kopieer **webhook URL** → Vercel env `CURSOR_AUTOMATION_WEBHOOK_URL`
2. Klik **Generate auth header** → token zonder "Bearer " → `CURSOR_AUTOMATION_AUTH_TOKEN`
3. Redeploy Vercel

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
