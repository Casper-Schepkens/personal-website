# Claude ↔ Cursor bridge

Start Cursor automatisch vanuit Claude wanneer je `/website-update` gebruikt.

## Architectuur

```
Claude (/website-update)
    → MCP tool: website_update
        → Cursor Cloud Agents API  (standaard)
        of Cursor Automation webhook (optioneel)
            → Cloud Agent past content aan
            → Draft PR op GitHub
```

**Alternatief zonder MCP:** Claude dispatcht een GitHub `repository_dispatch` event → `.github/workflows/website-update.yml` start Cursor.

## Snelste setup (15 min)

### 1. Cursor API key

1. Ga naar [cursor.com/dashboard](https://cursor.com/dashboard) → API Keys
2. Maak een key aan
3. Zorg dat GitHub-repo `personal-website` gekoppeld is aan Cloud Agents

### 2. MCP bridge installeren

```bash
cd integrations/claude-cursor-bridge
npm install
cp .env.example .env
# Vul CURSOR_API_KEY in
```

### 3. Koppel aan Claude

**Claude Code / Claude Desktop:**

```bash
cp .mcp.json.example ~/.claude/.mcp.json   # of project-root .mcp.json
# Pas pad en CURSOR_API_KEY aan
```

Herstart Claude. Je zou de tool `website_update` moeten zien.

**Claude.ai (web) — zonder lokale MCP:**

Gebruik de GitHub-fallback (stap 4b hieronder) of deploy de HTTP bridge (`npm run start:http`) op Railway/Fly.io en voeg toe als remote connector.

### 4a. Test MCP (aanbevolen)

In Claude:

```
/website-update

IKnowright staat nu in publieke beta. Update de summary en voeg een roadmap-milestone toe voor juli 2026.
```

Claude bouwt de JSON en roept `website_update` aan. Check https://cursor.com/agents en wacht op de draft PR.

### 4b. GitHub fallback (geen MCP nodig)

1. Voeg `CURSOR_API_KEY` toe als GitHub repo secret
2. In Claude Project instructies: "Na het maken van de update-spec, dispatch repository_dispatch event website-update met client_payload.update_spec"
3. Claude heeft GitHub-connector nodig met repo-toegang

Handmatige test:

```bash
gh api repos/Casper-Schepkens/personal-website/dispatches \
  -f event_type=website-update \
  -f 'client_payload[update_spec]={"version":1,"summary":"test","changes":[]}'
```

## Optie: Cursor Automation (webhook)

Als je liever Automations gebruikt:

1. Maak automation aan volgens `.cursor/automations/website-update.md`
2. Zet in `.env`:
   ```
   CURSOR_MODE=automation
   CURSOR_AUTOMATION_WEBHOOK_URL=...
   CURSOR_AUTOMATION_AUTH_TOKEN=...
   ```

Automations draaien altijd in Max Mode (cloud agent pricing).

## Bestanden

| Bestand | Doel |
|---------|------|
| `src/mcp-server.js` | MCP stdio server (tool: `website_update`) |
| `src/http-server.js` | HTTP POST `/trigger` voor remote deploy |
| `src/trigger-cursor.js` | Gedeelde Cursor API-logica |
| `.env.example` | Benodigde secrets |

## Troubleshooting

| Probleem | Oplossing |
|----------|-----------|
| Tool niet zichtbaar in Claude | Herstart Claude; check `.mcp.json` pad en `node` bereikbaar |
| 401 op Automation webhook | Regenereer auth header in Automations dashboard |
| Agent start niet | Check GitHub-koppeling in Cursor dashboard |
| Geen PR | Agent heeft repo-toegang nodig; check run logs op cursor.com/agents |
