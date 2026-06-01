# Changelog

All notable changes to this project are documented here.

## [1.0.0] — 2026-06-01

First stable release of both packages. From this version onward:

- **Major** — breaking API changes
- **Minor** — backward-compatible features
- **Patch** — bug fixes and security updates

### ai-chat-toolkit-widget@1.0.0

- Embeddable `<ai-chat>` Web Component (Shadow DOM)
- CDN (`widget.global.js`) and ESM (`import "ai-chat-toolkit-widget"`)
- Configurable title, subtitle, logo, colors, position, backend URL, and path
- Chat history sent to backend; errors shown in the UI
- Logo load fallback to default icon

### ai-chat-toolkit-server@1.0.0

- Express `AiChatServer` with OpenAI-compatible, Groq, Gemini, and Ollama providers
- MCP-style tool registration and tool-call loop
- Scoped CORS on chat routes only
- Credentials-safe CORS (explicit origin allowlist when `credentials: true`)
- Optional `systemPrompt`, `maxToolRounds`, and custom chat path

**GitHub tags:** [widget-v1.0.0](https://github.com/sudheeshshetty/ai-chat-toolkit/releases/tag/widget-v1.0.0) · [server-v1.0.0](https://github.com/sudheeshshetty/ai-chat-toolkit/releases/tag/server-v1.0.0)

[1.0.0]: https://github.com/sudheeshshetty/ai-chat-toolkit/releases/tag/widget-v1.0.0
