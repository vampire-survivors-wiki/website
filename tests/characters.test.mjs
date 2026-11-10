import assert from 'node:assert/strict';
import test from 'node:test';

import { characters } from '../src/data/characters.ts';
import { characterDisplayGroups } from '../src/data/character-display.ts';

const allowedCategories = new Set(['standard', 'unlockable', 'dlc']);
const requiredFields = ['id', 'name', 'nameEn', 'initialWeapon', 'icon'];

function assertUnique(values, label) {
  assert.equal(new Set(values).size, values.length, `キャラクターの${label}に重複があります。`);
}

test('キャラクターデータが空ではない', () => {
  assert.ok(Array.isArray(characters));
  assert.ok(characters.length > 0);
});

test('キャラクターIDが重複していない', () => {
  assertUnique(
    characters.map((character) => character.id),
    'ID',
  );
});

test('キャラクター名が重複していない', () => {
  assertUnique(
    characters.map((character) => character.name),
    '日本語名',
  );
  assertUnique(
    characters.map((character) => character.nameEn),
    '英語名',
  );
});

test('各キャラクターに必須項目が設定されている', () => {
  for (const character of characters) {
    for (const field of requiredFields) {
      const value = character[field];

      assert.equal(typeof value, 'string', `${character.id}: ${field} must be a string`);
      assert.ok(value.trim().length > 0, `${character.id}: ${field} must not be empty`);
      assert.equal(value, value.trim(), `${character.id}: ${field} has surrounding whitespace`);
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

test('キャラクターIDが所定の形式になっている', () => {
  for (const character of characters) {
    assert.match(character.id, /^\d{2}$/, `${character.name}: IDは2桁の数字である必要があります。`);
  }
});


test('PC版とスマートフォン版で共通の表示対象が使われる', () => {
  assert.deepEqual(
    characterDisplayGroups.standard.map((character) => character.id),
    ['01'],
  );
  assert.deepEqual(
    characterDisplayGroups.unlockable.map((character) => character.id),
    ['19'],
  );
  assert.deepEqual(
    characterDisplayGroups.dlc.map((character) => character.id),
    ['23'],
  );

  const displayedCharacters = [
    ...characterDisplayGroups.standard,
    ...characterDisplayGroups.unlockable,
    ...characterDisplayGroups.dlc,
  ];
  assert.equal(displayedCharacters.length, 3);
});
