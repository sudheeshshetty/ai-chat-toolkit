# Contributing

Thanks for your interest in **ai-chat-toolkit**.

## Development

From the repository root:

```bash
pnpm install
pnpm build
```

Package source lives under `packages/widget` and `packages/server`. Examples under `examples/` install published npm packages and run standalone.

## Opening a PR

1. Create a feature branch from `main`.
2. Make your changes and push the branch.
3. Open a pull request against `main`.
4. Ensure the **build** CI check passes.
5. Wait for **maintainer approval** — all changes require review from a code owner.

Direct pushes to `main` should be disabled via branch protection.

## Release

Packages are released manually through GitHub Actions:

- **Release ai-chat-toolkit-widget**
- **Release ai-chat-toolkit-server**

See the root [README](./README.md#publishing) for details.
