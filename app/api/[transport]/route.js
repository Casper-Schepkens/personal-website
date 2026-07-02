import { createMcpHandler, withMcpAuth } from "mcp-handler";
import { z } from "zod";
import { dispatchWebsiteUpdate } from "@/lib/cursor-webhook";

export const runtime = "nodejs";
export const maxDuration = 60;

const updateSpecSchema = z.object({
  version: z.number().int(),
  summary: z.string().min(1),
  changes: z.array(z.record(z.unknown())).min(1),
});

const handler = createMcpHandler(
  (server) => {
    server.registerTool(
      "website_update_dispatch",
      {
        title: "Website update dispatch",
        description:
          "Start een Cursor Cloud Agent via de Automation webhook om een portfolio website-update door te voeren. Gebruik dit ALTIJD voor /website-update.",
        inputSchema: {
          update_spec: updateSpecSchema,
        },
      },
      async ({ update_spec }) => {
        const result = await dispatchWebsiteUpdate(update_spec);
        return {
          content: [
            {
              type: "text",
              text: [
                "Cursor Automation gestart.",
                `Samenvatting: ${result.summary}`,
                "Bekijk voortgang op https://cursor.com/automations",
                "Je krijgt een draft PR op GitHub wanneer de agent klaar is.",
              ].join("\n"),
            },
          ],
        };
      }
    );
  },
  {},
  {
    basePath: "/api",
    maxDuration: 60,
    verboseLogs: process.env.NODE_ENV === "development",
  }
);

async function verifyToken(_req, bearerToken) {
  const secret = process.env.MCP_BRIDGE_SECRET;
  if (!secret) {
    if (process.env.NODE_ENV === "development") {
      return { token: "dev", clientId: "local", scopes: ["cursor:trigger"] };
    }
    return undefined;
  }

  if (!bearerToken || bearerToken !== secret) {
    return undefined;
  }

  return {
    token: bearerToken,
    clientId: "casper",
    scopes: ["cursor:trigger"],
  };
}

const authHandler = withMcpAuth(handler, verifyToken, {
  required: process.env.NODE_ENV !== "development" || Boolean(process.env.MCP_BRIDGE_SECRET),
  requiredScopes: ["cursor:trigger"],
});

export { authHandler as GET, authHandler as POST };
