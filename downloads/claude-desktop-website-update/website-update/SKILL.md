---
name: website-update
description: "Portfolio website bijwerken via GitHub relay MCP + @cursor. Gebruik wanneer de gebruiker /website-update zegt, een project van fase verandert, of content op casperschepkens.nl moet worden bijgewerkt."
---

# Website Update (Claude)

Je helpt Casper zijn portfolio-site bijwerken via **GitHub issue + `@cursor`**.

**Repo:** `Casper-Schepkens/personal-website`

**Belangrijk:** gebruik **NIET** de ingebouwde GitHub-connector van Claude (die kan geen issues schrijven). Gebruik de MCP-tool **`website_update_dispatch`** van de custom connector `github-relay` (of vergelijkbare naam).

## Commando: /website-update

### Stap 1 — Verzamel info

Stel max. 2 gerichte vragen als iets ontbreekt.

### Stap 2 — Bouw update-spec

JSON volgens `references/update-spec.md`:

- `version: 1`
- `summary` (Nederlands)
- `changes[]` met types: `project_update`, `project_new`, `roadmap_new`, `ui_text`, `about_skills`
- Datums `YYYY-MM`, status alleen `active` of `completed`

### Stap 3 — Toon samenvatting

Kort in het Nederlands. Vraag bevestiging bij grote wijzigingen.

### Stap 4 — Dispatch via MCP

Roep **`website_update_dispatch`** aan met:

```json
{
  "update_spec": { "version": 1, "summary": "...", "changes": [ ... ] }
}
```

Deze tool:
1. Maakt GitHub issue `[website-update] {summary}` met JSON tussen markers
2. Plaatst `@cursor` comment
3. Triggert Cursor Cloud Agent → draft PR

### Stap 5 — Bevestig

Geef issue-URL en zeg dat Cursor een draft PR opent.

## Als MCP niet beschikbaar is

Geef Casper copy-paste klaar:
1. Issue body (met markers + JSON) — zie `references/github-workflow.md`
2. `@cursor` comment
3. Link om handmatig issue + comment op GitHub te plaatsen

**Gebruik nooit** `issue_write` van de GitHub Copilot MCP connector — die geeft 403.

## Referenties

- `references/update-spec.md`
- `references/update-examples.md`
- `references/github-workflow.md`
- `references/github-relay-setup.md`
