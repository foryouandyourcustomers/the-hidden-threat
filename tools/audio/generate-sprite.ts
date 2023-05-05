#!/usr/bin/env -S deno run --allow-run --allow-write

import sounds from "../../webapp/src/lib/sound/sounds.ts";
const td = (d: Uint8Array) => new TextDecoder().decode(d);

const soundsPath = "./audio/";
const dstPath = "../webapp/static/audio/";

console.log("You need to have sox installed for this to work.");

const interleave = (arr: readonly string[], x: string) =>
  arr.flatMap((e) => [e, x]).slice(0, -1);

const getPath = (sound: string, untrimmed = false) =>
  `${soundsPath}${sound}${
    untrimmed || sound === "silence" ? "" : "-trimmed"
  }.wav`;

const lengths: number[] = [];
for (const sound of sounds) {
  if (sound !== "silence") {
    const trimProcess = Deno.run({
      cmd: [
        "sox",
        getPath(sound, true),
        getPath(sound),
        // Trim silence at the beginning
        "silence",
        "1",
        "0.1",
        "0.1%",
        "reverse",
        // Trim silence at the end
        "silence",
        "1",
        "0.1",
        "0.1%",
        "reverse",
        // Convert sample rate
        "rate",
        "44100",
      ],
    });
    if (!(await trimProcess.status()).success) throw `Trim error for ${sound}`;
  }

  const p = Deno.run({
    cmd: ["soxi", "-D", getPath(sound)],
    stdout: "piped",
  });
  if (!(await p.status()).success) throw `Duration error for ${sound}`;
  const duration = parseFloat(td(await p.output()).trim());
  lengths.push(duration);
}

const p = Deno.run({
  cmd: [
    "sox",
    ...interleave(sounds, "silence").map((sound) => getPath(sound)),
    `${dstPath}sprite.mp3`,
  ],
});
const status = await p.status();
console.log(status);
if (!status.success) throw new Error("sox failed");

for (const sound of sounds) {
  if (sound === "silence") continue;
  const p = Deno.run({
    cmd: ["rm", getPath(sound)],
  });
  if (!(await p.status()).success) throw `Delete error for ${sound}`;
}

const lines: string[] = [];
let currentTime = 0;

for (const [index, sound] of sounds.entries()) {
  lines.push(
    `'${sound}': [${Math.round(currentTime * 1000)}, ${Math.round(
      lengths[index] * 1000
    )}]`
  );
  currentTime += lengths[index] + lengths[0];
}

console.log("\n\nReplace this in sound/index.ts:\n");
console.log(lines.join(",\n"));
