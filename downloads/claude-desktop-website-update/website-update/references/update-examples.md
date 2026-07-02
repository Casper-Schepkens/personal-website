# Update-voorbeelden

## 1. Informele prompt (in Cursor chat)

```
/website-update

IKnowright staat nu in beta. Update het project:
- status blijft active
- summary: "Platform dat professionals helpt met [X]. Nu in publieke beta."
- Voeg roadmap-item toe: juli 2026, milestone, "IKnowright publieke beta"
- Vul de placeholder-secties in de body aan op basis van: [jouw tekst]
```

## 2. Project afgerond

**Input:**

```json
{
  "version": 1,
  "summary": "Zorgbalans-project was al completed; alleen body uitbreiden",
  "changes": [
    {
      "type": "project_update",
      "slug": "zorgbalans",
      "body": {
        "mode": "replace",
        "content": "## Over dit project\n\nWebsite voor De Zorgbalans — volledige redesign en WordPress-implementatie.\n\n### Rol\n\nLead developer: wireframes, thema, contentmigratie.\n\n### Resultaat\n\nSite live binnen 4 maanden; 40% snellere laadtijd t.o.v. oude site."
      }
    }
  ]
}
```

## 3. Nieuw freelance-project

**Input:**

```json
{
  "version": 1,
  "summary": "Nieuw freelance project Acme Corp",
  "changes": [
    {
      "type": "project_new",
      "slug": "acme-corp",
      "frontmatter": {
        "title": "Freelance — Acme Corp",
        "slug": "acme-corp",
        "status": "active",
        "tags": ["Freelance", "React"],
        "dateStart": "2026-04",
        "dateEnd": null,
        "summary": "Frontend development voor Acme Corp dashboard.",
        "priority": 4,
        "featured": false,
        "links": { "live": "", "repo": "" }
      },
      "body": "## Over dit project\n\nFreelance opdracht voor Acme Corp.\n\n### Wat ik doe\n\n- React dashboard componenten\n- API-integratie\n\n### Waarom relevant\n\nEnterprise schaal, design system werk."
    },
    {
      "type": "roadmap_new",
      "id": "acme-freelance",
      "frontmatter": {
        "id": "acme-freelance",
        "date": "2026-04",
        "type": "work",
        "title": "Freelance bij Acme Corp"
      },
      "body": "Gestart als frontend freelancer."
    }
  ]
}
```

## 4. Skills bijwerken op /about

```json
{
  "version": 1,
  "summary": "TypeScript toegevoegd aan skills",
  "changes": [
    {
      "type": "about_skills",
      "dev": ["JavaScript", "TypeScript", "Next.js", "React", "Node.js", "Tailwind CSS"]
    }
  ]
}
```

## 5. Alleen homepage-intro

```json
{
  "version": 1,
  "summary": "Homepage intro verfijnd",
  "changes": [
    {
      "type": "ui_text",
      "updates": {
        "home.intro": "Ik bouw producten die mensen echt gebruiken — van SaaS tot freelance. Op deze site zie je waar ik nu mee bezig ben."
      }
    }
  ]
}
```
