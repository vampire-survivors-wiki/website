import { expect, test } from '@playwright/test';

test.describe('サイトのルーティングと共通コンポーネント', () => {
  test('ホームページが表示され、共通レイアウトが描画される', async ({ page }) => {
    const response = await page.goto('/');

    expect(response?.status()).toBe(200);
    await expect(page).toHaveTitle(/Vampire Survivors 攻略/);
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
    await expect(page.locator('main')).toContainText('アントニオ');
    await expect(page.locator('main')).toContainText('初期・通常キャラクター');
    await expect(page.locator('main')).toContainText('DLC生存者');
    await expect(page.locator('main svg path[d]')).not.toHaveCount(0);
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
