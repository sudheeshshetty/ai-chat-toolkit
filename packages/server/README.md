# ai-chat-toolkit-server

Plug-and-play AI chat backend for Express apps. Connect any LLM provider and register custom tools — the widget handles the UI, this handles the intelligence.

Works with [`ai-chat-toolkit-widget`](https://www.npmjs.com/package/ai-chat-toolkit-widget) or any client that follows the [chat API contract](#api-contract).

---

## Install

```bash
npm install ai-chat-toolkit-server express
```

---

## Quick start

```ts
import express from "express";
import { AiChatServer } from "ai-chat-toolkit-server";

const app = express();

const aiChat = new AiChatServer({
  provider: "groq",
  apiKey: process.env.API_KEY,
  model: "llama-3.3-70b-versatile",
  cors: { origin: "http://localhost:5173" },
});

aiChat.attach(app);
app.listen(3000, () => console.log("Listening on http://localhost:3000"));
```

That's it. The server now accepts `POST /ai-chat/custom` and responds to chat messages.

---

## Providers

### Groq

```ts
new AiChatServer({
  provider: "groq",
  apiKey: process.env.GROQ_API_KEY,
  model: "llama-3.3-70b-versatile",
});
```

Groq uses the OpenAI-compatible format internally with `https://api.groq.com/openai/v1`. Supports tool calling.

### OpenAI

```ts
new AiChatServer({
  provider: "openai-compatible",
  apiKey: process.env.OPENAI_API_KEY,
  model: "gpt-4o-mini",
});
```

### OpenRouter (or any OpenAI-compatible API)

```ts
new AiChatServer({
  provider: "openai-compatible",
  apiKey: process.env.OPENROUTER_API_KEY,
  model: "deepseek/deepseek-r1:free",
  baseUrl: "https://openrouter.ai/api/v1",
});
```

### Gemini

```ts
new AiChatServer({
  provider: "gemini",
  apiKey: process.env.GEMINI_API_KEY,
  model: "gemini-1.5-flash",
});
```

> Tool calling is not yet implemented for Gemini (chat only).

### Ollama (local models)

```ts
new AiChatServer({
  provider: "ollama",
  model: "llama3.1",
  baseUrl: "http://localhost:11434", // default
});
```

> Tool calling is not yet implemented for Ollama (chat only). No API key required.

---

## Tool registration

Register tools the LLM can call during a conversation. Tools run **only on the server** — never exposed to the browser.

```ts
aiChat.addTools([
  {
    name: "get_products",
    description: "Get products by category. Use when the user asks to browse or list products.",
    inputSchema: {
      type: "object",
      properties: {
        category: { type: "string", description: "Category name, e.g. Electronics" },
      },
      required: ["category"],
    },
    handler: async ({ category }, context) => {
      // context.request gives you the Express Request for auth checks
      return [{ id: "p1", name: "Demo Product", category }];
    },
  },
]);
```

The LLM decides when to call a tool. Up to `maxToolRounds` tool-call loops happen per request (default: `3`). The final text reply is returned to the widget.

---

## System prompt

Shape the assistant's personality and behavior:

```ts
new AiChatServer({
  provider: "groq",
  apiKey: process.env.API_KEY,
  model: "llama-3.3-70b-versatile",
  systemPrompt: `You are a helpful support assistant for Acme Corp.
Keep answers concise and friendly. Only call tools when the user asks for specific data.`,
});
```

---

## CORS configuration

CORS middleware is applied **only** to the AI chat routes — not your entire Express app.

```ts
// Single origin
cors: { origin: "http://localhost:5173" }

// Multiple allowed origins
cors: { origin: ["https://app.example.com", "https://admin.example.com"] }

// Allow all origins — development only
cors: { origin: true }

// Disable CORS headers entirely
cors: { origin: false }
```

**Need `Access-Control-Allow-Credentials`?** The built-in CORS helper does not set this header. Use the [`cors`](https://www.npmjs.com/package/cors) npm package on your Express app instead — it is the community standard for credentials scenarios and handles the full spec correctly:

```ts
import cors from "cors";

app.use(cors({ origin: "https://app.example.com", credentials: true }));
aiChat.attach(app); // attach after cors middleware
```

---

## Routes

Calling `aiChat.attach(app)` registers these routes:

| Method | Path | Description |
|--------|------|-------------|
| `POST` | `{path}` (default `/ai-chat/custom`) | Send a chat message |
| `GET` | `/ai-chat/health` | Health check |
| `GET` | `/ai-chat/tools` | List registered tools |

Change the chat path:

```ts
new AiChatServer({
  path: "/my-chat",
  // ...
});
```

---

## API contract

**Request** `POST {path}`

```json
{
  "message": "What products do you have?",
  "history": [
    { "role": "user", "content": "Hi" },
    { "role": "assistant", "content": "Hello! How can I help?" }
  ]
}
```

**Response**

```json
{ "message": "Here are our products..." }
```

**Error response**

```json
{ "error": "Message cannot be empty." }
```

---

## All options

| Option | Default | Description |
|--------|---------|-------------|
| `provider` | — | `"groq"`, `"openai-compatible"`, `"gemini"`, `"ollama"` |
| `apiKey` | — | Provider API key (not required for Ollama) |
| `model` | — | Model name (e.g. `"llama-3.3-70b-versatile"`) |
| `baseUrl` | Provider default | Override the provider's API base URL |
| `path` | `/ai-chat/custom` | Chat endpoint path |
| `systemPrompt` | — | System message sent to the LLM on every request |
| `maxToolRounds` | `3` | Max tool-call loops per request |
| `cors` | — | CORS config (see above) |

---

## Security notes

- **Keep API keys on the server.** Never send them to the browser.
- **Tools run server-side only.** Use `context.request` inside handlers for auth checks.
- **Restrict CORS origins in production.** Use `origin: "https://yourapp.com"` not `origin: true`.
- **Use `requiresConfirmation: true`** for any tool that writes data — the LLM will not be able to call it until a confirmation flow is implemented.
- **Do not expose unrestricted database access** as a tool.

---

## Roadmap

- [ ] Streaming responses
- [ ] Tool confirmation flow
- [ ] Claude / Bedrock support
- [ ] Gemini tool calling
- [ ] Ollama tool calling
- [ ] Fastify / NestJS adapters

---

## License

MIT
