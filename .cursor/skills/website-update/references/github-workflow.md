# GitHub + @cursor workflow

De standaard manier om website-updates te doen: **Claude maakt issue → `@cursor` comment → Cloud Agent → draft PR**.

Geen API-keys. Geen MCP. Alleen GitHub + Cursor GitHub-integratie.

## Architectuur

```
Jij in Claude: /website-update
    → Claude skill: bouwt JSON + maakt GitHub issue
    → Claude: comment met @cursor
    → Cursor Cloud Agent (via GitHub-integratie)
    → Draft PR + comment op issue
    → Jij: review + merge
```

## Eenmalige setup

### 1. Cursor ↔ GitHub

1. [cursor.com/dashboard](https://cursor.com/dashboard) → **Integrations** → **GitHub**
2. Geef toegang tot `Casper-Schepkens/personal-website`
3. Zorg dat Cloud Agents aan staan voor die repo

### 2. Claude ↔ GitHub

1. Claude → **Settings** → **Integrations** → **GitHub**
2. Autoriseer toegang tot `personal-website` (issues + comments schrijven)

### 3. Claude Project

Maak project **“Portfolio”** en:

- Voeg skill toe: `.claude/skills/website-update/SKILL.md` (of kopieer inhoud naar project instructions)
- Upload als knowledge:
  - `references/update-spec.md`
  - `references/update-examples.md`

### 4. GitHub label (optioneel)

Maak label `website-update` in de repo (kleur naar keuze). Claude voegt dit toe aan issues.

## Issue-formaat (contract)

Claude moet issues **exact** zo aanmaken:

**Titel:** `[website-update] {korte samenvatting}`

**Body:**

```markdown
## Samenvatting

{1-2 zinnen Nederlands}

## Update-spec

<!-- website-update-spec: do not edit markers -->
```json
{
  "version": 1,
  "summary": "...",
  "changes": [ ... ]
}
```
<!-- /website-update-spec -->

## Checklist

- [ ] Alleen content/ en messages/nl.json
- [ ] npm run lint
- [ ] Draft PR
```

**Comment (direct na issue):**

```
@cursor

Voer de website-update skill uit: `.cursor/skills/website-update/SKILL.md`

Lees de update-spec tussen de `website-update-spec` markers in dit issue.
Pas alleen `content/` en `messages/nl.json` aan.
Draai `npm run lint`, commit op een `cursor/*` branch, en open een draft PR.

Sluit dit issue niet — laat Casper de PR reviewen.
```

## Handmatige test (zonder Claude)

1. Ga naar GitHub → **New issue** → template “Website content update”
2. Vul JSON in tussen de markers
3. Plaats de `@cursor` comment hierboven
4. Wacht op draft PR op [cursor.com/agents](https://cursor.com/agents)

## Wat Cursor doet

1. Ziet `@cursor` mention op het issue
2. Start Cloud Agent op `personal-website`
3. Leest `.cursor/skills/website-update/SKILL.md`
4. Parsed JSON uit issue body
5. Past MDX / `messages/nl.json` aan
6. Opent draft PR
7. (Idealiter) comment op issue met PR-link

## Troubleshooting

| Probleem | Oplossing |
|----------|-----------|
| `@cursor` reageert niet | Check GitHub-integratie in Cursor dashboard |
| Agent start maar geen PR | Check agent run op cursor.com/agents |
| JSON niet gevonden | Zorg dat markers `website-update-spec` aanwezig zijn |
| Claude kan geen issue maken | GitHub-connector opnieuw autoriseren |
| Verkeerde wijzigingen | Spec in issue corrigeren, nieuwe `@cursor` comment |

## Waarom geen API?

- `@cursor` op GitHub is ingebouwd in Cursor — geen keys in Claude
- Issue = audit trail van elke update
- Draft PR = jij houdt controle vóór live gaat
