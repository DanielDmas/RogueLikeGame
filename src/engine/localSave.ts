import {
  defaultProfile,
  shouldGrandfatherHasSeenAbout,
  PROFILE_SCHEMA_VERSION,
  type Profile,
  type SaveStore,
  type Settings,
} from './saveStore';

const KEY_PREFIX = 'anamnesis:profile:';
const BACKUP_SUFFIX = ':backup';

/** Pre-v2 saves stored a single `sound` toggle covering both music and effects. */
interface LegacySettings extends Partial<Settings> {
  sound?: boolean;
}

/** Migrates a legacy `settings.sound` toggle into the new split `music`/`sfx` fields. Pure — testable. */
export function migrateSettings(raw: LegacySettings | undefined, base: Settings): Settings {
  const { sound, ...rest } = raw ?? {};
  const migrated = sound !== undefined ? { music: sound, sfx: sound } : {};
  return { ...base, ...migrated, ...rest };
}

/** Spread-merges a parsed (possibly legacy) payload over fresh defaults, so
 * additive fields introduced since the save was written are backfilled.
 * Always stamps the current schema version — a save's own recorded version
 * is informational for future migrations, never load-bearing on its own. */
function hydrate(parsed: Partial<Omit<Profile, 'settings'>> & { settings?: LegacySettings }): Profile {
  const base = defaultProfile();
  return {
    ...base,
    ...parsed,
    settings: migrateSettings(parsed.settings, base.settings),
    hasSeenAbout: shouldGrandfatherHasSeenAbout(parsed) ? true : (parsed.hasSeenAbout ?? base.hasSeenAbout),
    schemaVersion: PROFILE_SCHEMA_VERSION,
  };
}

export class LocalSaveStore implements SaveStore {
  private restoredFromBackup = false;

  async load(profileId: string): Promise<Profile> {
    this.restoredFromBackup = false;
    const key = KEY_PREFIX + profileId;
    const backupKey = key + BACKUP_SUFFIX;
    const raw = localStorage.getItem(key);
    if (!raw) return defaultProfile();
    try {
      const parsed = JSON.parse(raw) as Partial<Omit<Profile, 'settings'>> & { settings?: LegacySettings };
      // Successful parse: this payload becomes the new restore point, so a
      // corruption introduced by a *later* write still has something good to
      // fall back to.
      localStorage.setItem(backupKey, raw);
      return hydrate(parsed);
    } catch {
      const backupRaw = localStorage.getItem(backupKey);
      if (backupRaw) {
        try {
          const parsedBackup = JSON.parse(backupRaw) as Partial<Omit<Profile, 'settings'>> & {
            settings?: LegacySettings;
          };
          this.restoredFromBackup = true;
          return hydrate(parsedBackup);
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
