# RAG local source + memory store example

Standalone example showing how to index local documents with `ai-chat-toolkit-rag-source-local`, store embeddings in memory with `ai-chat-toolkit-rag-store-memory`, inject retrieved context before each LLM call, and chat via `ai-chat-toolkit-widget`.

All dependencies install from npm — no monorepo build step required.

## Install

From this folder:

```bash
npm install
cp .env.example .env
```

## Environment variables

### Required

| Variable | Purpose |
|----------|---------|
| `API_KEY` | Chat LLM API key |

Also set `EMBEDDING_API_KEY` when embeddings use a **different** key than chat (typical: Groq chat + OpenAI embeddings). If unset, embeddings fall back to `API_KEY`.

### Optional (defaults apply if omitted)

| Variable | Default |
|----------|---------|
| `PROVIDER` | `groq` |
| `MODEL` | provider default (e.g. `llama-3.3-70b-versatile` for Groq) |
| `BASE_URL` | provider default (only needed for custom OpenAI-compatible or Ollama endpoints) |
| `PORT` | `3336` |
| `WEB_ORIGIN` | `http://localhost:5176` (CORS for the Vite frontend) |
| `EMBEDDING_PROVIDER` | `openai` |
| `EMBEDDING_MODEL` | `text-embedding-3-small` |
| `EMBEDDING_BASE_URL` | `https://api.openai.com/v1` |

### Groq chat + OpenAI embeddings example

```env
PROVIDER=groq
API_KEY=gsk_...
MODEL=llama-3.3-70b-versatile

EMBEDDING_PROVIDER=openai
EMBEDDING_API_KEY=sk-proj-...
EMBEDDING_MODEL=text-embedding-3-small
```

## Run

```bash
npm run dev
```

- **Frontend (widget):** http://localhost:5176
- **Backend (RAG + chat API):** http://localhost:3336

Open the frontend and click the chat bubble in the corner.

## Try it

Sample questions (answers come from `docs/` via RAG):

- **"What is the refund policy?"** (from `docs/faq.json`)
- **"How much does the Pro plan cost?"** (from `docs/pricing.txt`)
- **"How do I reset my password?"** (from `docs/getting-started.md`)

Or via curl:

```bash
curl -s http://localhost:3336/my-chat \
  -H "Content-Type: application/json" \
  -d '{"message":"What is the refund policy?"}'
```

## Packages used

| npm package | Role |
|-------------|------|
| `ai-chat-toolkit-widget@^1.0.0` | Chat UI web component |
| `ai-chat-toolkit-server@1.2.1` | Express chat backend + `serverOptionsFromEnv()` |
| `ai-chat-toolkit-rag@0.1.1` | RAG plugin (`rag()`) |
| `ai-chat-toolkit-rag-source-local@0.1.0` | Load `./docs` files |
| `ai-chat-toolkit-rag-store-memory@0.1.0` | In-memory vector search |

## Sample docs

The `docs/` folder includes `.md`, `.txt`, and `.json` files used as the knowledge base.
