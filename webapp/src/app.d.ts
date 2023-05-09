import type { ExtendedWebSocketServer } from '$lib/server/web-socket/global-server'

// See https://kit.svelte.dev/docs/types#app
// for information about these interfaces
// and what to do when importing types
declare global {
  namespace App {
    // interface Error {}
    interface Locals {
      /**
       * The global web socket server instance. It is always set, but during
       * prerender it is a fake instance that throws an error when you try to
       * use it.
       */
      webSocketServer: ExtendedWebSocketServer
    }
    // interface PageData {}
    // interface Platform {}
  }
}
