# ai-chat-toolkit-server

Plug-and-play AI chat backend for Express apps with LLM provider support and MCP-style tool calling.

Works with the [`ai-chat-toolkit-widget`](https://www.npmjs.com/package/ai-chat-toolkit-widget) frontend or any client that follows the chat API contract.

## Install

```bash
npm install ai-chat-toolkit-server express
```

## Basic Usage

```ts
import express from "express";
import { AiChatServer } from "ai-chat-toolkit-server";

const app = express();

const aiChat = new AiChatServer({
  path: "/ai-chat/custom",
  provider: "groq",
  apiKey: process.env.GROQ_API_KEY,
  model: "llama-3.3-70b-versatile",
  cors: {
    origin: "http://localhost:5173",
  },
});

aiChat.attach(app);

app.listen(3000);
```

## OpenAI Usage

```ts
const aiChat = new AiChatServer({
  provider: "openai-compatible",
  apiKey: process.env.OPENAI_API_KEY,
  model: "gpt-4o-mini",
});
```

## Groq Usage

```ts
const aiChat = new AiChatServer({
  provider: "groq",
  apiKey: process.env.GROQ_API_KEY,
  model: "llama-3.3-70b-versatile",
});
```

Groq uses the OpenAI-compatible provider internally with `https://api.groq.com/openai/v1`.

## OpenRouter Usage

```ts
const aiChat = new AiChatServer({
  provider: "openai-compatible",
  apiKey: process.env.OPENROUTER_API_KEY,
  model: "deepseek/deepseek-r1:free",
  baseUrl: "https://openrouter.ai/api/v1",
});
```

## Gemini Usage

```ts
const aiChat = new AiChatServer({
  provider: "gemini",
  apiKey: process.env.GEMINI_API_KEY,
  model: "gemini-1.5-flash",
});
```

> **Note:** Gemini tool calling is not implemented yet (chat only).

## Ollama Usage

```ts
const aiChat = new AiChatServer({
  provider: "ollama",
  model: "llama3.1",
  baseUrl: "http://localhost:11434",
});
```

> **Note:** Ollama tool calling is not implemented yet (chat only).

## Tool Registration

```ts
aiChat.addTools([
  {
    name: "get_products",
    description: "Get products by category",
    inputSchema: {
      type: "object",
      properties: {
        category: { type: "string" },
      },
      required: ["category"],
    },
    handler: async ({ category }, context) => {
      return [{ id: "p1", name: "Demo Product", category }];
    },
  },
]);
```

Tools run **only on the server**. The LLM may call them during a chat turn (up to `maxToolRounds`, default `3`).

## CORS Configuration

```ts
cors: {
  origin: "http://localhost:5173",
  credentials: true,
}
```

CORS middleware applies **only** to AI chat routes (`POST` chat path, `GET /ai-chat/health`, `GET /ai-chat/tools`), not your entire Express app.

## Routes

When you call `aiChat.attach(app)`:

| Method | Path | Description |
|--------|------|-------------|
| POST | `{path}` (default `/ai-chat/custom`) | Chat |
| GET | `/ai-chat/health` | Health check |
| GET | `/ai-chat/tools` | List registered tools |

## Widget Integration

```html
<script src="https://cdn.jsdelivr.net/npm/ai-chat-toolkit-widget/dist/widget.global.js"></script>

<ai-chat
  title="AI Assistant"
  subtitle="Ask me anything"
  backend-url="http://localhost:3000"
  path="/ai-chat/custom"
></ai-chat>
```

## API Contract

**Request** `POST {path}`

```json
{
  "message": "Hello",
  "history": [
    { "role": "user", "content": "Hi" },
    { "role": "assistant", "content": "Hello" }
  ]
}
```

**Response**

```json
{
  "message": "Final assistant response"
}
```

**Health** `GET /ai-chat/health`

```json
{
  "status": "ok",
  "package": "ai-chat-toolkit-server"
}
```

**Tools** `GET /ai-chat/tools`

```json
{
  "tools": [
    { "name": "get_products", "description": "Get products by category" }
  ]
}
```

## Options

| Option | Default | Description |
|--------|---------|-------------|
| `path` | `/ai-chat/custom` | Chat POST path |
| `provider` | — | `openai-compatible`, `groq`, `gemini`, `ollama` |
| `apiKey` | — | Provider API key (not required for Ollama) |
| `model` | — | Model name |
| `baseUrl` | Provider default | API base URL |
| `systemPrompt` | — | Optional system message |
| `maxToolRounds` | `3` | Max tool-call loops per request |
| `cors` | — | CORS for chat routes only |

## Security Notes

- **Never expose API keys in the frontend.** Keys stay on the server.
- **Tools run only on the backend.** Use `context.request` for auth inside handlers.
- **Validate permissions** before executing sensitive tools.
- **Write operations** should use `requiresConfirmation: true` (returns an error to the model until confirmation flow is implemented).
- **Do not expose unrestricted database tools** to the model.
- **Restrict CORS origins** in production.

## Roadmap

- Streaming responses
- Tool confirmation flow
- Claude support
- Bedrock support
- Gemini tool calling
- Ollama tool calling
- Fastify / NestJS adapters

## License

MIT
