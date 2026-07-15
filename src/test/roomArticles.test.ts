import { afterEach, describe, expect, it } from 'vitest';
import { anamnesisPack } from '../packs/anamnesis';
import { limerencePack } from '../packs/limerence';
import type { ContentPack } from '../packs/types';
import { setLocale, t } from '../engine/text/resolver';
import { roomArticleBodyKey, roomArticleTitleKey } from '../engine/text/keys';

/**
 * Expanded field-note articles (owner request, 2026-07-15) — content
 * completeness. Every room registered in a pack's `articles` map must
 * (a) actually exist as a real room in that pack, (b) have substantial
 * English content (not a stub), and (c) be genuinely translated — not just
 * present but falling back to English — in every supported language, per
 * CLAUDE.md's "every string, no exceptions" translation rule.
 */

const packs: { pack: ContentPack; name: string }[] = [
  { pack: anamnesisPack, name: 'ANAMNESIS' },
  { pack: limerencePack, name: 'LIMERENCE' },
];
const LANGS = ['cs', 'de', 'fa', 'fr'] as const;

describe('room articles — every entry points at a real room with substantial content', () => {
  for (const { pack, name } of packs) {
    const roomIds = Object.keys(pack.articles);

    it(`${name}: has at least one article (feature is wired up, not silently empty)`, () => {
      expect(roomIds.length).toBeGreaterThan(0);
    });

    it(`${name}: every article's room id is a real room in this pack`, () => {
      const realRoomIds = new Set(pack.rooms.map((r) => r.id));
      const dangling = roomIds.filter((id) => !realRoomIds.has(id));
      expect(dangling, `article registered for non-existent room ids: ${dangling.join(', ')}`).toEqual([]);
    });

    it(`${name}: every article has substantial English content (not a stub)`, () => {
      for (const id of roomIds) {
        const { title, body } = pack.articles[id];
        expect(title.length, `${id} article title`).toBeGreaterThan(5);
        expect(body.length, `${id} article body should be substantially longer than a field note`).toBeGreaterThan(800);
        // Multi-paragraph, matching the field-note-body markup convention.
        expect(body, `${id} article body should have paragraph breaks`).toContain('\n\n');
      }
    });
  }
});

describe('room articles — genuinely translated in every language, not falling back to English', () => {
  afterEach(() => setLocale('en', 'v2'));

  for (const { pack, name } of packs) {
    for (const lang of LANGS) {
      it(`${name}: every article's title and body resolve to non-English text in ${lang}`, () => {
        setLocale(lang, 'v2');
        for (const id of Object.keys(pack.articles)) {
          const { title: enTitle, body: enBody } = pack.articles[id];
          const title = t(roomArticleTitleKey(id), enTitle);
          const body = t(roomArticleBodyKey(id), enBody);
          expect(title, `${id} article title should be translated in ${lang}, not fall back to English`).not.toBe(enTitle);
          expect(body, `${id} article body should be translated in ${lang}, not fall back to English`).not.toBe(enBody);
        }
      });
    }
  }
});
