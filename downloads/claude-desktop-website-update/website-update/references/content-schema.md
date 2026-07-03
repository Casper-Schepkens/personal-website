# Content schema — portfolio site

## Project (`content/projects/{slug}.mdx`)

| Veld | Type | Verplicht | Beschrijving |
|------|------|-----------|--------------|
| `title` | string | ja | Weergavenaam |
| `slug` | string | ja | URL-segment; moet overeenkomen met bestandsnaam |
| `status` | `"active"` \| `"completed"` | ja | Filter op /projects |
| `tags` | string[] | ja | Technologieën/thema's |
| `dateStart` | string (YYYY-MM) | ja | Startperiode |
| `dateEnd` | string \| null | nee | Eindperiode; `null` = nog bezig |
| `summary` | string | ja | Korte teaser op cards |
| `coverImage` | string | nee | Pad onder `/public`; default placeholder |
| `priority` | number | nee | Lager = hoger in lijst; default 99 |
| `featured` | boolean | nee | Homepage "uitgelicht"; default false |
| `links.live` | string | nee | Live URL |
| `links.repo` | string | nee | Repository URL |

**Body (Markdown):** vrije secties; bestaande projecten gebruiken `## Over ...`, `### Wat ik deed`, `### Resultaat`.

## Roadmap (`content/roadmap/{id}.mdx`)

| Veld | Type | Verplicht | Beschrijving |
|------|------|-----------|--------------|
| `id` | string | ja | Unieke identifier |
| `date` | string (YYYY-MM) | ja | Chronologische sortering |
| `type` | string | ja | `education`, `work`, `milestone`, `project` |
| `title` | string | ja | Korte titel op timeline |

**Body:** korte toelichting (1–3 zinnen).

## UI-teksten (`messages/nl.json`)

Belangrijke secties:

- `meta` — site name, SEO description
- `home` — homepage koppen en intro
- `projects` — projectenpagina labels
- `about.story` — persoonlijk verhaal
- `about.skills` — `dev`, `tools`, `other` arrays
- `roadmap.types` — labels per roadmap-type

## Bestaande projecten (slugs)

| Slug | Status | Opmerking |
|------|--------|-----------|
| `iknowright` | active | featured, priority 1 |
| `vizier` | active | freelance |
| `jewelry-software` | — | check bestand |
| `zorgbalans` | completed | client work voorbeeld |

Lees altijd het actuele bestand; deze tabel kan verouderen.
