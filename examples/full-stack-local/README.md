# Full Stack Local Example

End-to-end demo that wires **local workspace packages** together before publishing:

- `packages/widget` → `ai-chat-toolkit-widget`
- `packages/server` → `ai-chat-toolkit-server`

This example does **not** use published npm versions. It is for monorepo integration testing only.

## What it includes

| Layer | Package | Port |
|-------|---------|------|
| React + Vite frontend | `ai-chat-toolkit-widget` (workspace) | http://localhost:5173 |
| Express + Groq backend | `ai-chat-toolkit-server` (workspace) | http://localhost:3333 |

**Chat endpoint:** `POST http://localhost:3333/my-chat`

Mock tools: `get_products`, `get_order_status`, `get_support_articles`

## Setup

From the monorepo root:

```bash
pnpm install
pnpm build
cp examples/full-stack-local/.env.example examples/full-stack-local/.env
# Edit .env and set GROQ_API_KEY (https://console.groq.com/)
pnpm --filter full-stack-local-example dev
```

Or from this directory:

```bash
cp .env.example .env
pnpm dev
```

## Environment

```env
GROQ_API_KEY=
GROQ_MODEL=llama-3.3-70b-versatile
```

## Scripts

| Script | Description |
|--------|-------------|
| `pnpm dev` | Start backend + Vite frontend |
| `pnpm dev:web` | Frontend only (port 5173) |
| `pnpm dev:server` | Backend only (port 3333) |
| `pnpm build` | Typecheck + production frontend build |

## Verify backend

```bash
curl http://localhost:3333/
curl http://localhost:3333/ai-chat/health
curl http://localhost:3333/ai-chat/tools
```

## Widget configuration

```tsx
<ai-chat
  title="AI Assistant"
  subtitle="Ask about products, orders, or docs"
  primary-color="#2563eb"
  path="/my-chat"
/>
```

`backend-url` is omitted — the browser calls `http://localhost:5173/my-chat` and Vite proxies to the backend on port **3333** (no CORS issues).

## Troubleshooting

**Browser shows `Cannot GET /my-chat`**

That is normal. The chat endpoint is **POST only** (the widget sends JSON). Opening `http://localhost:3334/my-chat` in the browser sends GET.

- Use the app: http://localhost:5173 and the chat bubble
- Or test with curl:

```bash
curl -X POST http://localhost:3334/my-chat \
  -H "Content-Type: application/json" \
  -d '{"message":"hello","history":[]}'
```

**Chat shows a network/CORS error**

1. Run **`pnpm dev`** (both server and web). `pnpm dev:web` alone will not start the API.
2. `PORT` in `.env` must match — Vite proxies to that port (e.g. `3334`).
3. Confirm backend: `curl http://localhost:3334/ai-chat/health`
4. Check `GROQ_API_KEY` in `.env`

## License

MIT
