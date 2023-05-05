import { Howl } from 'howler'
import type sounds from './sounds'

export type Sound = (typeof sounds)[number]

let howl: Howl | undefined

const sprite: { [key in Sound]: [number, number] } = {
  capture: [0, 204],
  move: [407, 316],
  select: [926, 0],
  silence: [1130, 500],
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

/**
 * Invoke this function on a user interaction, to initialize the playback engine.
 */
export const initialize = () => {
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
  getHowl().play(sound)
}
