/**
 * Triggers a Cursor Cloud Agent or Automation webhook with a website update spec.
 */

const DEFAULT_REPO = "https://github.com/Casper-Schepkens/personal-website";

function buildAgentPrompt(updateSpec) {
  const specText =
    typeof updateSpec === "string" ? updateSpec : JSON.stringify(updateSpec, null, 2);

  return `Voer de website-update skill uit (.cursor/skills/website-update/SKILL.md).

Instructies:
- Pas alleen content aan (content/, messages/nl.json)
- Volg references/update-spec.md voor de JSON hieronder
- Draai npm run lint
- Commit op een cursor/* branch en open een draft PR

Update-spec:
${specText}`;
}

export async function triggerViaAgent(updateSpec, env = process.env) {
  const apiKey = env.CURSOR_API_KEY;
  const repoUrl = env.CURSOR_REPO_URL || DEFAULT_REPO;
  const baseRef = env.CURSOR_BASE_REF || "master";

  if (!apiKey) {
    throw new Error("CURSOR_API_KEY is not set");
  }

  const response = await fetch("https://api.cursor.com/v1/agents", {
    method: "POST",
    headers: {
      Authorization: `Basic ${Buffer.from(`${apiKey}:`).toString("base64")}`,
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      name: "Website update",
      prompt: { text: buildAgentPrompt(updateSpec) },
      repos: [{ url: repoUrl, startingRef: baseRef }],
      autoCreatePR: true,
    }),
  });

  const data = await response.json();

  if (!response.ok) {
    const message = data?.message || data?.error || response.statusText;
    throw new Error(`Cursor API error (${response.status}): ${message}`);
  }

  return {
    mode: "agent",
    agentId: data.agent?.id,
    runId: data.run?.id,
    status: data.run?.status || data.agent?.status,
    message: "Cursor Cloud Agent gestart. Bekijk voortgang op https://cursor.com/agents",
  };
}

export async function triggerViaAutomation(updateSpec, env = process.env) {
  const webhookUrl = env.CURSOR_AUTOMATION_WEBHOOK_URL;
  const authToken = env.CURSOR_AUTOMATION_AUTH_TOKEN;

  if (!webhookUrl) {
    throw new Error("CURSOR_AUTOMATION_WEBHOOK_URL is not set");
  }
  if (!authToken) {
    throw new Error("CURSOR_AUTOMATION_AUTH_TOKEN is not set");
  }

  const summary =
    typeof updateSpec === "object" && updateSpec?.summary
      ? updateSpec.summary
      : "Website content update";

  const response = await fetch(webhookUrl, {
    method: "POST",
    headers: {
      Authorization: `Bearer ${authToken}`,
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      event: "website-update",
      summary,
      update_spec: updateSpec,
      requested_at: new Date().toISOString(),
    }),
  });

  const text = await response.text();
  let data;
  try {
    data = text ? JSON.parse(text) : {};
  } catch {
    data = { raw: text };
  }

  if (!response.ok) {
    throw new Error(
      `Cursor Automation webhook error (${response.status}): ${data?.message || text || response.statusText}`
    );
  }

  return {
    mode: "automation",
    status: response.status,
    message:
      "Cursor Automation gestart via webhook. Bekijk runs op https://cursor.com/automations",
    response: data,
  };
}

export async function triggerWebsiteUpdate(updateSpec, env = process.env) {
  const mode = (env.CURSOR_MODE || "agent").toLowerCase();

  if (mode === "automation") {
    return triggerViaAutomation(updateSpec, env);
  }

  return triggerViaAgent(updateSpec, env);
}
