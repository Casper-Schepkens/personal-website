---
name: website-update
description: "Voer content-updates door op de Casper Schepkens portfolio-site (Next.js + MDX). Gebruik bij webhook-triggers van Cursor Automations, projectfase-wijzigingen, roadmap-items, UI-teksten, of update-specs van Claude."
paths: content/**,messages/**,.cursor/skills/website-update/**
disable-model-invocation: true
---

# Website Update — Portfolio content bijwerken

Deze site is **content-driven**: geen database. Wijzigingen zitten in MDX-bestanden en `messages/nl.json`.

## Trigger: Cursor Automation webhook

Je bent gestart via een **webhook** met `update_spec` in de payload. Volg deze stappen:

1. **Lees de payload** — zoek `update_spec` (version 1, summary, changes[])
2. **Valideer** — minstens één change
3. **Voer wijzigingen uit** — zie workflow hieronder
4. **Afronden:**
   - `npm run lint`
   - Commit op `cursor/website-update-*` branch
   - Open **draft PR**
   - Rapporteer in PR-beschrijving wat er gewijzigd is

Als `update_spec` ontbreekt: stop en rapporteer wat er mis is.

## Wanneer deze skill gebruiken

- Webhook-trigger van Cursor Automation (primair)
- Projectfase-wijzigingen, roadmap, UI-teksten
- Gestructureerde update-spec van Claude

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
- `references/webhook-setup.md` — setup (automation + Vercel + Claude connector)
- `references/content-schema.md` — frontmatter-velden

## Wat je NIET doet

- Geen wijzigingen aan `app/`, `components/`, `lib/` tenzij expliciet gevraagd
- Geen Engelse UI-teksten
- Geen nieuwe dependencies
- Issue niet sluiten (alleen bij GitHub-fallback)
