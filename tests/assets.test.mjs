import assert from 'node:assert/strict';
import { existsSync, readdirSync, readFileSync } from 'node:fs';
import path from 'node:path';
import test from 'node:test';
import { fileURLToPath } from 'node:url';

import { characters } from '../src/data/characters.ts';

const projectRoot = fileURLToPath(new URL('../', import.meta.url));
const sourceRoot = path.join(projectRoot, 'src');
const publicRoot = path.join(projectRoot, 'public');

function collectFiles(directory, extensions) {
  return readdirSync(directory, { withFileTypes: true }).flatMap((entry) => {
    const entryPath = path.join(directory, entry.name);

    if (entry.isDirectory()) {
      return collectFiles(entryPath, extensions);
    }

    return extensions.some((extension) => entry.name.endsWith(extension)) ? [entryPath] : [];
  });
}

function getPageRoutes() {
  const pagesRoot = path.join(sourceRoot, 'pages');

  return new Set(
    collectFiles(pagesRoot, ['.astro']).map((filePath) => {
      const relativePath = path.relative(pagesRoot, filePath).split(path.sep).join('/');
      const withoutExtension = relativePath.slice(0, -'.astro'.length);

      if (withoutExtension === 'index') {
        return '/';
      }

      if (withoutExtension.endsWith('/index')) {
        return `/${withoutExtension.slice(0, -'/index'.length)}/`;
      }

      return `/${withoutExtension}/`;
    }),
  );
}

test('キャラクターのアイコンデータがSVGパスとして成立する', () => {
  const validPathCharacters = /^[MmZzLlHhVvCcSsQqTtAa0-9eE.,+\\-\\s]+$/;

  for (const character of characters) {
    assert.match(
      character.icon,
      validPathCharacters,
      `${character.id} (${character.name}): アイコンに不正なSVGパス文字が含まれています。`,
    );
    assert.match(character.icon, /^[Mm]/, `${character.id}: SVGパスがMで始まっていません。`);
  }
});

test('public配下のfaviconが存在し、SVGとして定義されている', () => {
  const faviconPath = path.join(publicRoot, 'favicon.svg');

  assert.ok(existsSync(faviconPath), 'public/favicon.svg が存在しません。');

  const favicon = readFileSync(faviconPath, 'utf8');
  assert.match(favicon, /<svg\\b/i);
  assert.match(favicon, /<\\/svg>/i);
});

test('Astroソース内のローカル参照先がページまたはpublicアセットとして存在する', () => {
  const pageRoutes = getPageRoutes();
  const sourceFiles = collectFiles(sourceRoot, ['.astro', '.css', '.ts']);
  const localReferencePattern = /(?:href|src)\\s*=\\s*["'](\\/[^"'?#]*)/g;
  const unresolvedReferences = [];

  for (const sourceFile of sourceFiles) {
    const source = readFileSync(sourceFile, 'utf8');

    for (const match of source.matchAll(localReferencePattern)) {
      const reference = match[1];
      const assetPath = path.join(publicRoot, reference.replace(/^\\//, ''));

      if (existsSync(assetPath) || pageRoutes.has(reference)) {
        continue;
      }

      unresolvedReferences.push(`${path.relative(projectRoot, sourceFile)} -> ${reference}`);
    }
  }

  assert.deepEqual(
    unresolvedReferences,
    [],
    `参照先が存在しないローカルリンクがあります:\\n${unresolvedReferences.join('\\n')}`,
  );
});
