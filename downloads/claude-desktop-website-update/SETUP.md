# Website Update — Claude Desktop setup

Download en installeer de skill om `/website-update` te gebruiken in Claude Desktop.

## Bestanden in dit pakket

| Bestand | Wat |
|---------|-----|
| `website-update-claude-desktop.zip` | **Upload dit** in Claude Desktop |
| `SETUP.md` | Deze handleiding |
| `website-update/` | Bronmap (zelfde inhoud als de zip) |

## Stap 1 — Skill uploaden in Claude Desktop

1. Open **Claude Desktop**
2. Ga naar **Settings** (tandwiel) → **Capabilities** / **Customize** → **Skills**
3. Zorg dat **Code execution** aan staat (vereist voor skills)
4. Klik **+** → **Upload a skill**
5. Selecteer **`website-update-claude-desktop.zip`**
6. Zet de skill **aan**

> De zip bevat map `website-update/` met `SKILL.md` + `references/` — dat is het vereiste formaat.

## Stap 2 — GitHub koppelen

1. Claude Desktop → **Settings** → **Integrations** → **GitHub**
2. Autoriseer toegang tot **`Casper-Schepkens/personal-website`**
3. Nodig: issues aanmaken + comments schrijven

## Stap 3 — Cursor koppelen (eenmalig)

1. [cursor.com/dashboard](https://cursor.com/dashboard) → **Integrations** → **GitHub**
2. Geef toegang tot **`personal-website`**
3. Cloud Agents moeten aan staan voor die repo

## Stap 4 — GitHub label (optioneel)

In de repo: maak label **`website-update`** (elke kleur).

## Stap 5 — Testen

Nieuw gesprek in Claude Desktop:

```
/website-update

Zet de summary van IKnowright op: "Test update via Claude Desktop"
```

Verwacht:
1. GitHub issue `[website-update] ...`
2. Comment met `@cursor`
3. Cursor agent op [cursor.com/agents](https://cursor.com/agents)
4. Draft PR op GitHub

## Troubleshooting

| Probleem | Oplossing |
|----------|-----------|
| Skill triggert niet | Typ expliciet `/website-update`; check of skill aan staat |
| Geen GitHub-issue | GitHub-integratie opnieuw autoriseren |
| `@cursor` reageert niet | Cursor GitHub-integratie checken |
| Zip upload faalt | Gebruik `website-update-claude-desktop.zip` uit deze map |

## Project vs. skill

Je hoeft **geen apart Project** aan te maken — de skill bevat alle instructies én reference docs. Optioneel kun je nog een Project “Portfolio” maken voor extra context, maar dat is niet nodig.
