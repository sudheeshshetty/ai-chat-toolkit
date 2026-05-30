# @ai-chat-toolkit/widget

Embeddable AI chat web component for any website or app. Built with vanilla Web Components and Shadow DOM — no React or framework required.

## Install

```bash
npm install @ai-chat-toolkit/widget
# or
pnpm add @ai-chat-toolkit/widget
```

### CDN (browser)

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

The global bundle auto-registers the `<ai-chat>` custom element when the script loads.

### npm (ES modules)

```ts
import { AiChatElement, registerAiChatElement } from "@ai-chat-toolkit/widget";

registerAiChatElement();
```

```html
<ai-chat title="Support" backend-url="https://api.example.com"></ai-chat>
```

## Attributes

| Attribute        | Default              | Description |
|------------------|----------------------|-------------|
| `title`          | `AI Assistant`       | Header title |
| `subtitle`       | `How can I help you today?` | Header subtitle |
| `logo`           | _(none)_             | Image URL for FAB and header; falls back to chat icon |
| `primary-color`  | `#2563eb`            | Accent color for header, FAB, and send button |
| `backend-url`    | `window.location.origin` | API origin (no trailing slash) |
| `path`           | `/ai-chat/custom`    | API path appended to `backend-url` |
| `placeholder`    | `Type a message…`    | Input placeholder |
| `position`       | `bottom-right`       | `bottom-right`, `bottom-left`, `top-right`, `top-left` |

## Backend API

**Endpoint:** `POST ${backendUrl}${path}`

**Request body:**

```json
{
  "message": "user message",
  "history": [
    { "role": "user", "content": "..." },
    { "role": "assistant", "content": "..." }
  ]
}
```

**Response** (either field is accepted):

```json
{ "message": "assistant response" }
```

```json
{ "response": "assistant response" }
```

Non-2xx responses and network errors are shown inline in the chat UI.

## Programmatic API

```ts
const el = document.querySelector("ai-chat") as AiChatElement;
el.open();
el.close();
el.toggle();
el.clearHistory();
```

## Build outputs

| File | Use case |
|------|----------|
| `dist/index.js` | ESM import |
| `dist/index.d.ts` | TypeScript types |
| `dist/widget.global.js` | CDN / `<script>` tag |

## Development

From the monorepo root:

```bash
pnpm install
pnpm --filter @ai-chat-toolkit/widget dev
```

## License

MIT
