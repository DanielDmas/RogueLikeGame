import { defaultProfile, hydrateProfile, PROFILE_SCHEMA_VERSION, type Profile, type SaveStore } from './saveStore';

const BACKUP_SUFFIX = ':backup';

export class LocalSaveStore implements SaveStore {
  private restoredFromBackup = false;
  private keyPrefix: string;

  /** `packId` namespaces storage so two packs (ANAMNESIS, LIMERENCE) never
   * collide in the same browser profile — defaults to 'anamnesis' so every
   * existing call site (and every save on disk today) is unaffected. */
  constructor(packId = 'anamnesis') {
    this.keyPrefix = `${packId}:profile:`;
  }

  async load(profileId: string): Promise<Profile> {
    this.restoredFromBackup = false;
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
      localStorage.setItem(backupKey, raw);
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
      return defaultProfile();
    }
  }

  /** True only immediately after a `load()` that had to fall back to the
   * `:backup` key because the primary payload failed to parse — the caller
   * (main.ts) uses this to show one quiet, one-time notice. */
  wasRestoredFromBackup(): boolean {
    return this.restoredFromBackup;
  }

  async save(profileId: string, profile: Profile): Promise<void> {
    localStorage.setItem(this.keyPrefix + profileId, JSON.stringify({ ...profile, schemaVersion: PROFILE_SCHEMA_VERSION }));
  }
}
