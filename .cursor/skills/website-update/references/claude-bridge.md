# Claude → Cursor brug

Claude draait buiten Cursor en kan de IDE niet direct aansturen. Er zijn drie praktische manieren om updates door te geven.

## Optie A — Copy-paste (snelst, geen setup)

1. Praat met Claude over wat er moet veranderen
2. Vraag Claude om een **update-spec JSON** (zie `update-spec.md`) of een korte Nederlandse brief
3. Open Cursor in deze repo
4. Typ `/website-update` en plak de output

**Claude system prompt (plak in een Claude Project):**

```
Je helpt Casper zijn portfolio-site bijwerken. De site gebruikt MDX in content/projects/ en content/roadmap/, plus messages/nl.json voor UI-tekst.

Wanneer Casper een update wil:
1. Stel verduidelijkende vragen als info ontbreekt
2. Lever een JSON update-spec volgens dit schema: version 1, summary, changes[] met types project_update | project_new | roadmap_new | ui_text | about_skills
3. Voeg onder de JSON een korte Nederlandse samenvatting
4. Zeg tegen Casper: "Plak dit in Cursor met /website-update"

Regels:
- Alle UI-tekst in het Nederlands
- Datums als YYYY-MM
- status alleen "active" of "completed"
- Minimale wijzigingen; alleen wat gevraagd is
```

## Optie B — GitHub Issue + Cursor Cloud Agent (semi-automatisch)

1. Claude genereert de update-spec of issue-tekst
2. Maak een GitHub issue aan (handmatig of via Claude met GitHub-integratie)
3. Start een Cloud Agent:
   - Comment `@cursor` op het issue, of
   - Roep de [Cloud Agents API](https://cursor.com/docs/cloud-agent/api/endpoints) aan

**API-voorbeeld:**

```bash
curl --request POST \
  --url https://api.cursor.com/v1/agents \
  -u "$CURSOR_API_KEY:" \
  --header 'Content-Type: application/json' \
  --data '{
    "prompt": {
      "text": "Voer /website-update uit met deze spec:\n\n<PASTE JSON HERE>\n\nVolg de skill website-update in .cursor/skills/. Commit op een feature branch en open een draft PR."
    },
    "repos": [{ "url": "https://github.com/<owner>/<repo>", "startingRef": "master" }],
    "autoCreatePR": true
  }'
```

Gebruik `scripts/trigger-website-update.sh` (indien aanwezig) om de curl-call te vereenvoudigen.

## Optie C — Geplande check-in (Cursor Automations)

Voor periodieke reviews ("welke projecten zijn verouderd?"):

1. Cursor Dashboard → Automations
2. Trigger: wekelijks of bij GitHub-event
3. Prompt: "Lees content/projects/, vergelijk met recente commits/issues, stel updates voor of voer /website-update uit als er een spec in issue #X staat."

## Aanbevolen flow voor Casper

| Situatie | Aanpak |
|----------|--------|
| Snelle content-tweak | Optie A |
| Grotere update met review | Optie B (PR) |
| Periodieke onderhoudsronde | Optie C |

## Wat Claude wél en niet kan

| Kan | Kan niet |
|-----|----------|
| Update-spec genereren | Direct bestanden in repo wijzigen (zonder GitHub/API) |
| Issue-tekst schrijven | Cursor skill laden zonder dat jij Cursor start |
| Vragen stellen over ontbrekende info | `npm run lint` draaien |

De **update-spec** is het contract tussen Claude en Cursor: houd het formaat stabiel zodat beide kanten het begrijpen.
