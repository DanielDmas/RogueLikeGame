import { defaultProfile, hydrateProfile, PROFILE_SCHEMA_VERSION, type Profile, type SaveStore } from './saveStore';

const KEY_PREFIX = 'anamnesis:profile:';
const BACKUP_SUFFIX = ':backup';

export class LocalSaveStore implements SaveStore {
  private restoredFromBackup = false;

  async load(profileId: string): Promise<Profile> {
    this.restoredFromBackup = false;
    const key = KEY_PREFIX + profileId;
    const backupKey = key + BACKUP_SUFFIX;
    const raw = localStorage.getItem(key);
    if (!raw) return defaultProfile();
    try {
      const parsed = JSON.parse(raw);
      // Successful parse: this payload becomes the new restore point, so a
      // corruption introduced by a *later* write still has something good to
      // fall back to.
      localStorage.setItem(backupKey, raw);
      return hydrateProfile(parsed);
    } catch {
      const backupRaw = localStorage.getItem(backupKey);
      if (backupRaw) {
        try {
          const parsedBackup = JSON.parse(backupRaw);
          this.restoredFromBackup = true;
          return hydrateProfile(parsedBackup);
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
    localStorage.setItem(KEY_PREFIX + profileId, JSON.stringify({ ...profile, schemaVersion: PROFILE_SCHEMA_VERSION }));
  }
}
