import { defaultProfile, type Profile, type SaveStore, type Settings } from './saveStore';

const KEY_PREFIX = 'anamnesis:profile:';

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

export class LocalSaveStore implements SaveStore {
  async load(profileId: string): Promise<Profile> {
    try {
      const raw = localStorage.getItem(KEY_PREFIX + profileId);
      if (!raw) return defaultProfile();
      const parsed = JSON.parse(raw) as Partial<Omit<Profile, 'settings'>> & { settings?: LegacySettings };
      // merge over defaults so new fields survive old saves
      const base = defaultProfile();
      return {
        ...base,
        ...parsed,
        settings: migrateSettings(parsed.settings, base.settings),
      };
    } catch {
      return defaultProfile();
    }
  }

  async save(profileId: string, profile: Profile): Promise<void> {
    localStorage.setItem(KEY_PREFIX + profileId, JSON.stringify(profile));
  }
}
