# Examples

Four examples for **ai-chat-toolkit**. Three use published **1.0.0** npm packages and run standalone; one links workspace packages for the LangChain orchestration preview.

| Folder | What it shows | Packages used |
|--------|---------------|---------------|
| [static-html](./static-html/) | Drop the widget into any HTML page via CDN | `ai-chat-toolkit-widget@1.0.0` (CDN) |
| [react-consumer-example](./react-consumer-example/) | Use the widget in a React + TypeScript app | `ai-chat-toolkit-widget@^1.0.0` (npm) |
| [full-stack-local](./full-stack-local/) | Widget + server + tools (native loop) | `ai-chat-toolkit-widget@^1.0.0` + `ai-chat-toolkit-server@^1.0.0` (npm) |
| [langchain-orchestration](./langchain-orchestration/) | Same stack with `orchestration: "langchain"` | workspace `widget` + `server` (pnpm) |

## Which example should I use?

- **No framework, just HTML?** → `static-html`
- **Building a React app?** → `react-consumer-example`
- **Need the full picture — widget, backend, and tools?** → `full-stack-local`
- **Trying LangChain internal orchestration?** → `langchain-orchestration` (run from repo root with `pnpm`)
