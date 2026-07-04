import { defaultProfile, type Profile, type SaveStore } from './saveStore';

const KEY_PREFIX = 'anamnesis:profile:';

export class LocalSaveStore implements SaveStore {
  async load(profileId: string): Promise<Profile> {
    try {
      const raw = localStorage.getItem(KEY_PREFIX + profileId);
      if (!raw) return defaultProfile();
      const parsed = JSON.parse(raw) as Partial<Profile>;
      // merge over defaults so new fields survive old saves
      const base = defaultProfile();
      return {
        ...base,
        ...parsed,
        settings: { ...base.settings, ...(parsed.settings ?? {}) },
      };
    } catch {
      return defaultProfile();
    }
  }

  async save(profileId: string, profile: Profile): Promise<void> {
    localStorage.setItem(KEY_PREFIX + profileId, JSON.stringify(profile));
  }
}
