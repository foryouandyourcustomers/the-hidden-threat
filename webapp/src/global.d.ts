/// <reference types="unplugin-icons/types/svelte" />
/// <reference types="mdsvex/globals" />

declare module '*.md' {
  export { SvelteComponentDev as default } from 'svelte/internal'
  export { metadata }
}
