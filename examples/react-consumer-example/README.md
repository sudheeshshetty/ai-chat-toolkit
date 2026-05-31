# React Consumer Example

Official sample application showing how to use [`ai-chat-toolkit-widget`](https://www.npmjs.com/package/ai-chat-toolkit-widget) in a React + TypeScript project.

This example **installs the widget from the public npm registry** — the same way a real consumer app would. It does not import the local monorepo package or use `workspace:*` linking.

> **Note for monorepo contributors:** Other packages in the main `ai-chat-toolkit` repo may use pnpm workspace linking during development. This example is **excluded from the pnpm workspace** and intentionally depends on the **published npm package** (`^0.1.1`) so it mirrors real-world usage. You can copy this folder outside the monorepo and run it standalone with `npm install` and `npm run dev`.

## Installation

```bash
npm install ai-chat-toolkit-widget
```

This example already lists that dependency in `package.json`. From this directory:

```bash
npm install
npm run dev
```

No monorepo build step is required.

## React Usage

### 1. Register the custom element

Import the package once (typically in `main.tsx`):

```tsx
import "ai-chat-toolkit-widget";
```

This calls `customElements.define("ai-chat", …)` automatically.

### 2. Add TypeScript support

Create `src/types/web-components.d.ts` so JSX recognizes `<ai-chat />`:

```ts
declare module "react" {
  namespace JSX {
    interface IntrinsicElements {
      "ai-chat": React.DetailedHTMLProps<
        React.HTMLAttributes<HTMLElement> & {
          title?: string;
          subtitle?: string;
          logo?: string;
          "primary-color"?: string;
          "backend-url"?: string;
          path?: string;
          placeholder?: string;
          position?: "bottom-right" | "bottom-left" | "top-right" | "top-left";
        },
        HTMLElement
      >;
    }
  }
}
```

### 3. Use the widget in JSX

```tsx
<ai-chat
  title="AI Assistant"
  subtitle="Ask me anything"
  primary-color="#2563eb"
  backend-url="http://localhost:3000"
  path="/ai-chat/custom"
/>
```

#### Basic usage

```tsx
import "ai-chat-toolkit-widget";

<ai-chat />
```

#### Customized usage

```tsx
<ai-chat
  title="Support Assistant"
  subtitle="How can I help?"
  logo="https://example.com/logo.png"
  primary-color="#2563eb"
  backend-url="http://localhost:3000"
  path="/ai-chat/custom"
/>
```

## Available Properties

| Property        | Default                    | Description                          |
|-----------------|----------------------------|--------------------------------------|
| `title`         | `AI Assistant`             | Header title                         |
| `subtitle`      | `How can I help you today?`| Header subtitle                      |
| `logo`          | _(none)_                   | Logo URL for button and header       |
| `primary-color` | `#2563eb`                  | Theme accent color                   |
| `backend-url`   | `window.location.origin`   | API base URL                         |
| `path`          | `/ai-chat/custom`          | Chat endpoint path                   |
| `placeholder`   | `Type a message…`          | Input placeholder                    |
| `position`      | `bottom-right`             | Widget corner placement              |

## Running the Sample Application

From this directory (works inside or outside the monorepo):

```bash
npm install
npm run dev
```

This starts:

| Service        | URL                        |
|----------------|----------------------------|
| React app      | http://localhost:5173      |
| Mock backend   | http://localhost:3000      |

Open the app, click the chat button, and send a message.

Other scripts:

```bash
npm run build    # Production build
npm run preview  # Preview production build
```

## Running the Demo Backend

The mock server lives in `server/index.js`:

```js
app.post("/ai-chat/custom", (req, res) => {
  res.json({
    message: "Hello from the demo backend",
  });
});
```

Run it standalone:

```bash
node server/index.js
```

Ensure `backend-url` on `<ai-chat>` matches the server address (default `http://localhost:3000`).

## Folder Structure

```
react-consumer-example/
├── public/
├── server/
│   └── index.js          # Mock Express backend
├── src/
│   ├── components/       # Header, cards, docs, footer
│   ├── types/
│   │   └── web-components.d.ts
│   ├── App.tsx
│   ├── main.tsx
│   └── index.css
├── index.html
├── package.json
├── package-lock.json
├── vite.config.ts
├── tsconfig.json
└── README.md
```

## License

MIT
