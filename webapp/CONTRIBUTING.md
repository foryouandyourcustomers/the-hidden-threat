# Contribute to the code

This project is built with [Svelte 4](https://svelte.dev) and [Svelte Kit](https://kit.svelte.dev).

Other technologies used:

- TypeScript
- PostCSS (with [nesting](https://github.com/csstools/postcss-plugins/tree/main/plugins/postcss-nesting))
- [XState](https://xstate.js.org) for game logic
- Vitest for unit tests
- [`ws`](https://www.npmjs.com/package/ws) for web sockets (read more in the [web socket readme](./src/lib/server/web-socket/README.md))

## Setup

Make sure you have `pnpm` installed (`brew install pnpm` on mac).

Install all dependencies

```bash
pnpm install
```

## Developing

```bash
pnpm dev
```

## Building

To create a production version of your app:

```bash
pnpm build
```

You can preview the production build with `pnpm preview`.
