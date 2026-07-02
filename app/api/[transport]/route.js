import { createMcpHandler, withMcpAuth } from "mcp-handler";
import { z } from "zod";
import { dispatchWebsiteUpdate, addIssueComment, getIssue, createIssue } from "@/lib/github-relay";

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
          "Maakt een GitHub issue aan in personal-website met update-spec JSON en plaatst een @cursor comment om Cursor te triggeren. Gebruik dit ALTIJD voor /website-update — niet de GitHub connector.",
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
                "Website-update gedispatched naar Cursor via GitHub.",
                `Issue: ${result.issue_url}`,
                `Nummer: #${result.issue_number}`,
                "Cursor zou een Cloud Agent moeten starten en een draft PR openen.",
              ].join("\n"),
            },
          ],
        };
      }
    );

    server.registerTool(
      "create_github_issue",
      {
        title: "Create GitHub issue",
        description: "Maakt een issue aan in personal-website (laag niveau).",
        inputSchema: {
          title: z.string().min(1),
          body: z.string().min(1),
          labels: z.array(z.string()).optional(),
        },
      },
      async ({ title, body, labels }) => {
        const issue = await createIssue({ title, body, labels });
        return {
          content: [
            {
              type: "text",
              text: `Issue aangemaakt: ${issue.html_url} (#${issue.number})`,
            },
          ],
        };
      }
    );

    server.registerTool(
      "add_github_issue_comment",
      {
        title: "Add GitHub issue comment",
        description: "Plaatst een comment op een bestaand issue in personal-website.",
        inputSchema: {
          issue_number: z.number().int().positive(),
          body: z.string().min(1),
        },
      },
      async ({ issue_number, body }) => {
        const comment = await addIssueComment(issue_number, body);
        return {
          content: [
            {
              type: "text",
              text: `Comment geplaatst: ${comment.html_url}`,
            },
          ],
        };
      }
    );

    server.registerTool(
      "get_github_issue",
      {
        title: "Get GitHub issue",
        description: "Haalt issue-details op voor status-checks.",
        inputSchema: {
          issue_number: z.number().int().positive(),
        },
      },
      async ({ issue_number }) => {
        const issue = await getIssue(issue_number);
        return {
          content: [
            {
              type: "text",
              text: JSON.stringify(
                {
                  number: issue.number,
                  title: issue.title,
                  state: issue.state,
                  url: issue.html_url,
                },
                null,
                2
              ),
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
    // Allow unauthenticated in dev if secret not set (local testing only)
    if (process.env.NODE_ENV === "development") {
      return { token: "dev", clientId: "local", scopes: ["github:write"] };
    }
    return undefined;
  }

  if (!bearerToken || bearerToken !== secret) {
    return undefined;
  }

  return {
    token: bearerToken,
    clientId: "casper",
    scopes: ["github:write"],
  };
}

const authHandler = withMcpAuth(handler, verifyToken, {
  required: process.env.NODE_ENV !== "development" || Boolean(process.env.MCP_BRIDGE_SECRET),
  requiredScopes: ["github:write"],
});

export { authHandler as GET, authHandler as POST };
