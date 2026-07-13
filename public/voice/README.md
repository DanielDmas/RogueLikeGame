# Narration files (F2 — architecture ready, no audio shipped yet)

Drop spoken-word recordings here and they will be picked up automatically —
nothing else needs to change in the game's code or content.

## Folder convention

```
public/voice/<packId>/<lang>/<key>.mp3
```

- `<packId>` — `anamnesis` or `limerence`.
- `<lang>` — `en`, `cs`, `fa`, `de`, or `fr` (matches the game's own language codes).
- `<key>` — the exact text key for the line, using the same naming scheme
  already used throughout the game's text catalog:
  - a room beat: `room.<roomId>.stage<StageIndex>.beat<BeatIndex>`
    (e.g. `room.the-read-receipt.stage0.beat2`)
  - an ending beat: `ending.<endingId>.beat<BeatIndex>` (e.g. `ending.the-ghost.beat0`)
  - a door bark: see `src/engine/text/keys.ts`'s `usherBarkKey`/`actIntroKey`
    for the exact ids if you want to voice those too.

`.mp3`, `.ogg`, and `.wav` are all accepted (in that preference order, if more
than one exists for the same key).

## Build step

Run `npm run build:manifest` (or just `npm run dev` / `npm run build`, which
run it automatically) to regenerate `public/av-manifest.json` from whatever
files are actually present. The game only ever shows the Narration setting,
and only ever attempts to play a line, for keys that manifest lists — an
empty `voice/` folder means the feature stays completely invisible.

## What's NOT done yet (deliberately, per spec — step 1 only)

Recording, TTS generation, and beat-to-audio timing sync are all future
work. This step is folder convention + manifest + the engine's ability to
play a file when one exists — nothing more.
