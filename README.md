# Casper Schepkens — Personal Website

Persoonlijke portfolio-site gebouwd met Next.js, Tailwind CSS, Framer Motion en MDX.

## Snel starten

```bash
npm install
npm run dev
```

Open [http://localhost:3000](http://localhost:3000).

## Content aanpassen (geen code nodig)

### Project toevoegen

1. Maak een bestand in `content/projects/`, bijv. `mijn-project.mdx`
2. Vul frontmatter in (zie bestaande projecten als voorbeeld)
3. Schrijf de body in Markdown

**Prioriteit & uitgelicht:** zet `priority: 1` (lager = hoger) en `featured: true` in frontmatter.

### Roadmap-item toevoegen

1. Maak `content/roadmap/mijn-item.mdx`
2. Vul `date`, `type`, `title` in

### UI-teksten (nav, knoppen, etc.)

Bewerk `messages/nl.json`.

### Kleuren wijzigen

Pas CSS-variabelen aan in `app/globals.css` — gebaseerd op visitekaartje-kleuren:

```css
--color-background: #e8e8e8;
--color-foreground: #2d2d2d;
```

## Structuur

```
app/(site)/            → pagina routes
content/projects/      → project MDX
content/roadmap/       → roadmap MDX
messages/nl.json       → UI-teksten
lib/projects.js        → project data ophalen
lib/roadmap.js         → roadmap data ophalen
public/images/logo.png → CS logo
```

## Backlog

Open [`BACKLOG.md`](./BACKLOG.md) voor de volledige v1-takenlijst (prioriteit hoog → laag).

## Cover images

Plaats afbeeldingen in `public/images/` en verwijs ernaar in frontmatter:

```yaml
coverImage: "/images/mijn-project.jpg"
```
