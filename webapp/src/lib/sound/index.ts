import { Howl } from 'howler'
import { get, writable } from 'svelte/store'
import type sounds from './sounds'

export type Sound = (typeof sounds)[number]

let howl: Howl | undefined

const sprite: { [key in Sound]: [number, number] } = {
  capture: [0, 204],
  move: [704, 316],
  select: [1519, 153],
  silence: [2172, 500],
}

const getHowl = () => {
  if (!howl) {
    const spriteVersion = Object.values(sprite)
      .map((value) => window.btoa(`${value[0]}:${value[1]}`))
      .join('-')
    howl ??= new Howl({
      src: [`/audio/sprite.mp3?v=${spriteVersion}`],
      sprite: sprite,
    })
  }
  return howl
}

export const enabled = writable(true)
export const didWarmup = writable(false)

/**
 * Invoke this function on a user interaction, to initialize the playback engine.
 */
export const warmup = () => {
  if (get(didWarmup)) return
  didWarmup.set(true)
  getHowl().play('silence')
}

export const unload = () => {
  getHowl().stop()
  getHowl().unload()
  howl = undefined
}

/**
 * Play given sound. Beware that you need to invoke this on user interaction, or
 * call `initialize` first.
 */
export const play = (sound: Sound) => {
  if (!get(enabled)) return
  getHowl().play(sound)
}
