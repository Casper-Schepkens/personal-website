---
name: website-update
description: "Portfolio website bijwerken via GitHub + @cursor. Gebruik wanneer de gebruiker /website-update zegt, een project van fase verandert, of content op casperschepkens.nl moet worden bijgewerkt."
---

# Website Update (Claude)

Je helpt Casper zijn portfolio-site bijwerken. Wijzigingen gaan via **GitHub issues + `@cursor`** — geen API-keys, geen MCP.

**Repo:** `Casper-Schepkens/personal-website`

## Commando: /website-update

Wanneer de gebruiker `/website-update` typt of de site wil bijwerken:

### Stap 1 — Verzamel info

Stel max. 2 gerichte vragen als iets ontbreekt (welk project, welke fase, welke tekst).

### Stap 2 — Bouw update-spec

JSON volgens schema (version 1, summary, changes[]). Regels:

- Alle UI-tekst in het Nederlands
- Datums als `YYYY-MM`
- `status` alleen `"active"` of `"completed"`
- Change types: `project_update`, `project_new`, `roadmap_new`, `ui_text`, `about_skills`

### Stap 3 — Toon samenvatting

Kort in het Nederlands wat je gaat wijzigen. Vraag bevestiging als de wijziging groot of onomkeerbaar is.

### Stap 4 — Maak GitHub issue

**Vereist:** GitHub-connector met schrijftoegang tot `personal-website`.

| Veld | Waarde |
|------|--------|
| **Title** | `[website-update] {summary}` |
| **Labels** | `website-update` |
| **Body** | Exact format hieronder |

```markdown
## Samenvatting

{summary in het Nederlands}

## Update-spec

<!-- website-update-spec: do not edit markers -->
```json
{volledige JSON, pretty-printed}
```
<!-- /website-update-spec -->

## Checklist

- [ ] Alleen content/ en messages/nl.json
- [ ] npm run lint
- [ ] Draft PR
```

### Stap 5 — Comment met @cursor

Direct na het issue, plaats **één comment** op dat issue:

```
@cursor

Voer de website-update skill uit: `.cursor/skills/website-update/SKILL.md`

Lees de update-spec tussen de `website-update-spec` markers in dit issue.
Pas alleen `content/` en `messages/nl.json` aan.
Draai `npm run lint`, commit op een `cursor/*` branch, en open een draft PR.

Sluit dit issue niet — laat Casper de PR reviewen.
```

### Stap 6 — Bevestig aan Casper

Geef:
- Link naar het GitHub issue
- Korte samenvatting van wat Cursor gaat doen
- “Cursor start een Cloud Agent; je krijgt een draft PR op GitHub.”

## Als GitHub-connector niet beschikbaar is

Geef Casper:
1. De volledige issue body (copy-paste klaar)
2. De `@cursor` comment (copy-paste klaar)
3. Instructie: “Maak het issue handmatig op GitHub en plak de comment.”

**Gebruik geen API, MCP of repository_dispatch** — alleen GitHub issues + `@cursor`.

## Voorbeeld update-spec

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

## Referenties

- `.cursor/skills/website-update/references/update-spec.md`
- `.cursor/skills/website-update/references/update-examples.md`
- `.cursor/skills/website-update/references/github-workflow.md`
