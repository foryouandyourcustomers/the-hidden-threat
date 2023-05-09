# WebSockets with Svelte Kit

Running a web sockets server may seem trivial, but it's not so trivial when you
want to maintain the benefits of SvelteKit and hot reloading at the same time.

We could have simply created a separate web socket project that handles all the
connections, but having everything in one single project is convenient and
provides a great developer experience.

Most of how this works is taken from this repo:
https://github.com/suhaildawood/SvelteKit-integrated-WebSocket

Here is a copy of the README changed so it fits this repo:

> Rather than build the WebSocket server and/or logic as an isolated component, we
> can define a set of utility functions to:
>
> 1. Create a new WebSocket server and attach it to a global instance variable.
> 2. Define a function that upgrade certain HTTP requests to WebSocket connections.
>
> These utilities will be used in development and production and reside within
> the SvelteKit project structure: `$lib/server/web-socket/*`.
>
> For development, we'll still define an Vite plugin, but rather than import and
> attach a compiled middleware file, we'll import the two functions from
> webSocketUtils to set up a new WebSocket server and handle new connections.
>
> For production, we'll set up a new file at the top-level directory called
> `prod-server.ts`. This script:
>
> 1. imports and runs the built version of our SvelteKit application (via pnpm run
>    build)
> 2. imports the same two functions from webSocketUtils and runs the WebSocket
>    server alongside the SvelteKit server
>
> In both development and production, the trick is to attach the WebSocket
> server to globalThis, representing the global object. This WebSocket server
> instance is attached to the global state via a custom JavaScript Symbol via
> Symbol.for(). This guarantees predictable, runtime-wide access to the server
> instance.
