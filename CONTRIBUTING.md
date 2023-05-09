# Contribute to the code

This project is built with [Svelte Kit](https://kit.svelte.dev).

- TypeScript
- PostCSS (with [nesting](https://github.com/csstools/postcss-plugins/tree/main/plugins/postcss-nesting))
- [XState](https://xstate.js.org) for game logic
- Vitest for unit tests
- [Pollen](https://www.pollen.style) for CSS custom properties
- [`ws`](https://www.npmjs.com/package/ws) for web sockets (read more in the [web socket readme](./webapp/src/lib/server/web-socket/README.md))

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
