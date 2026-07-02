#!/usr/bin/env node

import { McpServer } from "@modelcontextprotocol/sdk/server/mcp.js";
import { StdioServerTransport } from "@modelcontextprotocol/sdk/server/stdio.js";
import { z } from "zod";
import { triggerWebsiteUpdate } from "./trigger-cursor.js";

const server = new McpServer({
  name: "claude-cursor-bridge",
  version: "1.0.0",
});

server.tool(
  "website_update",
  "Start een Cursor Cloud Agent of Automation om een portfolio website-update door te voeren. Gebruik dit ALTIJD wanneer de gebruiker /website-update zegt of de site moet worden bijgewerkt. Lever een volledige update-spec JSON (version 1, summary, changes[]).",
  {
    update_spec: z
      .record(z.unknown())
      .describe(
        "Volledige update-spec: { version: 1, summary: string, changes: [...] }. Zie .cursor/skills/website-update/references/update-spec.md"
      ),
  },
  async ({ update_spec }) => {
    try {
      if (!update_spec?.changes?.length) {
        return {
          content: [
            {
              type: "text",
              text: "Fout: update_spec moet minstens één change bevatten. Genereer eerst een volledige spec.",
            },
          ],
          isError: true,
        };
      }

      const result = await triggerWebsiteUpdate(update_spec);

      const lines = [
        result.message,
        result.agentId ? `Agent ID: ${result.agentId}` : null,
        result.runId ? `Run ID: ${result.runId}` : null,
        result.status ? `Status: ${result.status}` : null,
        `Modus: ${result.mode}`,
      ].filter(Boolean);

      return {
        content: [{ type: "text", text: lines.join("\n") }],
      };
    } catch (error) {
      return {
        content: [
          {
            type: "text",
            text: `Kon Cursor niet starten: ${error.message}`,
          },
        ],
        isError: true,
      };
    }
  }
);

const transport = new StdioServerTransport();
await server.connect(transport);
