# Claude → Cursor: volledig automatisch

Doel: in Claude `/website-update` typen → Cursor past de site aan → draft PR verschijnt. Geen copy-paste.

## Overzicht

| Methode | Automatisch? | Extra deploy? |
|---------|--------------|---------------|
| **MCP bridge** (aanbevolen) | Ja | `npm install` in integrations/ |
| **Cursor Automation webhook** | Ja | Automation in dashboard |
| **GitHub repository_dispatch** | Ja | Alleen `CURSOR_API_KEY` secret |
| Copy-paste in Cursor | Nee | Geen |

## Aanbevolen setup

### Stap 1 — Cursor API key + GitHub

1. [cursor.com/dashboard](https://cursor.com/dashboard) → **API Keys** → nieuwe key
2. **Integrations** → GitHub → repo `personal-website` toegang geven
3. GitHub repo → **Settings → Secrets** → `CURSOR_API_KEY`

### Stap 2 — MCP bridge

```bash
cd integrations/claude-cursor-bridge
npm install
cp .env.example .env
# Vul CURSOR_API_KEY in
```

Koppel aan Claude Code of Claude Desktop:

```bash
# Vanuit repo-root
cp .mcp.json.example .mcp.json
# Pas CURSOR_API_KEY aan (of gebruik env var)
```

Herstart Claude. De tool `website_update` verschijnt in de connector-lijst.

### Stap 3 — Claude Project instructies

Maak een Claude Project "Portfolio" en plak:

```
Je bent de assistent voor het bijwerken van casperschepkens.nl.

Wanneer ik /website-update zeg of vraag de site bij te werken:
1. Vraag ontbrekende details (max 2 vragen)
2. Bouw een JSON update-spec (version 1, summary, changes[])
3. Roep de tool website_update aan met die spec
4. Bevestig met link naar https://cursor.com/agents

Schema: zie update-spec in de repo (.cursor/skills/website-update/references/update-spec.md)
Alle UI-tekst Nederlands. Datums YYYY-MM.
```

Upload als project knowledge: `references/update-spec.md` en `references/update-examples.md` uit deze skill.

### Stap 4 — Test

```
/website-update

Vizier-project: ik ben gestopt per juni 2026. Zet status op completed en voeg roadmap-item toe.
```

Verwacht: Claude roept `website_update` → Cursor agent start → draft PR binnen enkele minuten.

---

## Alternatief: Cursor Automation (webhook)

Handig als je al Automations gebruikt of MCP niet wilt draaien.

1. Maak automation op [cursor.com/automations](https://cursor.com/automations) volgens `.cursor/automations/website-update.md`
2. Trigger: **Webhook**, repo: `personal-website`
3. Kopieer webhook URL + auth token
4. In `integrations/claude-cursor-bridge/.env`:
   ```
   CURSOR_MODE=automation
   CURSOR_AUTOMATION_WEBHOOK_URL=https://api2.cursor.sh/automations/webhook/...
   CURSOR_AUTOMATION_AUTH_TOKEN=crsr_...
   ```

De MCP tool stuurt dan naar de Automation i.p.v. de Agents API.

---

## Alternatief: GitHub-only (claude.ai web, geen lokale MCP)

Als je Claude in de browser gebruikt zonder Desktop/Code:

1. Zet `CURSOR_API_KEY` als GitHub secret (stap 1)
2. Workflow `.github/workflows/website-update.yml` is al aanwezig
3. Geef Claude GitHub-connector toegang tot de repo
4. Project instructie:

```
Na het maken van de update-spec JSON, dispatch een GitHub repository_dispatch:
- event_type: website-update
- client_payload.update_spec: <de JSON als string>
```

Claude maakt de dispatch → GitHub Action → Cursor API → PR.

---

## Wat gebeurt er in Cursor?

De Cloud Agent (of Automation):

1. Clonet `personal-website`
2. Leest `.cursor/skills/website-update/SKILL.md`
3. Past MDX / `messages/nl.json` aan
4. Draait `npm run lint`
5. Pusht naar `cursor/...` branch
6. Opent draft PR

Jij reviewt en merged.

---

## Troubleshooting

| Symptoom | Fix |
|----------|-----|
| Claude roept tool niet aan | Check of MCP server connected is; vermeld expliciet `/website-update` |
| `CURSOR_API_KEY is not set` | Env var in `.mcp.json` of shell |
| Automation 401 | Auth token opnieuw genereren in dashboard |
| Agent kan repo niet clonen | GitHub-integratie in Cursor dashboard |
| Geen draft PR | Check agent run op cursor.com/agents |

Zie ook: `integrations/claude-cursor-bridge/README.md`
