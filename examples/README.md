# Examples

| Folder | Purpose | Packages |
|--------|---------|----------|
| [static-html](./static-html/) | CDN / script tag widget demo | Built `widget.global.js` from monorepo |
| [react-consumer-example](./react-consumer-example/) | React app like a real npm consumer | **Published** `ai-chat-toolkit-widget` from registry |
| [full-stack-local](./full-stack-local/) | **Maintainers only** — test widget + server before publish | **Workspace** `ai-chat-toolkit-widget` + `ai-chat-toolkit-server` |

You do **not** need multiple React or server demos. Use:

- **static-html** — vanilla + CDN
- **react-consumer-example** — React + published widget
- **full-stack-local** — optional local integration test (Groq + tools)
