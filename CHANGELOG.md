# Changelog

All notable changes to this project are documented here.

Versioning follows [Semantic Versioning](https://semver.org/):

- **Major** (`2.0.0`) — breaking changes; existing integrations must change code or config
- **Minor** (`1.2.0`) — backward-compatible features; existing code keeps working unchanged
- **Patch** (`1.0.1`) — backward-compatible bug fixes and security updates

## [1.2.0] — 2026-06-14

### ai-chat-toolkit-server@1.2.0

Backward-compatible minor release. Default behavior is unchanged — existing apps work without code changes.

- **Generic plugin support** — `server.use(plugin)` calls `plugin.install(server)` for optional extensions.
- **Before-LLM hooks** — `server.registerBeforeLLMHook(fn)` runs registered hooks before each LLM call; returned `context` is appended to the system prompt (native and LangChain paths).
- **New exported types** — `AiChatServerPlugin`, `AiChatServerPluginHost`, `BeforeLLMHook`, `BeforeLLMHookInput`, `BeforeLLMHookResult`.
- **Hook resilience** — hook failures are logged and do not crash the request.
- **Tests** — plugin install, hook registration, context injection, and backward compatibility coverage.

### ai-chat-toolkit-widget@1.0.0

No changes in this release line.

## [1.1.0] — 2026-06-09

### ai-chat-toolkit-server@1.1.0

**Why minor, not major?** This release adds an optional orchestration mode. Default behavior is unchanged (`orchestration: "native"`). No routes, request/response shapes, or existing options were removed or renamed. Existing apps that do not set `orchestration` behave exactly as in 1.0.0.

- **LangChain orchestration (opt-in)** — `orchestration: "langchain"` for multi-step tool chaining via an internal LangChain agent loop. Default remains `"native"` (the original server-owned tool loop).
- **New optional option** — `orchestration?: "native" | "langchain"` on `AiChatServerOptions`.
- **New exported type** — `OrchestrationMode`.
- **Dependencies** — `langchain`, `@langchain/core`, and `zod` added as regular dependencies (install footprint grows even when using `"native"`; behavior does not change).
- **Tests** — orchestration prompt merge and `LangChainAgentOrchestrator` coverage (direct reply, single tool, multi-tool chain, tool failure).
- **Example** — `examples/langchain-orchestration/` (npm packages, ports 5174 / 3335).

**GitHub tag:** [server-v1.1.0](https://github.com/sudheeshshetty/ai-chat-toolkit/releases/tag/server-v1.1.0)

### ai-chat-toolkit-widget@1.0.0

No changes in this release line.

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

[1.2.0]: https://github.com/sudheeshshetty/ai-chat-toolkit/compare/server-v1.1.0...server-v1.2.0
[1.1.0]: https://github.com/sudheeshshetty/ai-chat-toolkit/releases/tag/server-v1.1.0
[1.0.0]: https://github.com/sudheeshshetty/ai-chat-toolkit/releases/tag/widget-v1.0.0
