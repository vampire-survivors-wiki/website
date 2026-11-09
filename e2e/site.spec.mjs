import { expect, test } from '@playwright/test';

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
    await expect(page.locator('main svg path[d]')).not.toHaveCount(0);
  });

  test('用意した3キャラクターの画像がPC・スマートフォン用カードに表示される', async ({ page }) => {
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

    for (const asset of imageAssets) {
      const images = page.locator(`img[src="${asset.src}"]`);
      await expect(images).toHaveCount(2);
      await expect(images.first()).toHaveAttribute('alt', asset.alt);

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
    expect(await getButtonCount(/全キャラクター/)).toBe(
      standardCount + hiddenCount + dlcCount,
    );

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

    const pathLengths = await page
      .locator('main svg path[d]')
      .evaluateAll((paths) => paths.map((path) => path.getTotalLength()));

    expect(pathLengths.length).toBeGreaterThan(0);
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
