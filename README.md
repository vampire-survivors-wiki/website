# VS GUIDE

Vampire Survivorsの攻略・解説情報をまとめる非公式Wiki「VS GUIDE」のWebサイトです。

**公開サイト:** https://website.niri.workers.dev/

Vampire Survivorsの情報を単に一覧化するだけでなく、攻略手順やゲーム内の仕組み、手順の理由まで理解できる情報を目指しています。初心者から、具体的な目標を持ってやり込むプレイヤーまで、PC・スマートフォンのどちらからでも利用しやすいサイトを目指して開発しています。

本サイトはファンが制作・運営する非公式サイトです。poncle limited とは提携・承認関係にありません。

## 現在の実装

| ページ | パス | 内容 |
| --- | --- | --- |
| ホーム | `/` | 攻略カテゴリ、金策、アップデート、note・YouTubeへの導線 |
| キャラクター一覧 | `/characters/` | キャラクターの分類・一覧表示。PC版にはカテゴリフィルターを実装 |

PC版とスマートフォン版では、画面構成や操作性に合わせて表示コンポーネントを分けています。キャラクター情報の元データは共通化し、両画面で同じ表示対象を利用します。

ステージ・ボス・アンロックなどの個別攻略ページや、金策の専用ページなどは今後の実装対象です。ホームに表示されるカテゴリ名やカードが、すべて専用ページとして実装済みという意味ではありません。

## 技術構成

- **Astro** — 静的サイト生成
- **TypeScript** — strict設定で型チェック
- **Tailwind CSS v4** — スタイル
- **Cloudflare Workers Static Assets** — サイトのホスティング
- **Nix Flakes / direnv** — 開発環境の管理
- **Playwright** — ブラウザーE2Eテスト
- **GitHub Actions** — フォーマット、Lint、テスト、ビルドのCI

Node.jsは **22.23.4以上** を使用します。パッケージ管理にはnpmを使用します。

## 開発環境のセットアップ

### 1. リポジトリを取得

```bash
git clone https://github.com/vampire-survivors-wiki/website.git
cd website
```

### 2. Node.js環境を用意

Nix Flakesとdirenvを利用する場合は、リポジトリのルートで次を実行します。

```bash
direnv allow
```

direnvを使わない場合は、Nixが利用できる環境で次を実行できます。

```bash
nix develop
```

Nixを利用しない場合は、Node.js 22.23.4以上とnpmをあらかじめインストールしてください。

### 3. 依存パッケージをインストール

```bash
npm ci
```

### 4. 開発サーバーを起動

```bash
npm run dev
```

起動後、通常は http://localhost:4321/ で確認できます。

## 主なコマンド

| コマンド | 内容 |
| --- | --- |
| `npm run dev` | Astroの開発サーバーを起動 |
| `npm run build` | Astroの型・内容チェックと本番ビルドを実行 |
| `npm run preview` | ビルド済みサイトをローカルでプレビュー |
| `npm test` | Node.jsによるユニット・整合性テストを実行 |
| `npm run test:e2e` | PlaywrightのE2Eテストを実行 |
| `npm run lint` | ESLintを実行 |
| `npm run format:check` | Prettierのフォーマットチェックを実行 |
| `npm run format` | Prettierでファイルを整形 |

### E2Eテスト

E2Eテストはビルド済みサイトをプレビューサーバーで起動して実行します。初回はChromiumをインストールしてください。

```bash
npm run build
npx playwright install chromium
npm run test:e2e
```

CIではChromiumを含むブラウザー環境をセットアップしてE2Eテストを実行します。

## ディレクトリ構成

```text
.
├── .github/
│   └── workflows/       # GitHub Actions
├── e2e/                 # Playwright E2Eテスト
├── public/              # 画像・favicon・OGP画像などの静的アセット
├── src/
│   ├── components/
│   │   ├── home/        # ホーム画面（PC / スマートフォン）
│   │   └── characters/  # キャラクター一覧（PC / スマートフォン）
│   ├── data/            # キャラクターなどの構造化データ
│   ├── layouts/         # ページ共通レイアウト
│   ├── pages/           # URLに対応するページ
│   └── styles/          # グローバルスタイル
├── tests/               # ユニット・アセット整合性テスト
├── AGENTS.md            # AIコーディングエージェント向け開発ルール
├── astro.config.mjs     # Astro設定
├── flake.nix            # Nix開発環境
├── package.json         # npm scripts・依存関係
└── wrangler.jsonc       # Cloudflare Workers設定
```

## ビルドとデプロイ

本番用ファイルは `dist/` に出力されます。Cloudflare Workers Static Assetsとして公開する設定はルートの `wrangler.jsonc` で管理しています。

Cloudflareへのデプロイ権限があり、Wranglerの認証が済んでいる環境では、次のコマンドでビルド・デプロイできます。

```bash
npm run build
npx wrangler login
npx wrangler deploy
```

Wranglerの設定ではWorker名を `vs-guide`、配信する静的ファイルのディレクトリを `dist/` としています。公開先URLや環境ごとの設定を変更する場合は、`astro.config.mjs` と `wrangler.jsonc` の両方を確認してください。

## 開発・変更時のルール

作業前に **[AGENTS.md](./AGENTS.md)** を確認してください。プロジェクトの目的、設計・実装方針、ディレクトリの責務、ゲーム情報の正確性、テスト、Git運用に関するルールを定めています。

基本的なブランチ運用は次のとおりです。

- `main`：安定版・本番候補
- `develop`：日常の開発・統合先
- 機能追加や修正：作業ブランチで行い、原則としてPull Requestで `develop` に統合

画面を変更した場合は、PC版とスマートフォン版の両方を確認してください。ゲーム内の仕様や攻略情報は推測で補わず、確認できた事実と未検証の情報を区別してください。
