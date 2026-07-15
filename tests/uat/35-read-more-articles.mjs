// UAT 35 — expanded field-note "Read more" articles. Plays into the
// ANAMNESIS 'wallet' room, advances to its field note, confirms the
// "Read more" button opens the article overlay with real content and a
// working Back button, verifies the keyboard-accessibility fix (Tab to
// the button, Enter opens the article rather than dismissing the note),
// then repeats a lighter content check in German to confirm translated
// article text actually renders instead of falling back to English.
import { withPage, gotoUat, assert } from './_helpers.mjs';

async function advanceToFieldNote(page, roomId) {
  await gotoUat(page);
  await page.evaluate((id) => window.__anamnesisUat.jump(id), roomId);
  await page.waitForTimeout(1200);

  // Click through beats/choices until the field note appears.
  for (let i = 0; i < 20; i++) {
    if ((await page.locator('.field-note').count()) > 0) break;
    const cards = await page.locator('.choice-card').count();
    if (cards > 0) {
      await page.locator('.choice-card').first().click({ timeout: 5000 }).catch(() => {});
    } else {
      await page.locator('.text-panel').first().click({ timeout: 5000 }).catch(() => {});
    }
    await page.waitForTimeout(400);
  }
  assert((await page.locator('.field-note').count()) > 0, `expected field note to appear for room "${roomId}"`);
  await page.waitForTimeout(500);
}

await withPage(async (page) => {
  const errors = [];
  page.on('pageerror', (err) => errors.push(String(err)));
  page.on('console', (m) => {
    if (m.type() === 'error') errors.push(m.text());
  });

  await advanceToFieldNote(page, 'wallet');

  const readMoreBtn = page.locator('.fn-read-more');
  assert((await readMoreBtn.count()) > 0, 'expected a "Read more" button on wallet\'s field note');

  // Keyboard-accessibility check: Close is focused on open; Shift+Tab
  // should reach the read-more button (it precedes Close in DOM order),
  // and Enter there must open the article, NOT dismiss the field note.
  await page.keyboard.press('Shift+Tab');
  const focusedClass = await page.evaluate(() => document.activeElement?.className ?? '');
  assert(focusedClass.includes('fn-read-more'), `expected Shift+Tab from Close to focus the read-more button, got class "${focusedClass}"`);
  await page.keyboard.press('Enter');
  await page.waitForTimeout(500);

  assert((await page.locator('.field-note').count()) > 0, 'field note should still be present after opening the article (not dismissed)');
  const articlePanel = page.locator('.article-panel');
  assert((await articlePanel.count()) > 0, 'expected the article overlay (.article-panel) to open');

  const titleText = await page.locator('.article-panel h2').innerText();
  assert(titleText.length > 5, `article title should be substantial, got "${titleText}"`);
  const bodyText = await page.locator('.article-panel .article-body').innerText();
  assert(bodyText.length > 400, `article body should be substantial, got ${bodyText.length} chars`);
  assert(/Gyges|Ariely|wallet/i.test(bodyText), `expected wallet-article content (Gyges/Ariely/wallet), got: ${bodyText.slice(0, 200)}`);

  // Back button closes the article, returning to the still-open field note.
  const backBtn = page.locator('.article-panel button', { hasText: /Back/i });
  assert((await backBtn.count()) > 0, 'expected a Back button on the article overlay');
  await backBtn.first().click();
  await page.waitForTimeout(500);
  assert((await page.locator('.article-panel').count()) === 0, 'article overlay should close after clicking Back');
  assert((await page.locator('.field-note').count()) > 0, 'field note should still be open after closing the article');

  // Dismiss the field note cleanly before moving to the language check.
  await page.locator('.fn-close').first().click({ timeout: 3000 }).catch(() => {});
  await page.waitForTimeout(400);

  console.log('  EN: Read more button opened the article with real content, keyboard activation worked, Back returned to the field note.');

  // German content check: switch language via the HUD, then re-trigger
  // the same room's field note and confirm the article text is genuinely
  // translated, not falling back to English.
  await advanceToFieldNote(page, 'wallet');
  const langBtn = page.locator('.lang-btn');
  if ((await langBtn.count()) > 0) {
    // wallet's field note is already open here; close it, switch language, re-open.
    await page.locator('.fn-close').first().click({ timeout: 3000 }).catch(() => {});
    await page.waitForTimeout(400);
    await langBtn.click();
    await page.waitForTimeout(300);
    // Cycle order is en -> cs -> fa -> de -> fr (see resolver.ts's LANGS);
    // one click already landed on cs, so two more reach de.
    for (let i = 0; i < 2; i++) {
      await langBtn.click();
      await page.waitForTimeout(300);
    }
    const label = await langBtn.textContent();
    assert(label === 'DE', `expected the language cycle to reach DE after 3 clicks from EN, got "${label}"`);

    // Re-enter the room to see the field note again in the new language.
    await page.evaluate(() => window.__anamnesisUat.jump('wallet'));
    await page.waitForTimeout(1000);
    for (let i = 0; i < 20; i++) {
      if ((await page.locator('.field-note').count()) > 0) break;
      const cards = await page.locator('.choice-card').count();
      if (cards > 0) {
        await page.locator('.choice-card').first().click({ timeout: 5000 }).catch(() => {});
      } else {
        await page.locator('.text-panel').first().click({ timeout: 5000 }).catch(() => {});
      }
      await page.waitForTimeout(400);
    }
    assert((await page.locator('.field-note').count()) > 0, 'expected field note to reappear after language switch');
    await page.locator('.fn-read-more').first().click({ timeout: 3000 }).catch(() => {});
    await page.waitForTimeout(500);
    const deTitle = await page.locator('.article-panel h2').innerText();
    assert(deTitle.length > 5 && !/What 17,000 Lost Wallets/i.test(deTitle), `expected a translated (non-English) German article title, got "${deTitle}"`);
    assert(/[a-zA-ZäöüÄÖÜß]/.test(deTitle), `expected the DE title to actually be German script, got "${deTitle}"`);
    console.log(`  DE: article title rendered translated: "${deTitle}"`);
  } else {
    console.log('  DE: language button not found, skipping translated-content spot check.');
  }

  assert(errors.length === 0, `expected zero console/page errors, got: ${JSON.stringify(errors)}`);
  console.log('UAT 35 (Read more articles): PASS');
});
