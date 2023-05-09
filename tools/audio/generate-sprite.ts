#!/usr/bin/env -S deno run --allow-run --allow-write

/// This script generates a sprite from the audio files in `audio/` which is
/// then used by the playback engine in webapp.

import sounds from '../../webapp/src/lib/sound/sounds.ts'
const decodeBinaryText = (d: Uint8Array) => new TextDecoder().decode(d)

const soundsPath = './audio/'
const dstPath = '../webapp/static/audio/'

console.log('[INFO] You need to have sox installed for this to work.')
console.log('https://sox.sourceforge.net')

/**
 * Adds an element between each element of a list.
 */
const interleave = (list: readonly string[], interleavedElement: string) =>
  list.flatMap((e) => [e, interleavedElement]).slice(0, -1)

const getPath = (sound: string, untrimmed = false) =>
  `${soundsPath}${sound}${
    untrimmed || sound === 'silence' ? '' : '-trimmed'
  }.wav`

/**
 * The lengths of the different sounds
 */
const lengths: number[] = []
let silenceDuration = 0

for (const sound of sounds) {
  if (sound !== 'silence') {
    // First make sure that all sounds are trimmed so there is no silence at the
    // start + end.
    const trimProcess = Deno.run({
      cmd: [
        'sox',
        getPath(sound, true),
        getPath(sound),
        // Trim silence at the beginning
        'silence',
        '1',
        '0.1',
        '0.1%',
        'reverse',
        // Trim silence at the end
        'silence',
        '1',
        '0.1',
        '0.1%',
        'reverse',
        // Convert sample rate
        'rate',
        '44100',
      ],
    })
    if (!(await trimProcess.status()).success) throw `Trim error for ${sound}`
  }

  // Get the duration of the sound
  const process = Deno.run({
    cmd: ['soxi', '-D', getPath(sound)],
    stdout: 'piped',
  })
  if (!(await process.status()).success) throw `Duration error for ${sound}`
  const duration = parseFloat(decodeBinaryText(await process.output()).trim())
  lengths.push(duration)
  if (sound === 'silence') silenceDuration = duration
}

// Generate a sprite from all sounds
const process = Deno.run({
  cmd: [
    'sox',
    ...interleave(sounds, 'silence').map((sound) => getPath(sound)),
    `${dstPath}sprite.mp3`,
  ],
})
const status = await process.status()
console.log(status)
if (!status.success) throw new Error('sox failed')

for (const sound of sounds) {
  if (sound === 'silence') continue
  const p = Deno.run({
    cmd: ['rm', getPath(sound)],
  })
  if (!(await p.status()).success) throw `Delete error for ${sound}`
}

const lines: string[] = []
let currentTime = 0

for (const [index, sound] of sounds.entries()) {
  lines.push(
    `'${sound}': [${Math.round(currentTime * 1000)}, ${Math.round(
      lengths[index] * 1000,
    )}]`,
  )
  currentTime += lengths[index] + silenceDuration
}

console.log('\n\nReplace this in sound/index.ts:\n')
console.log(lines.join(',\n'))
