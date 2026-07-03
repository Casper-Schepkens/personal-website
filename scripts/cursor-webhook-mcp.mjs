#!/usr/bin/env node
/**
 * Local MCP server for Claude Desktop — no website needed.
 * Forwards website_update_dispatch to Cursor Automation webhook.
 *
 * Claude Desktop config (~/Library/Application Support/Claude/claude_desktop_config.json):
 * {
 *   "mcpServers": {
 *     "cursor-webhook": {
 *       "command": "node",
 *       "args": ["/ABSOLUTE/PATH/TO/personal-website/scripts/cursor-webhook-mcp.mjs"],
 *       "env": {
 *         "CURSOR_AUTOMATION_WEBHOOK_URL": "https://api2.cursor.sh/automations/webhook/...",
 *         "CURSOR_AUTOMATION_AUTH_TOKEN": "crsr_..."
 *       }
 *     }
 *   }
 * }
 */

import { McpServer } from "@modelcontextprotocol/sdk/server/mcp.js";
import { StdioServerTransport } from "@modelcontextprotocol/sdk/server/stdio.js";
import { z } from "zod";

async function dispatchWebsiteUpdate(updateSpec) {
  if (!updateSpec?.changes?.length) {
    throw new Error("update_spec must contain at least one change");
  }

  const webhookUrl = process.env.CURSOR_AUTOMATION_WEBHOOK_URL;
  const authToken = process.env.CURSOR_AUTOMATION_AUTH_TOKEN;

  if (!webhookUrl) throw new Error("CURSOR_AUTOMATION_WEBHOOK_URL is not set");
  if (!authToken) throw new Error("CURSOR_AUTOMATION_AUTH_TOKEN is not set");

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
  if (!response.ok) {
    throw new Error(`Cursor webhook ${response.status}: ${text || response.statusText}`);
  }

  return updateSpec.summary;
}

const server = new McpServer({ name: "cursor-webhook", version: "1.0.0" });

server.tool(
  "website_update_dispatch",
  "Start Cursor Automation voor een portfolio website-update. Gebruik ALTIJD voor /website-update.",
  {
    update_spec: z.object({
      version: z.number().int(),
      summary: z.string().min(1),
      changes: z.array(z.record(z.unknown())).min(1),
    }),
  },
  async ({ update_spec }) => {
    const summary = await dispatchWebsiteUpdate(update_spec);
    return {
      content: [
        {
          type: "text",
          text: [
            "Cursor Automation gestart.",
            `Samenvatting: ${summary}`,
            "https://cursor.com/automations",
          ].join("\n"),
        },
      ],
    };
  }
);

const transport = new StdioServerTransport();
await server.connect(transport);
