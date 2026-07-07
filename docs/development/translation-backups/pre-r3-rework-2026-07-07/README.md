# Pre-R3-rework translation backups (2026-07-07)

These are verbatim copies of the Czech and Farsi room-content translation
files (`cs-rooms*.ts` / `fa-rooms*.ts` — prologue + Act I–IV + the
Understory) exactly as they stood before the CLAUDE.md-mandated
context-aware re-translation pass (see the repo's `CLAUDE.md`, "Translating
content" section, and `UPGRADE_PLAN.md` Phase R3).

They predate the project's binding translation rule and were produced more
literally/mechanically. They are kept here — not deleted — purely so a
developer can diff against, partially revert, or otherwise consult the
original renderings if the rework ever needs to be checked, second-guessed,
or rolled back for a specific line.

**These files are not imported anywhere and are not part of the build** —
the `.bak` extension keeps them out of the TypeScript compiler and test
runner. If you ever need to compare a specific string, open the matching
`.bak` file here side by side with the live file at
`src/content/text/<name>.ts`.

Not included: UI strings (`cs.ts`/`fa.ts`), dynamic-beat overrides
(`cs-dynamic.ts`/`fa-dynamic.ts`), endings (`cs-endings.ts`/`fa-endings.ts`),
reflections, and epiphanies — those were either already written under the
context-aware rule (reflections/epiphanies, this milestone) or remain a
separate, not-yet-scheduled slice of the full Phase R3 audit.
