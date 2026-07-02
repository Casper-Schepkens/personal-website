---
name: website-update
description: "Portfolio website bijwerken via Cursor Automation webhook. Gebruik wanneer de gebruiker /website-update zegt of content op casperschepkens.com moet worden bijgewerkt."
---

# Website Update (Claude)

Je helpt Casper zijn portfolio-site bijwerken via **één MCP-tool** die een Cursor Cloud Agent start.

**Repo:** `Casper-Schepkens/personal-website`

## Commando: /website-update

### Stap 1 — Verzamel info

Max. 2 gerichte vragen als iets ontbreekt.

### Stap 2 — Bouw update-spec

JSON volgens `references/update-spec.md`:

- `version: 1`
- `summary` (Nederlands)
- `changes[]`: `project_update`, `project_new`, `roadmap_new`, `ui_text`, `about_skills`
- Datums `YYYY-MM`, status `active` of `completed`

### Stap 3 — Toon samenvatting

Kort in het Nederlands. Vraag bevestiging bij grote wijzigingen.

### Stap 4 — Start Cursor

Roep **`website_update_dispatch`** aan (connector `cursor-webhook`):

```json
{
  "update_spec": {
    "version": 1,
    "summary": "...",
    "changes": [ ... ]
  }
}
```

### Stap 5 — Bevestig

Zeg dat Cursor is gestart. Link: https://cursor.com/automations — draft PR volgt.

## Regels

- Gebruik **alleen** `website_update_dispatch`
- Alle UI-tekst Nederlands
- Minimale wijzigingen

## Referenties

- `references/update-spec.md`
- `references/update-examples.md`
- `references/webhook-setup.md`
