# Backlog — v1 personal website

Werk items **van boven naar beneden** af. Vink af met `[x]` als iets klaar is.

---

## 🔴 Hoog — site moet geloofwaardig overkomen

- [ ] **Projectcontent invullen**
  - [x] IKnowright — content, cover image, resultaten (klantnamen bevestigd)
  - [x] Jewelry Software — content, cover image, klant Brugge Diamond Gallery
  - [x] Pixel-3 — mini onderneming, Eliska, BDG + Alexamer, presentatie-content
  - [x] Vizier — basis content + cover (details te verifiëren)
  - [x] Zorgbalans — content, rebrand-verhaal, screenshot homepage
  - Bestanden: `content/projects/*.mdx`, afbeeldingen in `public/images/`

- [ ] **About-pagina schrijven**
  - Studie, ondernemen, wat je zoekt / waar je naartoe werkt
  - Bestand: `app/(site)/about/page.js` + eventueel copy in `messages/nl.json`

- [ ] **Roadmap invullen**
  - Echte datums en milestones (studie, start ondernemen, etc.)
  - Bestanden: `content/roadmap/*.mdx`

- [ ] **Hero copy finetunen**
  - Intro staat al; aanscherpen zodra about klaar is
  - Bestanden: `messages/nl.json`, `app/(site)/page.js`

---

## 🟠 Medium — polish & UX

- [ ] **Cover images uploaden**
  - Placeholders vervangen per project
  - `coverImage` in project-frontmatter + bestanden in `public/images/`

- [ ] **Mobile navigatie**
  - Hamburger-menu op klein scherm (nav is nu compact)
  - Bestand: `components/Header.js`

- [ ] **Animaties**
  - Scroll-reveals
  - Hover-states waar gewenst
  - Framer Motion / CSS transitions

- [ ] **Dark mode finetunen**
  - Alle pagina's nalopen (projectkaarten, tekst, borders)
  - OG image blijft light — bewust zo laten

---

## 🟡 Laag — nice to have v1

- [ ] **Google Search Console**
  - Site indienen voor indexering
  - Sitemap: `/sitemap.xml` (al aanwezig)

- [ ] **Favicon**
  - CS-logo als browser-tab icoon
  - `app/favicon.ico` of `app/icon.png`

- [ ] **404-pagina**
  - On-brand error page
  - `app/not-found.js`

- [ ] **Performance check**
  - Lighthouse audit
  - Font loading optimaliseren

---

## ⚪ Later — bewust niet v1

- [ ] EN / taal-switch (i18n)
- [ ] Admin dashboard voor project-priority
- [ ] Blog
- [ ] Contactformulier

---

## Notities

| Onderwerp | Detail |
|-----------|--------|
| Live site | https://www.casperschepkens.com |
| Branch v1 | `initial-changes` → merge naar `master` als klaar |
| UI-teksten | `messages/nl.json` |
| Kleuren / theme | `app/globals.css` |
| SEO | `lib/seo.js`, `lib/site.js` |
