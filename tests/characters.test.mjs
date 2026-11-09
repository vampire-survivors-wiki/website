import assert from 'node:assert/strict';
import test from 'node:test';

import { characters } from '../src/data/characters.ts';

const allowedCategories = new Set(['standard', 'unlockable', 'dlc']);

function assertUnique(values, label) {
  assert.equal(new Set(values).size, values.length, `キャラクターの${label}に重複があります。`);
}

test('キャラクターデータが1件以上登録されている', () => {
  assert.ok(characters.length > 0);
});

test('キャラクターIDが重複していない', () => {
  assertUnique(characters.map((character) => character.id), 'ID');
});

test('キャラクターの日本語名と英語名が重複していない', () => {
  assertUnique(characters.map((character) => character.name), '日本語名');
  assertUnique(characters.map((character) => character.nameEn), '英語名');
});

test('各キャラクターに必須項目が設定されている', () => {
  for (const character of characters) {
    for (const field of ['id', 'name', 'nameEn', 'initialWeapon', 'icon']) {
      assert.equal(
        typeof character[field],
        'string',
        `${character.name || character.id}: ${field} は文字列である必要があります。`,
      );
      assert.ok(
        character[field].trim().length > 0,
        `${character.name || character.id}: ${field} が空です。`,
      );
    }
  }
});

test('キャラクターカテゴリが定義済みの値になっている', () => {
  for (const character of characters) {
    assert.ok(
      allowedCategories.has(character.category),
      `${character.name}: 未定義のカテゴリ "${character.category}" です。`,
    );
  }
});
