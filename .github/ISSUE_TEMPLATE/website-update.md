---
name: Website content update
about: Content-update voor casperschepkens.nl — wordt opgepakt door @cursor
title: "[website-update] "
labels: website-update
---

## Samenvatting

<!-- Korte beschrijving in het Nederlands -->

## Update-spec

<!-- website-update-spec: do not edit markers -->
```json
{
  "version": 1,
  "summary": "",
  "changes": []
}
```
<!-- /website-update-spec -->

## Checklist

- [ ] Alleen `content/` en `messages/nl.json`
- [ ] `npm run lint`
- [ ] Draft PR

---

**Na deploy:** Claude gebruikt MCP tool `website_update_dispatch` — geen handmatige `@cursor` comment nodig als de skill correct draait. Bij handmatige issues: plaats onderstaande comment.

```
@cursor

Voer de website-update skill uit: `.cursor/skills/website-update/SKILL.md`

Lees de update-spec tussen de `website-update-spec` markers in dit issue.
Pas alleen `content/` en `messages/nl.json` aan.
Draai `npm run lint`, commit op een `cursor/*` branch, en open een draft PR.

Sluit dit issue niet — laat Casper de PR reviewen.
```
