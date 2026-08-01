import { defaultProfile, hydrateProfile, PROFILE_SCHEMA_VERSION, type Profile, type SaveStore } from './saveStore';

const BACKUP_SUFFIX = ':backup';

export class LocalSaveStore implements SaveStore {
  private restoredFromBackup = false;
  /** Game-experience review (2026-07-19, `15-game-experience-review.md`
   * E3): true only immediately after a `load()` where a save genuinely
   * existed but neither it nor its `:backup` could be recovered — the
   * player falls back to `defaultProfile()` with no signal at all
   * otherwise, reading as a mysteriously blank profile instead of an
   * explained one. Never set for a brand-new player (no `raw` at all is
   * the ordinary first-boot state, not a failure). */
  private profileWasReset = false;
  private keyPrefix: string;

  /** `packId` namespaces storage so two packs (ANAMNESIS, LIMERENCE) never
   * collide in the same browser profile — defaults to 'anamnesis' so every
   * existing call site (and every save on disk today) is unaffected. */
  constructor(packId = 'anamnesis') {
    this.keyPrefix = `${packId}:profile:`;
  }

  async load(profileId: string): Promise<Profile> {
    this.restoredFromBackup = false;
    this.profileWasReset = false;
    const key = this.keyPrefix + profileId;
    const backupKey = key + BACKUP_SUFFIX;
    const raw = localStorage.getItem(key);
    if (!raw) return defaultProfile();
    try {
      const parsed = JSON.parse(raw);
      const hydrated = hydrateProfile(parsed);
      // Only commit the new restore point once hydrate has actually
      // succeeded (Fable review, M1) — a payload that parses as valid JSON
      // but throws inside hydrateProfile must not clobber the last
      // known-good backup on its way to falling back to it below; writing
      // `raw` here unconditionally, before hydrate even ran, used to do
      // exactly that.
      //
      // B-2 (extended review, 2026-08-01): this write is wrapped in its
      // OWN try/catch, separate from the outer one — a `QuotaExceededError`
      // here (a full or private-browsing storage quota) used to fall
      // through to the outer catch below, which loads the *old* backup and
      // reports "restored from backup" even though the just-parsed primary
      // payload (`hydrated`, right here) was perfectly valid. The player
      // was silently rolled back one save and told a recovery happened
      // that never needed to. Best-effort: a failed backup write costs
      // nothing but next time's recovery point, never today's load.
      try {
        localStorage.setItem(backupKey, raw);
      } catch {
        // Storage full — the backup simply doesn't update this time.
      }
      return hydrated;
    } catch {
      const backupRaw = localStorage.getItem(backupKey);
      if (backupRaw) {
        try {
          const parsedBackup = JSON.parse(backupRaw);
          const hydratedBackup = hydrateProfile(parsedBackup);
          this.restoredFromBackup = true;
          return hydratedBackup;
        } catch {
          // The backup is corrupt too — nothing left to recover from.
        }
      }
      // A save genuinely existed (raw was non-empty) but neither it nor its
      // backup could be recovered — this is the one path that actually
      // loses the player's progress, so it must not be silent.
      this.profileWasReset = true;
      return defaultProfile();
    }
  }

  /** True only immediately after a `load()` that had to fall back to the
   * `:backup` key because the primary payload failed to parse — the caller
   * (main.ts) uses this to show one quiet, one-time notice. */
  wasRestoredFromBackup(): boolean {
    return this.restoredFromBackup;
  }

  /** True only immediately after a `load()` where recovery was impossible
   * (both the primary save and its backup failed) and the profile had to
   * be reset to defaults — see `profileWasReset`'s own comment. */
  wasReset(): boolean {
    return this.profileWasReset;
  }

  async save(profileId: string, profile: Profile): Promise<void> {
    localStorage.setItem(this.keyPrefix + profileId, JSON.stringify({ ...profile, schemaVersion: PROFILE_SCHEMA_VERSION }));
  }
}
