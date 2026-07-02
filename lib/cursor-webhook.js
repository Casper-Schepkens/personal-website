export async function dispatchWebsiteUpdate(updateSpec) {
  if (!updateSpec?.changes?.length) {
    throw new Error("update_spec must contain at least one change");
  }

  const webhookUrl = process.env.CURSOR_AUTOMATION_WEBHOOK_URL;
  const authToken = process.env.CURSOR_AUTOMATION_AUTH_TOKEN;

  if (!webhookUrl) {
    throw new Error("CURSOR_AUTOMATION_WEBHOOK_URL is not configured");
  }
  if (!authToken) {
    throw new Error("CURSOR_AUTOMATION_AUTH_TOKEN is not configured");
  }

  const response = await fetch(webhookUrl, {
    method: "POST",
    headers: {
      Authorization: `Bearer ${authToken}`,
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      event: "website-update",
      summary: updateSpec.summary,
      update_spec: updateSpec,
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
      `Cursor webhook error (${response.status}): ${data?.message || text || response.statusText}`
    );
  }

  return {
    summary: updateSpec.summary,
    status: response.status,
    response: data,
  };
}
