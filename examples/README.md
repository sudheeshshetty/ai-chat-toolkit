# Examples

Five standalone examples showing how to use the published npm packages. Each runs independently — no monorepo build step required.

| Folder | What it shows | Packages used |
|--------|---------------|---------------|
| [static-html](./static-html/) | Drop the widget into any HTML page via CDN | `ai-chat-toolkit-widget@1.0.0` (CDN) |
| [react-consumer-example](./react-consumer-example/) | Use the widget in a React + TypeScript app | `ai-chat-toolkit-widget@^1.0.0` (npm) |
| [full-stack-local](./full-stack-local/) | Widget + server + tools (native loop) | `ai-chat-toolkit-widget@^1.0.0` + `ai-chat-toolkit-server@^1.1.0` (npm) |
| [langchain-orchestration](./langchain-orchestration/) | Same stack with `orchestration: "langchain"` | `ai-chat-toolkit-widget@^1.0.0` + `ai-chat-toolkit-server@^1.1.0` (npm) |
| [rag-local-memory](./rag-local-memory/) | RAG with local docs + widget UI | `ai-chat-toolkit-widget@^1.0.0` + `ai-chat-toolkit-server@1.2.1` + `ai-chat-toolkit-rag@0.1.1` + `ai-chat-toolkit-rag-source-local@1.0.0` + `ai-chat-toolkit-rag-store-memory@1.0.0` (npm) |

## Which example should I use?

- **No framework, just HTML?** → `static-html`
- **Building a React app?** → `react-consumer-example`
- **Need the full picture — widget, backend, and tools?** → `full-stack-local`
- **Trying LangChain internal orchestration?** → `langchain-orchestration`
- **Trying RAG with local files and in-memory search?** → `rag-local-memory`
