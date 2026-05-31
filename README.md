# ai-chat-toolkit

Open-source toolkit for embedding an AI-powered chat widget in any web app. Ships as a framework-agnostic Web Component with Shadow DOM isolation, publishable to npm and loadable from a CDN.

**Current scope:** frontend widget package (`@ai-chat-toolkit/widget`). A backend package for hosting the chat API will be added in a future release.

## Quick start (CDN)

```html
<script src="https://cdn.jsdelivr.net/npm/@ai-chat-toolkit/widget/dist/widget.global.js"></script>

<ai-chat
  title="WorkerHub Assistant"
  subtitle="How can I help today?"
  logo="/assets/logo.png"
  primary-color="#2563eb"
  backend-url="https://api.example.com"
  path="/my-chat"
></ai-chat>
```

If `backend-url` is omitted, requests go to `window.location.origin`. If `path` is omitted, the default is `/ai-chat/custom`.

## npm install

```bash
pnpm add @ai-chat-toolkit/widget
```

```ts
import "@ai-chat-toolkit/widget";
// or
import { registerAiChatElement } from "@ai-chat-toolkit/widget";

registerAiChatElement();
```

## Attributes

| Attribute        | Default              | Description |
|------------------|----------------------|-------------|
| `title`          | `AI Assistant`       | Header title |
| `subtitle`       | `How can I help you today?` | Header subtitle |
| `logo`           | _(none)_             | Logo image URL (FAB + header) |
| `primary-color`  | `#2563eb`            | Theme accent color |
| `backend-url`    | `window.location.origin` | API base URL |
| `path`           | `/ai-chat/custom`    | Chat API path |
| `placeholder`    | `Type a message…`    | Message input placeholder |
| `position`       | `bottom-right`       | Widget corner: `bottom-right`, `bottom-left`, `top-right`, `top-left` |

See [packages/widget/README.md](./packages/widget/README.md) for package-level details.

## Backend API contract

```
POST ${backendUrl}${path}
Content-Type: application/json
```

**Request:**

```json
{
  "message": "Hello",
  "history": [
    { "role": "user", "content": "Hi" },
    { "role": "assistant", "content": "Hello! How can I help?" }
  ]
}
```

**Response** (support either shape):

```json
{ "message": "Here is my reply." }
```

```json
{ "response": "Here is my reply." }
```

## Monorepo layout

```
ai-chat-toolkit/
  packages/widget/                # ai-chat-toolkit-widget
  examples/static-html/           # Vanilla HTML demo
  examples/react-consumer-example/  # Official React consumer example (npm, not workspace)
  examples/react-workerhub/       # Branded integration demo
```

## Scripts

| Command | Description |
|---------|-------------|
| `pnpm build` | Build all packages |
| `pnpm dev` | Watch-build the widget |
| `pnpm clean` | Remove build artifacts |

### Local examples

**Static HTML** — open `examples/static-html/index.html` after building the widget.

**React (official consumer example)** — uses the published npm package, not workspace linking:

```bash
cd examples/react-consumer-example
npm install
npm run dev
```

Opens the React app at http://localhost:5173 and a mock backend at http://localhost:3000.

## Roadmap

- [ ] **`@ai-chat-toolkit/backend`** — Reference Node.js server implementing the chat API contract
- [ ] Streaming responses
- [ ] Theming presets and i18n
- [ ] Framework wrappers (optional)

## License

MIT — see [LICENSE](./LICENSE).
