# File-based music (F3 — architecture ready, no audio shipped yet)

Drop music tracks here and they will be picked up automatically — nothing
else needs to change in the game's code or content. Wherever a slot has no
file, the game's existing generative ambient music plays exactly as it
always has — file-based tracks are a replacement per slot, never a
requirement.

## Folder convention

```
public/music/<packId>/<slot>.mp3
public/music/landing/vestibule.mp3
```

- `<packId>` — `anamnesis` or `limerence`.
- `<slot>` — `act0`…`act5`, matching the game's own act numbers exactly
  (act 0 is also the title screen's music; act 5 is the ending space).
- `public/music/landing/vestibule.mp3` — the rozcestník (the page the player
  lands on before choosing a game), played behind a click-to-start button
  per browser autoplay policy.

`.mp3`, `.ogg`, and `.wav` are all accepted (in that preference order).

## Build step

Same as narration — `npm run build:manifest` regenerates
`public/av-manifest.json`, and the game only crossfades to a file-based
track for slots the manifest actually lists.
