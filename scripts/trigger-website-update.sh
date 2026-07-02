#!/usr/bin/env bash
# Trigger a Cursor Cloud Agent to run the website-update skill.
# Usage:
#   export CURSOR_API_KEY="cursor_..."
#   ./scripts/trigger-website-update.sh path/to/update-spec.json
#   ./scripts/trigger-website-update.sh --text "Update IKnowright naar completed"

set -euo pipefail

REPO_URL="${REPO_URL:-}"
BASE_REF="${BASE_REF:-master}"
AUTO_PR="${AUTO_PR:-true}"

usage() {
  cat <<'EOF'
Usage:
  REPO_URL=https://github.com/owner/repo ./scripts/trigger-website-update.sh <spec.json>
  REPO_URL=https://github.com/owner/repo ./scripts/trigger-website-update.sh --text "free-form update brief"

Environment:
  CURSOR_API_KEY   Required. From Cursor Dashboard → API Keys.
  REPO_URL         Required. GitHub repo URL for the portfolio.
  BASE_REF         Optional. Starting branch (default: master).
  AUTO_PR          Optional. true|false (default: true).
EOF
}

if [[ -z "${CURSOR_API_KEY:-}" ]]; then
  echo "Error: CURSOR_API_KEY is not set." >&2
  usage
  exit 1
fi

if [[ -z "$REPO_URL" ]]; then
  echo "Error: REPO_URL is not set." >&2
  usage
  exit 1
fi

PROMPT_BODY=""

if [[ "${1:-}" == "--text" ]]; then
  shift
  PROMPT_BODY="$*"
elif [[ -n "${1:-}" ]]; then
  if [[ ! -f "$1" ]]; then
    echo "Error: file not found: $1" >&2
    exit 1
  fi
  PROMPT_BODY="$(cat "$1")"
else
  usage
  exit 1
fi

PROMPT=$(cat <<EOF
Voer de website-update skill uit (.cursor/skills/website-update/SKILL.md).

Instructies:
- Pas alleen content aan (content/, messages/nl.json)
- Volg references/update-spec.md als de input JSON is
- Draai npm run lint
- Commit op een cursor/* branch en open een draft PR als autoCreatePR aan staat

Update-inhoud:
${PROMPT_BODY}
EOF
)

payload=$(jq -n \
  --arg text "$PROMPT" \
  --arg url "$REPO_URL" \
  --arg ref "$BASE_REF" \
  --argjson autoPr "$([ "$AUTO_PR" = "true" ] && echo true || echo false)" \
  '{
    prompt: { text: $text },
    repos: [{ url: $url, startingRef: $ref }],
    autoCreatePR: $autoPr
  }')

response=$(curl -sS --request POST \
  --url "https://api.cursor.com/v1/agents" \
  -u "${CURSOR_API_KEY}:" \
  --header "Content-Type: application/json" \
  --data "$payload")

echo "$response" | jq .

agent_id=$(echo "$response" | jq -r '.agent.id // empty')
if [[ -n "$agent_id" ]]; then
  echo ""
  echo "Agent started: $agent_id"
  echo "Track at: https://cursor.com/agents"
fi
