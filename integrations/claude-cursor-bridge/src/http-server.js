#!/usr/bin/env node
/**
 * Minimal HTTP bridge for Claude remote MCP / manual testing.
 * POST /trigger with { "update_spec": {...} } and header X-Bridge-Secret.
 */

import { createServer } from "node:http";
import { triggerWebsiteUpdate } from "./trigger-cursor.js";

const PORT = Number(process.env.PORT || 8787);
const BRIDGE_SECRET = process.env.BRIDGE_SECRET;

function readBody(req) {
  return new Promise((resolve, reject) => {
    const chunks = [];
    req.on("data", (chunk) => chunks.push(chunk));
    req.on("end", () => resolve(Buffer.concat(chunks).toString("utf8")));
    req.on("error", reject);
  });
}

const server = createServer(async (req, res) => {
  res.setHeader("Content-Type", "application/json");

  if (req.method === "GET" && req.url === "/health") {
    res.writeHead(200);
    res.end(JSON.stringify({ ok: true }));
    return;
  }

  if (req.method !== "POST" || req.url !== "/trigger") {
    res.writeHead(404);
    res.end(JSON.stringify({ error: "Not found" }));
    return;
  }

  if (BRIDGE_SECRET && req.headers["x-bridge-secret"] !== BRIDGE_SECRET) {
    res.writeHead(401);
    res.end(JSON.stringify({ error: "Unauthorized" }));
    return;
  }

  try {
    const raw = await readBody(req);
    const body = raw ? JSON.parse(raw) : {};
    const updateSpec = body.update_spec || body;

    const result = await triggerWebsiteUpdate(updateSpec);
    res.writeHead(200);
    res.end(JSON.stringify({ ok: true, ...result }));
  } catch (error) {
    res.writeHead(500);
    res.end(JSON.stringify({ ok: false, error: error.message }));
  }
});

server.listen(PORT, () => {
  console.error(`claude-cursor-bridge HTTP listening on :${PORT}`);
});
