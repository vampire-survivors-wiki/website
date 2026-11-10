import { expect, test } from '@playwright/test';
import { characters } from '../src/data/characters.ts';

test.describe('サイトのルーティングと共通コンポーネント', () => {
  test('ホームページが表示され、共通レイアウトが描画される', async ({ page }) => {
    const response = await page.goto('/');

    expect(response?.status()).toBe(200);
    await expect(page).toHaveTitle(/Vampire Survivors 攻略/);
    await expect(page.locator('meta[name="description"]')).toHaveAttribute(
      'content',
      'Vampire Survivorsの攻略情報を紹介するサイト。ステージ攻略、キャラクター・武器の解説、金策方法など、初心者向けからやり込み向けまで幅広く掲載します。',
    );
    await expect(page.locator('header')).toBeAttached();
    await expect(page.locator('main')).toBeAttached();
    await expect(page.locator('footer')).toHaveCount(2);
  });

  test('スマホ版ホームの文言をPC版にそろえ、余分なラベルを表示しない', async ({ page }) => {
    await page.setViewportSize({ width: 390, height: 844 });
    await page.goto('/');

    for (const label of [
      '4 CATEGORIES',
      'MAPS 01.01',
      'BOSSES 01.02',
      'CHS 01.03',
      'SECRETS 01.04',
      'HIGH EFFICIENCY',
      'OPTIMIZED BUILDS',
      '2026.08',
    ]) {
      await expect(page.getByText(label, { exact: true })).toHaveCount(0);
    }

    const strategy = page.locator('#strategy-mobile');
    await expect(strategy).toContainText('SECTION 01');
    await expect(strategy).toContainText('攻略 / STRATEGY DIRECTORY');
    await expect(strategy).toContainText('01 STAGES');
    await expect(strategy).toContainText('02 BOSSES');
    await expect(strategy).toContainText('03 CHARACTERS');
    await expect(strategy).toContainText('04 SECRETS');
    await expect(strategy.locator('p')).toHaveText([
      '各ステージの特徴と攻略手順。',
      'ボスの特徴と討伐方法。',
      '初期武器や固有能力を紹介。',
      'キャラ・武器・ステージの解放条件。',
    ]);

    const gold = page.locator('#gold-mobile');
    await expect(gold).toContainText('SECTION 02');
    await expect(gold).toContainText('金策 / GOLD FARMING ARCHIVE');
    await expect(gold).toContainText('仕組み・解説');
    await expect(gold).toContainText('THEORY & MECHANICS');
    await expect(gold.locator('p').nth(0)).toHaveText(
      '金策の種類・ゴールドフィーバー・効率の仕組み',
    );
    await expect(gold).toContainText('金策構築');
    await expect(gold.getByText('OPTIMIZED BUILDS', { exact: true })).toHaveCount(0);
    await expect(gold.locator('p').nth(1)).toHaveText('サミー・トラウザーの構築と獲得効率');

    const updates = page.locator('#updates-mobile');
    await expect(updates).toContainText('アップデート / PATCH LOGS');
    await expect(updates).toContainText('アップデート・DLCの検証アーカイブ');
    await expect(updates.locator('p')).toHaveText('アップデート・DLCの追加要素を紹介。');
    await expect(page.getByText('攻略・キャラ・武器・システムの解説記事。', { exact: true })).toBeVisible();
    await expect(page.getByText('攻略手順や金策のプレイ動画を紹介。', { exact: true })).toBeVisible();
  });

  test('キャラクター一覧ページとPC・スマートフォン用コンポーネントが描画される', async ({
    page,
  }) => {
    const response = await page.goto('/characters/');

    expect(response?.status()).toBe(200);
    await expect(page).toHaveTitle(/キャラクター一覧/);
    await expect(page.locator('meta[name="description"]')).toHaveAttribute(
      'content',
      'Vampire Survivorsのキャラクター一覧。通常・隠し・DLCキャラクターの初期武器、固有能力・パッシブ効果、キャラクターごとの解放条件を紹介します。',
    );
    await expect(page.locator('main')).toContainText('アントニオ');
    await expect(page.locator('main')).toContainText('初期・通常キャラクター');
    await expect(page.locator('main')).toContainText('Foscariの潮流');
    await expect(
      page.locator('[data-character-view="desktop"] img[alt$="のキャラクター画像"]'),
    ).toHaveCount(3);
  });

  test('PC版とスマートフォン版で同じ3キャラクターが表示される', async ({ page }) => {
    const response = await page.goto('/characters/');

    expect(response?.status()).toBe(200);

    const imageAssets = [
      {
        src: '/images/characters/antonio-belpaese-portrait.webp',
        alt: 'アントニオのキャラクター画像',
      },
      {
        src: '/images/characters/big-trouser-portrait.webp',
        alt: 'トラウザーのキャラクター画像',
      },
      {
        src: '/images/characters/sammy-portrait.webp',
        alt: 'サミーのキャラクター画像',
      },
    ];

    const viewports = [
      {
        name: 'PC',
        width: 1280,
        height: 900,
        visible: 'desktop',
        hidden: 'mobile',
      },
      {
        name: 'スマートフォン',
        width: 390,
        height: 844,
        visible: 'mobile',
        hidden: 'desktop',
      },
    ];

    for (const viewport of viewports) {
      await page.setViewportSize({ width: viewport.width, height: viewport.height });

      const visibleView = page.locator(`[data-character-view="${viewport.visible}"]`);
      const hiddenView = page.locator(`[data-character-view="${viewport.hidden}"]`);

      await expect(visibleView, `${viewport.name}版の表示領域`).toBeVisible();
      await expect(hiddenView, `${viewport.name}版では非表示の領域`).toBeHidden();

      const visibleImages = visibleView.locator('img[alt$="のキャラクター画像"]');
      await expect(visibleImages).toHaveCount(3);

      const displayedAlts = await visibleImages.evaluateAll((images) =>
        images.map((image) => image.getAttribute('alt')),
      );
      expect(displayedAlts).toEqual(imageAssets.map((asset) => asset.alt));

      for (const asset of imageAssets) {
        const image = visibleView.locator(`img[src="${asset.src}"]`);
        await expect(image).toHaveCount(1);
        await expect(image).toBeVisible();
        await expect(image).toHaveAttribute('alt', asset.alt);

        if (asset.src.includes('antonio-belpaese')) {
          await expect(image).toHaveAttribute('loading', 'eager');
          await expect(image).toHaveAttribute('fetchpriority', 'high');
        } else {
          await expect(image).toHaveAttribute('loading', 'lazy');
          await expect(image).not.toHaveAttribute('fetchpriority');
        }
      }
    }

    for (const asset of imageAssets) {
      const imageResponse = await page.request.get(asset.src);
      expect(imageResponse.status()).toBe(200);
      expect(imageResponse.headers()['content-type']).toContain('image/webp');
    }
  });

  test('PC版のキャラクターフィルターで表示カテゴリーを切り替えられる', async ({ page }) => {
    await page.setViewportSize({ width: 1280, height: 900 });
    await page.goto('/characters/');

    const standardSection = page.locator('[data-character-section="standard"]');
    const hiddenSection = page.locator('[data-character-section="unlockable"]');
    const dlcSection = page.locator('[data-character-section="dlc"]');

    await expect(standardSection).toBeVisible();
    await expect(hiddenSection).toBeVisible();
    await expect(dlcSection).toBeVisible();
    await expect(page.locator('#character-filter-status')).toHaveCount(0);

    const standardCount = await standardSection.locator('.glass-panel').count();
    const hiddenCount = await hiddenSection.locator('.glass-panel').count();
    const dlcCount = await dlcSection.locator('.glass-panel').count();
    const getButtonCount = async (name) => {
      const text = await page.getByRole('button', { name }).textContent();
      const match = text?.match(/\((\d+)\)/);
      expect(match).not.toBeNull();
      return Number(match?.[1]);
    };

    expect(await getButtonCount(/通常キャラクター/)).toBe(standardCount);
    expect(await getButtonCount(/隠しキャラクター/)).toBe(hiddenCount);
    expect(await getButtonCount(/Foscariの潮流/)).toBe(dlcCount);
    expect(await getButtonCount(/全キャラクター/)).toBe(standardCount + hiddenCount + dlcCount);

    await page.getByRole('button', { name: /通常キャラクター/ }).click();
    await expect(standardSection).toBeVisible();
    await expect(hiddenSection).toBeHidden();
    await expect(dlcSection).toBeHidden();

    await page.getByRole('button', { name: /隠しキャラクター/ }).click();
    await expect(standardSection).toBeHidden();
    await expect(hiddenSection).toBeVisible();
    await expect(dlcSection).toBeHidden();

    await page.getByRole('button', { name: /Foscariの潮流/ }).click();
    await expect(standardSection).toBeHidden();
    await expect(hiddenSection).toBeHidden();
    await expect(dlcSection).toBeVisible();

    await page.getByRole('button', { name: /全キャラクター/ }).click();
    await expect(standardSection).toBeVisible();
    await expect(hiddenSection).toBeVisible();
    await expect(dlcSection).toBeVisible();
  });

  test('ヘッダーがPCとスマートフォンで適切に切り替わる', async ({ page }) => {
    await page.setViewportSize({ width: 1280, height: 900 });
    await page.goto('/');

    await expect(page.locator('header nav')).toBeVisible();
    await expect(page.getByRole('button', { name: 'メニューを開く' })).toBeHidden();

    await page.setViewportSize({ width: 390, height: 844 });

    await expect(page.locator('header nav')).toBeHidden();
    await expect(page.getByRole('button', { name: 'メニューを開く' })).toBeVisible();
  });

  test('キャラクターアイコンのSVGパスがブラウザで解析できる', async ({ page }) => {
    await page.goto('/characters/');

    const iconPaths = characters.map((character) => character.icon);
    const pathLengths = await page.evaluate((paths) => {
      const svg = document.createElementNS('http://www.w3.org/2000/svg', 'svg');
      const path = document.createElementNS('http://www.w3.org/2000/svg', 'path');
      svg.append(path);
      document.body.append(svg);

      const lengths = paths.map((data) => {
        path.setAttribute('d', data);
        return path.getTotalLength();
      });

      svg.remove();
      return lengths;
    }, iconPaths);

    expect(pathLengths).toHaveLength(characters.length);
    expect(pathLengths.every((length) => Number.isFinite(length) && length > 0)).toBe(true);

    const invalidPathResults = await page.evaluate(() => {
      const svg = document.createElementNS('http://www.w3.org/2000/svg', 'svg');
      const path = document.createElementNS('http://www.w3.org/2000/svg', 'path');
      svg.append(path);
      document.body.append(svg);

      const measure = (data) => {
        path.setAttribute('d', data);
        return path.getTotalLength();
      };

      const results = {
        valid: measure('M0 0 L10 10'),
        missing: measure('MISSING_ICON'),
        incompleteMove: measure('M'),
        incompleteLine: measure('M0 0 L'),
      };

      svg.remove();
      return results;
    });

    expect(invalidPathResults.valid).toBeGreaterThan(0);
    expect(invalidPathResults.missing).toBe(0);
    expect(invalidPathResults.incompleteMove).toBe(0);
    expect(invalidPathResults.incompleteLine).toBe(0);
  });

  test('faviconが正常に配信される', async ({ request }) => {
    const response = await request.get('/favicon.svg');

    expect(response.status()).toBe(200);
    expect(response.headers()['content-type']).toContain('image/svg+xml');
    expect(await response.text()).toContain('<svg');
  });
});

test.describe('スマートフォン操作', () => {
  test.beforeEach(async ({ page }) => {
    await page.setViewportSize({ width: 390, height: 844 });
    await page.goto('/');
  });

  test('スマホ版キャラクター一覧に不要な補助ラベルを表示しない', async ({ page }) => {
    await page.goto('/characters/');

    const mobileView = page.locator('[data-character-view="mobile"]');
    for (const label of [
      'SURVIVOR ARCHIVE',
      '3 SURVIVORS',
      'STD (1)',
      'HIDDEN (1)',
      'FOSCARI (1)',
    ]) {
      await expect(mobileView.getByText(label, { exact: true })).toHaveCount(0);
    }

    await expect(mobileView).toContainText('SECTION 01');
    await expect(mobileView).toContainText('SECTION 02');
    await expect(mobileView).toContainText('SECTION 03');
  });

  test('キャラクター一覧ではPC用フィルターを表示せず、分類別の一覧を維持する', async ({ page }) => {
    await page.goto('/characters/');

    await expect(page.locator('[data-character-filter]:visible')).toHaveCount(0);
    await expect(page.getByRole('heading', { name: '初期・通常キャラクター' })).toBeVisible();
    await expect(page.getByRole('heading', { name: '隠しキャラクター' })).toBeVisible();
    await expect(page.getByRole('heading', { name: 'Foscariの潮流' })).toBeVisible();
  });

  test('モバイルドロワーを開閉できる', async ({ page }) => {
    const panel = page.locator('#drawer-panel');

    await expect(panel).toHaveClass(/translate-x-full/);
    await page.getByRole('button', { name: 'メニューを開く' }).click();
    await expect(panel).not.toHaveClass(/translate-x-full/);
    await expect(panel.getByText('INDEX', { exact: true })).toHaveCount(0);
    await expect(panel.getByText('84 CHS', { exact: true })).toHaveCount(0);
    await expect(panel.getByRole('link', { name: 'ホーム', exact: true })).toBeVisible();
    await expect(
      panel.getByRole('link', { name: 'キャラクター一覧', exact: true }),
    ).toBeVisible();

    await page.getByRole('button', { name: 'メニューを閉じる' }).click();
    await expect(panel).toHaveClass(/translate-x-full/);
  });

  test('ドロワーのリンクからキャラクター一覧へ移動できる', async ({ page }) => {
    await page.getByRole('button', { name: 'メニューを開く' }).click();
    await page
      .locator('#drawer-panel')
      .getByRole('link', { name: /キャラクター一覧/ })
      .click();

    await expect(page).toHaveURL(/\/characters\/$/);
    await expect(page).toHaveTitle(/キャラクター一覧/);
  });
});
