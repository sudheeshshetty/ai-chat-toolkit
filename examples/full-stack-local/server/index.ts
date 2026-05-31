import dotenv from "dotenv";
import express from "express";
import { AiChatServer } from "ai-chat-toolkit-server";

dotenv.config();

const app = express();
const PORT = Number(process.env.PORT) || 3333;

const aiChat = new AiChatServer({
  path: "/my-chat",
  provider: "groq",
  apiKey: process.env.GROQ_API_KEY,
  model: process.env.GROQ_MODEL || "llama-3.3-70b-versatile",
  cors: {
    origin: "http://localhost:5173",
    credentials: true,
  },
  systemPrompt:
    "You are a helpful demo assistant. Use tools when needed. Keep answers concise.",
});

aiChat.addTools([
  {
    name: "get_products",
    description: "Get product list by category",
    inputSchema: {
      type: "object",
      properties: {
        category: { type: "string" },
      },
      required: ["category"],
    },
    handler: async (input) => {
      const category = String(input.category ?? "general");
      return [
        { id: "p1", name: "Sample Item A", category },
        { id: "p2", name: "Sample Item B", category },
        { id: "p3", name: "Sample Item C", category },
      ];
    },
  },
  {
    name: "get_order_status",
    description: "Get order status by order ID",
    inputSchema: {
      type: "object",
      properties: {
        orderId: { type: "string" },
      },
      required: ["orderId"],
    },
    handler: async (input) => {
      const orderId = String(input.orderId ?? "unknown");
      return {
        orderId,
        status: "shipped",
        carrier: "Demo Logistics",
        eta: "2026-06-05",
      };
    },
  },
  {
    name: "get_support_articles",
    description: "Search support articles by keyword",
    inputSchema: {
      type: "object",
      properties: {
        query: { type: "string" },
      },
      required: ["query"],
    },
    handler: async (input) => {
      const query = String(input.query ?? "");
      return [
        {
          id: "doc-101",
          title: `Getting started with ${query || "your account"}`,
          summary: "Mock documentation article for local testing.",
        },
        {
          id: "doc-102",
          title: `Troubleshooting ${query || "common issues"}`,
          summary: "Another mock article returned by the demo tool.",
        },
      ];
    },
  },
]);

aiChat.attach(app);

app.get("/", (_req, res) => {
  res.json({ status: "ok" });
});

const server = app.listen(PORT);

server.on("listening", () => {
  console.log(`Backend listening on http://localhost:${PORT}`);
  console.log(`Chat endpoint: POST http://localhost:${PORT}/my-chat`);
  console.log(`Health: GET http://localhost:${PORT}/ai-chat/health`);
});

server.on("error", (err: NodeJS.ErrnoException) => {
  if (err.code === "EADDRINUSE") {
    console.error(`Port ${PORT} is already in use.`);
  } else {
    console.error("Failed to start server:", err.message);
  }
  process.exit(1);
});
