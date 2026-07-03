# Update-spec — gestructureerd formaat

Externe AI's (Claude, ChatGPT, etc.) kunnen updates in dit JSON-formaat aanleveren. Cursor voert ze uit via de `website-update` skill.

## Envelope

```json
{
  "version": 1,
  "summary": "Korte menselijke samenvatting van de update",
  "changes": []
}
```

## Change types

### `project_update`

Bestaand project wijzigen. Alleen opgegeven velden worden overschreven.

```json
{
  "type": "project_update",
  "slug": "iknowright",
  "frontmatter": {
    "status": "completed",
    "dateEnd": "2026-07",
    "featured": false,
    "summary": "Platform voor ... — nu live met eerste gebruikers."
  },
  "body": {
    "mode": "replace",
    "content": "## Over IKnowright\n\nVolledige nieuwe body in Markdown..."
  },
  "body_append": {
    "section": "### Resultaat",
    "content": "Eerste 50 gebruikers binnen 3 maanden."
  }
}
```

**`body.mode`:** `replace` (hele body) of weglaten als alleen frontmatter wijzigt.  
**`body_append`:** voegt een sectie toe of vervangt bestaande sectie met dezelfde heading.

### `project_new`

```json
{
  "type": "project_new",
  "slug": "mijn-nieuwe-app",
  "frontmatter": {
    "title": "Mijn Nieuwe App",
    "slug": "mijn-nieuwe-app",
    "status": "active",
    "tags": ["Next.js", "SaaS"],
    "dateStart": "2026-03",
    "dateEnd": null,
    "summary": "Korte beschrijving.",
    "coverImage": "/images/placeholder-project.svg",
    "priority": 2,
    "featured": true,
    "links": { "live": "", "repo": "" }
  },
  "body": "## Over dit project\n\n..."
}
```

### `roadmap_new`

```json
{
  "type": "roadmap_new",
  "id": "iknowright-launch",
  "frontmatter": {
    "id": "iknowright-launch",
    "date": "2026-07",
    "type": "milestone",
    "title": "IKnowright gelanceerd"
  },
  "body": "Eerste publieke versie live."
}
```

### `ui_text`

Dot-notatie voor nested keys in `messages/nl.json`.

```json
{
  "type": "ui_text",
  "updates": {
    "home.intro": "Nieuwe intro-tekst op de homepage.",
    "about.skills.dev": ["JavaScript", "Next.js", "React", "TypeScript"]
  }
}
```

### `about_skills`

Shorthand voor skills op /about.

```json
{
  "type": "about_skills",
  "dev": ["JavaScript", "Next.js", "React"],
  "tools": ["Git", "Figma", "Vercel"],
  "other": ["Freelance", "Ondernemerschap"]
}
```

## Volledig voorbeeld — project afronden

```json
{
  "version": 1,
  "summary": "IKnowright afgerond en roadmap-milestone toegevoegd",
  "changes": [
    {
      "type": "project_update",
      "slug": "iknowright",
      "frontmatter": {
        "status": "completed",
        "dateEnd": "2026-07",
        "featured": false
      },
      "body_append": {
        "section": "### Resultaat",
        "content": "MVP gelanceerd met betalende early adopters."
      }
    },
    {
      "type": "roadmap_new",
      "id": "iknowright-launch",
      "frontmatter": {
        "id": "iknowright-launch",
        "date": "2026-07",
        "type": "milestone",
        "title": "IKnowright MVP gelanceerd"
      },
      "body": "Eerste versie live na 6 maanden bouwen."
    }
  ]
}
```

## Validatieregels

- `slug` / `id` alleen lowercase, cijfers en koppeltekens
- Datums altijd `YYYY-MM`
- `status` alleen `active` of `completed`
- Geen lege `summary` bij projecten
- JSON moet geldig zijn (geen trailing commas)
