export interface CharacterItem {
  id: string;
  name: string;
  nameEn: string;
  initialWeapon: string;
  category: 'standard' | 'unlockable' | 'dlc';
  icon: string; // SVG path
}

export const characters: CharacterItem[] = [
  { id: '01', name: 'アントニオ', nameEn: 'Antonio Belpaese', initialWeapon: '鞭', category: 'standard', icon: 'M13 10V3L4 14h7v7l9-11h-7z' },
  { id: '02', name: 'イメルダ', nameEn: 'Imelda Pastana', initialWeapon: '魔法の杖', category: 'standard', icon: 'M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z' },
  { id: '03', name: 'パスカリーナ', nameEn: 'Pasqualina Belpaese', initialWeapon: 'ルーン弾', category: 'standard', icon: 'M21 16V8a2 2 0 0 0-1-1.73l-7-4a2 2 0 0 0-2 0l-7 4A2 2 0 0 0 3 8v8a2 2 0 0 0 1 1.73l7 4a2 2 0 0 0 2 0l7-4A2 2 0 0 0 21 16z' },
  { id: '04', name: 'ゲンナーロ', nameEn: 'Gennaro Belpaese', initialWeapon: 'ナイフ', category: 'standard', icon: 'M14.5 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V7.5L14.5 2z' },
  { id: '05', name: 'アルカ', nameEn: 'Arca Ladonna', initialWeapon: '火の杖', category: 'standard', icon: 'M12 2c1.1 0 2 .9 2 2 0 .74-.4 1.38-1 1.72V17h3v-2.1c1.8-.82 3-2.63 3-4.9 0-2.76-2.24-5-5-5s-5 2.24-5 5c0 2.27 1.2 4.08 3 4.9V17h3v-9.28c-.6-.34-1-.98-1-1.72 0-1.1.9-2 2-2z' },
  { id: '06', name: 'ポルタ', nameEn: 'Porta Ladonna', initialWeapon: '雷の指輪', category: 'standard', icon: 'M13 2L3 14h9l-1 8 10-12h-9l1-8z' },
  { id: '07', name: 'ラマ', nameEn: 'Lama Ladonna', initialWeapon: '斧', category: 'standard', icon: 'M14.7 6.3a1 1 0 0 0 0 1.4l1.6 1.6-9.9 9.9a1 1 0 0 0 0 1.4l1.4 1.4a1 1 0 0 0 1.4 0l9.9-9.9 1.6 1.6a1 1 0 0 0 1.4 0l1.4-1.4a1 1 0 0 0 0-1.4l-7.4-7.4a1 1 0 0 0-1.4 0l-1.4 1.4z' },
  { id: '08', name: 'ポー', nameEn: 'Poe Ratcho', initialWeapon: 'ニンニク', category: 'standard', icon: 'M12 2a10 10 0 1 0 10 10A10 10 0 0 0 12 2zm0 18a8 8 0 1 1 8-8 8 8 0 0 1-8 8z' },
  { id: '09', name: 'ドンマリオ', nameEn: 'Dommario', initialWeapon: '聖書', category: 'standard', icon: 'M4 19.5A2.5 2.5 0 0 1 6.5 17H20' },
  { id: '10', name: 'クロチ', nameEn: 'Krochi Freetto', initialWeapon: '十字架', category: 'standard', icon: 'M12 2v20M2 12h20' },
  { id: '11', name: 'クリスティーナ', nameEn: 'Christine Davain', initialWeapon: '五芒星の魔法陣', category: 'standard', icon: 'M12 2l2.4 7.2h7.6l-6 4.8 2.4 7.2-6.4-4.8-6.4 4.8 2.4-7.2-6-4.8h7.6z' },
  { id: '12', name: 'クレリチ', nameEn: 'Suor Clerici', initialWeapon: '聖水', category: 'standard', icon: 'M12 2.69l5.66 5.66a8 8 0 1 1-11.31 0z' },
  { id: '13', name: 'プニャーラ', nameEn: 'Pugnala Provola', initialWeapon: '拳銃双銃', category: 'unlockable', icon: 'M12 2l3 7h7l-5.5 4.5 2 7-6.5-4.5-6.5 4.5 2-7-5.5-4.5h7z' },
  { id: '14', name: 'ポッペエア', nameEn: 'Poppea Pecorina', initialWeapon: 'マナの歌', category: 'unlockable', icon: 'M9 18V5l12-2v13' },
  { id: '15', name: 'コンチェッタ', nameEn: 'Concetta Caciotta', initialWeapon: 'シャドウ・ピニオン', category: 'unlockable', icon: 'M12 3v10.55c-.59-.34-1.27-.55-2-.55-2.21 0-4 1.79-4 4s1.79 4 4 4 4-1.79 4-4V7h4V3h-6z' },
  { id: '16', name: 'モルタッチオ', nameEn: 'Mortaccio', initialWeapon: '骨', category: 'unlockable', icon: 'M12 2a9 9 0 0 0-9 9c0 3.6 2.1 6.7 5.2 8.1V21a1 1 0 0 0 1 1h5.6a1 1 0 0 0 1-1v-1.9c3.1-1.4 5.2-4.5 5.2-8.1a9 9 0 0 0-9-9z' },
  { id: '17', name: 'カヴァッロ', nameEn: 'Yatta Cavallo', initialWeapon: 'チェリーボム', category: 'unlockable', icon: 'M12 2a5 5 0 0 1 5 5c0 2.2-1.4 4.1-3.4 4.7l2.4 9.3h-8l2.4-9.3A5 5 0 0 1 12 2z' },
  { id: '18', name: 'ラバナ', nameEn: 'Bianca Ramba', initialWeapon: 'トロッコ', category: 'unlockable', icon: 'M4 15h16v4H4zm2-10h12v7H6z' },
  { id: '19', name: 'トラウザー', nameEn: 'Big Trouser', initialWeapon: 'キャンディBOX', category: 'unlockable', icon: 'M12 1v22M17 5H9.5a3.5 3.5 0 0 0 0 7h5a3.5 3.5 0 0 1 0 7H6' },
  { id: '20', name: 'クイーン・シグマ', nameEn: 'Queen Sigma', initialWeapon: '勝利の剣', category: 'unlockable', icon: 'M5 16L3 5l5.5 5L12 4l3.5 6L21 5l-2 11H5zm14 3c0 .6-.4 1-1 1H6c-.6 0-1-.4-1-1v-1h14v1z' },
  { id: '21', name: 'レッドデス', nameEn: 'Red Death', initialWeapon: 'デス・スパイラル', category: 'unlockable', icon: 'M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z' },
  { id: '22', name: 'インフェルナス', nameEn: 'Avatar Infernas', initialWeapon: '破滅の炎', category: 'unlockable', icon: 'M12 2a10 10 0 1 0 10 10A10 10 0 0 0 12 2zm1 14.93V17a1 1 0 0 1-2 0v-.07A7 7 0 1 1 13 16.93z' },
  { id: '23', name: 'サミー', nameEn: 'Sammy', initialWeapon: '目眩く狂乱', category: 'dlc', icon: 'M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm1 15h-2v-2h2v2zm0-4h-2V7h2v6z' },
  { id: '24', name: 'マルト', nameEn: 'Maruto Cuts', initialWeapon: 'エスクィツィート', category: 'dlc', icon: 'M12 1L3 5v6c0 5.55 3.84 10.74 9 12 5.16-1.26 9-6.45 9-12V5l-9-4z' },
  { id: '25', name: 'エレノア', nameEn: 'Eleanor Uziron', initialWeapon: 'スペルストリング', category: 'dlc', icon: 'M19 3H5c-1.1 0-2 .9-2 2v14c0 1.1.9 2 2 2h14c1.1 0 2-.9 2-2V5c0-1.1-.9-2-2-2zm-5 14H7v-2h7v2zm3-4H7v-2h10v2zm0-4H7V7h10v2z' },
  { id: '26', name: 'メンヤ', nameEn: 'Menya Moonspell', initialWeapon: '四季', category: 'dlc', icon: 'M12 3a9 9 0 1 0 9 9c0-.46-.04-.92-.1-1.36a5.389 5.389 0 0 1-4.4 2.26 5.403 5.403 0 0 1-3.14-9.8c-.44-.06-.9-.1-1.36-.1z' },
  { id: '27', name: 'シュウト', nameEn: 'Syuuto Moonspell', initialWeapon: '召喚の起爆札', category: 'dlc', icon: 'M14.5 2.5l7 7-12 12-7-7 12-12zm-3.5 8l-2 2 3 3 2-2-3-3z' },
  { id: '28', name: 'ブラッド', nameEn: 'Brad Fang', initialWeapon: 'ファイアアーム', category: 'dlc', icon: 'M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm0 18c-4.41 0-8-3.59-8-8s3.59-8 8-8 8 3.59 8 8-3.59 8-8 8zm-5.5-2.5l7.51-3.49L17.5 6.5 9.99 9.99 6.5 17.5zm5.5-4c-.83 0-1.5-.67-1.5-1.5s.67-1.5 1.5-1.5 1.5.67 1.5 1.5-.67 1.5-1.5 1.5z' }
];
