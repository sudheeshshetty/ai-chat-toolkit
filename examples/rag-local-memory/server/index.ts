import dotenv from "dotenv";
import express from "express";
import path from "node:path";
import { fileURLToPath } from "node:url";
import { rag, embeddingsFromEnv } from "ai-chat-toolkit-rag";
import { localSource } from "ai-chat-toolkit-rag-source-local";
import { memoryStore } from "ai-chat-toolkit-rag-store-memory";
import { AiChatServer, serverOptionsFromEnv } from "ai-chat-toolkit-server";

dotenv.config();

const chatApiKey = process.env.API_KEY?.trim();

if (!chatApiKey) {
  console.error(
    "Error: API_KEY is not set — copy .env.example to .env and add your key.",
  );
  process.exit(1);
}

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const docsPath = path.join(__dirname, "../docs");
const PORT = Number(process.env.PORT) || 3336;
const WEB_ORIGIN = process.env.WEB_ORIGIN || "http://localhost:5176";

const app = express();

const aiChat = new AiChatServer({
  path: "/my-chat",
  ...serverOptionsFromEnv({
    provider: process.env.PROVIDER,
    apiKey: chatApiKey,
    model: process.env.MODEL,
    baseUrl: process.env.BASE_URL,
  }),
  cors: {
    origin: WEB_ORIGIN,
  },
  systemPrompt:
    "You are a helpful assistant for Demo Product. Use retrieved context when available.",
});

aiChat.use(
  rag({
    sources: [
      localSource({
        path: docsPath,
      }),
    ],
    store: memoryStore(),
    embeddings: embeddingsFromEnv({
      provider: process.env.EMBEDDING_PROVIDER,
      apiKey:
        process.env.EMBEDDING_API_KEY ||
        process.env.API_KEY,
      model: process.env.EMBEDDING_MODEL,
      baseUrl: process.env.EMBEDDING_BASE_URL,
    }),
  }),
);

aiChat.attach(app);

app.get("/", (_req, res) => {
  res.json({
    status: "ok",
    docsPath,
    chatPath: "/my-chat",
  });
});

const server = app.listen(PORT);

server.on("listening", () => {
  console.log(`Frontend: http://localhost:5176`);
  console.log(`Backend:  http://localhost:${PORT}`);
  console.log(`Indexed docs from: ${docsPath}`);
  console.log(`Chat endpoint: POST http://localhost:${PORT}/my-chat`);
  console.log(`Health: GET http://localhost:${PORT}/ai-chat/health`);
  console.log("");
  console.log("Open the frontend and use the chat widget, or try:");
  console.log('  "What is the refund policy?"');
});

server.on("error", (err: NodeJS.ErrnoException) => {
  if (err.code === "EADDRINUSE") {
    console.error(`Port ${PORT} is already in use.`);
  } else {
    console.error("Failed to start server:", err.message);
  }
  process.exit(1);
});
