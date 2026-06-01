# Examples

Three standalone examples showing how to use the published npm packages. Each runs independently — no monorepo build step required.

| Folder | What it shows | Packages used |
|--------|---------------|---------------|
| [static-html](./static-html/) | Drop the widget into any HTML page via CDN | `ai-chat-toolkit-widget` (CDN) |
| [react-consumer-example](./react-consumer-example/) | Use the widget in a React + TypeScript app | `ai-chat-toolkit-widget` (npm) |
| [full-stack-local](./full-stack-local/) | Widget + server + tools working together | `ai-chat-toolkit-widget` + `ai-chat-toolkit-server` (npm) |

## Which example should I use?

- **No framework, just HTML?** → `static-html`
- **Building a React app?** → `react-consumer-example`
- **Need the full picture — widget, backend, and tools?** → `full-stack-local`
