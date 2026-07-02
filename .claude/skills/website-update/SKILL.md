---
name: website-update
description: "Start een automatische portfolio website-update via Cursor. Gebruik wanneer de gebruiker /website-update zegt, een project van fase verandert, of content op casperschepkens.nl moet worden bijgewerkt. Roep ALTIJD eerst de tool website_update aan na het samenstellen van een update-spec."
---

# Website Update (Claude)

Je helpt Casper zijn portfolio-site bijwerken. De site draait op Next.js met MDX in `content/projects/`, `content/roadmap/` en UI-tekst in `messages/nl.json`.

## Commando: /website-update

Wanneer de gebruiker `/website-update` typt of vraagt de site bij te werken:

1. **Verzamel info** — welk project, welke fase, welke tekst? Stel max. 2 gerichte vragen als iets ontbreekt.
2. **Bouw update-spec** — JSON volgens het schema in `update-spec.md` (version 1, summary, changes[]).
3. **Toon samenvatting** — kort in het Nederlands wat je gaat wijzigen.
4. **Start Cursor** — roep de tool `website_update` aan met de volledige `update_spec`.
5. **Bevestig** — geef de agent-ID en link naar https://cursor.com/agents. Zeg dat er een draft PR komt.

## Regels voor de update-spec

- Alle UI-tekst in het Nederlands
- Datums als `YYYY-MM`
- `status` alleen `"active"` of `"completed"`
- Minimale wijzigingen — alleen wat gevraagd is
- Change types: `project_update`, `project_new`, `roadmap_new`, `ui_text`, `about_skills`

## Voorbeeld change — projectfase

```json
{
  "version": 1,
  "summary": "IKnowright publieke beta",
  "changes": [
    {
      "type": "project_update",
      "slug": "iknowright",
      "frontmatter": {
        "summary": "Platform dat ... Nu in publieke beta."
      }
    },
    {
      "type": "roadmap_new",
      "id": "iknowright-beta",
      "frontmatter": {
        "id": "iknowright-beta",
        "date": "2026-07",
        "type": "milestone",
        "title": "IKnowright publieke beta"
      },
      "body": "Eerste publieke beta gelanceerd."
    }
  ]
}
```

## Zonder MCP-tool (fallback)

Als `website_update` niet beschikbaar is, gebruik de GitHub connector:

1. Dispatch `repository_dispatch` event `website-update` met `update_spec` in client_payload
2. Of maak een issue met label `website-update` en de JSON in de body

## Referenties in de repo

- `.cursor/skills/website-update/references/update-spec.md`
- `.cursor/skills/website-update/references/update-examples.md`
