---
name: website-update
description: "Voer content-updates door op de Casper Schepkens portfolio-site (Next.js + MDX). Gebruik bij projectfase-wijzigingen, roadmap-items, UI-teksten, skills op /about, of nieuwe projecten. Ook wanneer een externe AI (Claude) een gestructureerde update-brief of JSON-spec aanlevert."
paths: content/**,messages/**,.cursor/skills/website-update/**
disable-model-invocation: true
---

# Website Update — Portfolio content bijwerken

Deze site is **content-driven**: geen database. Wijzigingen zitten in MDX-bestanden en `messages/nl.json`. Volg deze skill stap voor stap.

## Wanneer deze skill gebruiken

- Een project gaat van `active` → `completed` (of omgekeerd)
- Een project krijgt een nieuwe fase, beschrijving, tags, links of cover image
- Er komt een nieuw project of roadmap-item bij
- UI-teksten of skills op de about-pagina moeten worden bijgewerkt
- Iemand levert een **update-spec** aan (zie `references/update-spec.md`)

## Kernregels

1. **Minimale diff** — wijzig alleen wat de update vraagt; geen refactors of styling tenzij expliciet gevraagd.
2. **Nederlandse UI** — alle zichtbare tekst blijft Nederlands (`messages/nl.json` en MDX-body).
3. **Frontmatter is leidend** — filters, sortering en cards lezen metadata uit YAML; body is voor detailpagina's.
4. **Consistentie** — match stijl en structuur van bestaande bestanden in `content/projects/` en `content/roadmap/`.
5. **Valideren** — draai `npm run lint` na de wijziging. Optioneel `npm run build` bij grotere updates.

## Site-structuur (snelreferentie)

| Wat | Waar |
|-----|------|
| Projecten | `content/projects/{slug}.mdx` |
| Roadmap | `content/roadmap/{id}.mdx` |
| UI-teksten | `messages/nl.json` |
| About-skills | `messages/nl.json` → `about.skills` |
| Cover images | `public/images/` → `coverImage: "/images/..."` |
| Project-data | `lib/projects.js` (alleen lezen; geen wijziging nodig voor content) |

**Statuswaarden projecten:** `active` | `completed`  
**Roadmap types:** `education` | `work` | `milestone` | `project`

## Workflow

### Stap 1 — Update begrijpen

Lees de input van de gebruiker of de meegeleverde update-spec. Identificeer:

- **Type:** `project_update` | `project_new` | `roadmap_new` | `ui_text` | `about_skills` | `combined`
- **Doel-slug(s)** of bestandsnamen
- **Gewenste velden** en nieuwe tekst

Bij twijfel: lees het bestaande MDX-bestand eerst volledig.

### Stap 2 — Bestanden wijzigen

#### Project bijwerken (`content/projects/{slug}.mdx`)

Typische fase-overgang:

```yaml
status: "completed"      # was: active
dateEnd: "2026-06"       # was: null
featured: false          # optioneel: uit homepage halen
priority: 5              # optioneel: lagere prioriteit
```

Werk ook de MDX-body bij: vul placeholders (`[...]`) in, voeg secties toe, beschrijf resultaat/impact.

#### Nieuw project

1. Kopieer structuur van een vergelijkbaar bestaand project
2. Unieke `slug` (bestandsnaam = `{slug}.mdx`)
3. Zet `priority` (lager = hoger op de lijst) en `featured` bewust

#### Nieuw roadmap-item

1. Maak `content/roadmap/{id}.mdx`
2. Frontmatter: `id`, `date` (YYYY-MM), `type`, `title`
3. Korte body (1–3 zinnen)

#### UI-teksten / about-skills

Bewerk alleen de relevante keys in `messages/nl.json`. Houd JSON geldig.

### Stap 3 — Gerelateerde updates (checklist)

Bij een **projectfase-wijziging**, controleer of ook nodig is:

- [ ] Roadmap-item toevoegen voor de milestone?
- [ ] `featured` / `priority` aanpassen voor homepage?
- [ ] `dateEnd` invullen bij afronding?
- [ ] Nieuwe tags of links (`live`, `repo`)?

### Stap 4 — Valideren en afronden

```bash
npm run lint
```

Rapporteer aan de gebruiker:
- Welke bestanden gewijzigd zijn
- Wat er inhoudelijk veranderd is
- Of er nog openstaande placeholders zijn

## Input van externe AI (Claude e.d.)

Als de prompt een JSON-blok of gestructureerde brief bevat:

1. Parse volgens `references/update-spec.md`
2. Voer alle `changes` uit in logische volgorde
3. Negeer velden die `null` zijn of ontbreken — die blijven ongewijzigd

Zie `references/claude-bridge.md` voor hoe Claude deze spec kan genereren en Cursor kan aanroepen.

## Referenties

- `references/update-spec.md` — JSON-schema voor gestructureerde updates
- `references/update-examples.md` — concrete voorbeelden
- `references/claude-bridge.md` — Claude → Cursor integratie-opties
- `references/content-schema.md` — volledige frontmatter-velden

## Wat je NIET doet

- Geen wijzigingen aan `app/`, `components/`, `lib/` tenzij de update dat expliciet vereist
- Geen Engelse UI-teksten toevoegen
- Geen nieuwe dependencies zonder expliciete vraag
- Geen commit/PR tenzij de gebruiker of cloud-agent workflow dat vraagt
