import { characters } from './characters.ts';

/**
 * キャラクター一覧ページに表示する対象。
 * PC版・スマートフォン版で同じ表示対象を使うため、選定条件をここに集約する。
 */
export const characterDisplayGroups = {
  standard: characters
    .filter((character) => character.category === 'standard')
    .slice(0, 1),
  unlockable: characters.filter((character) => character.id === '19'),
  dlc: characters
    .filter((character) => character.category === 'dlc')
    .slice(0, 1),
};

export type CharacterDisplayGroups = typeof characterDisplayGroups;
