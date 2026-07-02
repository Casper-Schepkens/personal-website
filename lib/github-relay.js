const GITHUB_API = "https://api.github.com";

function getRepoParts() {
  const full = process.env.GITHUB_REPO || "Casper-Schepkens/personal-website";
  const [owner, repo] = full.split("/");
  if (!owner || !repo) {
    throw new Error("GITHUB_REPO must be in owner/repo format");
  }
  return { owner, repo };
}

function getToken() {
  const token = process.env.GITHUB_PAT;
  if (!token) {
    throw new Error("GITHUB_PAT is not configured on the server");
  }
  return token;
}

async function githubRequest(path, options = {}) {
  const token = getToken();
  const response = await fetch(`${GITHUB_API}${path}`, {
    ...options,
    headers: {
      Authorization: `Bearer ${token}`,
      Accept: "application/vnd.github+json",
      "X-GitHub-Api-Version": "2022-11-28",
      "Content-Type": "application/json",
      ...options.headers,
    },
  });

  const text = await response.text();
  let data;
  try {
    data = text ? JSON.parse(text) : {};
  } catch {
    data = { raw: text };
  }

  if (!response.ok) {
    const message = data?.message || response.statusText;
    throw new Error(`GitHub API ${response.status}: ${message}`);
  }

  return data;
}

export function formatWebsiteUpdateIssueBody(updateSpec) {
  const summary =
    typeof updateSpec.summary === "string"
      ? updateSpec.summary
      : "Website content update";

  const json = JSON.stringify(updateSpec, null, 2);

  return `## Samenvatting

${summary}

## Update-spec

<!-- website-update-spec: do not edit markers -->
\`\`\`json
${json}
\`\`\`
<!-- /website-update-spec -->

## Checklist

- [ ] Alleen content/ en messages/nl.json
- [ ] npm run lint
- [ ] Draft PR`;
}

export const CURSOR_TRIGGER_COMMENT = `@cursor

Voer de website-update skill uit: \`.cursor/skills/website-update/SKILL.md\`

Lees de update-spec tussen de \`website-update-spec\` markers in dit issue.
Pas alleen \`content/\` en \`messages/nl.json\` aan.
Draai \`npm run lint\`, commit op een \`cursor/*\` branch, en open een draft PR.

Sluit dit issue niet — laat Casper de PR reviewen.`;

export async function createIssue({ title, body, labels = ["website-update"] }) {
  const { owner, repo } = getRepoParts();
  return githubRequest(`/repos/${owner}/${repo}/issues`, {
    method: "POST",
    body: JSON.stringify({ title, body, labels }),
  });
}

export async function addIssueComment(issueNumber, body) {
  const { owner, repo } = getRepoParts();
  return githubRequest(`/repos/${owner}/${repo}/issues/${issueNumber}/comments`, {
    method: "POST",
    body: JSON.stringify({ body }),
  });
}

export async function getIssue(issueNumber) {
  const { owner, repo } = getRepoParts();
  return githubRequest(`/repos/${owner}/${repo}/issues/${issueNumber}`);
}

export async function dispatchWebsiteUpdate(updateSpec) {
  if (!updateSpec?.changes?.length) {
    throw new Error("update_spec must contain at least one change");
  }

  const summary = updateSpec.summary || "Website content update";
  const title = `[website-update] ${summary}`;

  const issue = await createIssue({
    title,
    body: formatWebsiteUpdateIssueBody(updateSpec),
    labels: ["website-update"],
  });

  await addIssueComment(issue.number, CURSOR_TRIGGER_COMMENT);

  return {
    issue_number: issue.number,
    issue_url: issue.html_url,
    title: issue.title,
    summary,
  };
}
