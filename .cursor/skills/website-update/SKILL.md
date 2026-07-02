---
name: website-update
description: "Voer content-updates door op de Casper Schepkens portfolio-site (Next.js + MDX). Gebruik bij @cursor mentions op GitHub issues met label website-update, projectfase-wijzigingen, roadmap-items, UI-teksten, of gestructureerde update-specs van Claude."
paths: content/**,messages/**,.cursor/skills/website-update/**
disable-model-invocation: true
---

# Website Update — Portfolio content bijwerken

Deze site is **content-driven**: geen database. Wijzigingen zitten in MDX-bestanden en `messages/nl.json`.

## Trigger: GitHub issue + @cursor

Je bent gestart via een **`@cursor` comment op een GitHub issue**. Volg deze stappen eerst:

1. **Lees het issue** — titel begint met `[website-update]`
2. **Haal de update-spec op** — JSON tussen `<!-- website-update-spec -->` en `<!-- /website-update-spec -->` markers
3. **Valideer** — moet `version: 1`, `summary`, en minstens één item in `changes[]` hebben
4. **Voer de wijzigingen uit** — zie workflow hieronder
5. **Afronden:**
   - `npm run lint`
   - Commit op `cursor/website-update-*` branch
   - Open een **draft PR** (titel: `website-update: {summary}`)
   - Comment op het issue met PR-link en korte samenvatting van wijzigingen
   - **Sluit het issue niet** — Casper reviewt en merged

Als de markers ontbreken: zoek een ` ```json ` blok met `version` en `changes`, of parse de issue-beschrijving en bouw zelf een spec (minimale diff).

## Wanneer deze skill gebruiken

- `@cursor` op een `website-update` issue (primair)
- Project gaat van `active` → `completed` (of omgekeerd)
- Nieuw project of roadmap-item
- UI-teksten of about-skills bijwerken
- Gestructureerde update-spec van Claude of andere AI

## Kernregels

1. **Minimale diff** — wijzig alleen wat de update vraagt
2. **Nederlandse UI** — `messages/nl.json` en MDX-body blijven Nederlands
3. **Frontmatter is leidend** — filters en cards lezen YAML-metadata
4. **Consistentie** — match bestaande bestanden in `content/projects/` en `content/roadmap/`
5. **Valideren** — altijd `npm run lint` na wijzigingen

## Site-structuur

| Wat | Waar |
|-----|------|
| Projecten | `content/projects/{slug}.mdx` |
| Roadmap | `content/roadmap/{id}.mdx` |
| UI-teksten | `messages/nl.json` |
| About-skills | `messages/nl.json` → `about.skills` |
| Cover images | `public/images/` → `coverImage: "/images/..."` |

**Status:** `active` | `completed`  
**Roadmap types:** `education` | `work` | `milestone` | `project`

## Workflow

### Stap 1 — Update begrijpen

Parse de update-spec (`references/update-spec.md`). Identificeer change types en doel-slugs.

### Stap 2 — Bestanden wijzigen

**Project bijwerken** (`content/projects/{slug}.mdx`):

```yaml
status: "completed"
dateEnd: "2026-06"
featured: false
```

Werk MDX-body bij; vul placeholders in.

**Nieuw project:** kopieer structuur van vergelijkbaar project; unieke `slug`.

**Nieuw roadmap-item:** `content/roadmap/{id}.mdx` met `id`, `date`, `type`, `title`.

**UI-teksten:** alleen relevante keys in `messages/nl.json`.

### Stap 3 — Checklist bij fase-wijziging

- [ ] Roadmap-milestone nodig?
- [ ] `featured` / `priority` aanpassen?
- [ ] `dateEnd` invullen?
- [ ] Nieuwe tags of links?

### Stap 4 — Valideren en PR

```bash
npm run lint
```

Rapporteer in PR-beschrijving en issue-comment:
- Gewijzigde bestanden
- Inhoudelijke wijzigingen
- Openstaande placeholders (indien van toepassing)

## Referenties

- `references/update-spec.md` — JSON-schema
- `references/update-examples.md` — voorbeelden
- `references/github-workflow.md` — Claude → GitHub → @cursor flow
- `references/content-schema.md` — frontmatter-velden

## Wat je NIET doet

- Geen wijzigingen aan `app/`, `components/`, `lib/` tenzij expliciet gevraagd
- Geen Engelse UI-teksten
- Geen nieuwe dependencies
- Issue niet sluiten — alleen PR openen
