# Claude → Cursor via GitHub

**Standaard flow:** Claude maakt een GitHub issue → `@cursor` comment → Cloud Agent → draft PR.

Zie `github-workflow.md` voor de volledige setup en troubleshooting.

## Snelstart

1. **Cursor:** GitHub-integratie voor `personal-website` ([dashboard](https://cursor.com/dashboard))
2. **Claude:** GitHub-connector + Project met `.claude/skills/website-update/SKILL.md`
3. **Test in Claude:** `/website-update` + beschrijf een kleine wijziging
4. **Check:** GitHub issue → agent op [cursor.com/agents](https://cursor.com/agents) → draft PR

Geen API-keys nodig in Claude.
