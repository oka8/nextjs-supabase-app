# Next.js + Supabase Starter App

このプロジェクトは、Next.js 15 と Supabase を統合したスターターアプリケーションです。開発環境と本番環境の両方に対応しており、Vercel での簡単なデプロイが可能です。

## 技術スタック

- **Next.js 15** - React フレームワーク（App Router、TypeScript、Tailwind CSS）
- **Supabase** - BaaS（Backend as a Service）プラットフォーム
- **Vercel** - ホスティングプラットフォーム
- **TypeScript** - 型安全性の向上
- **Tailwind CSS** - ユーティリティファーストCSS

## 機能

- ✅ Supabase 接続ステータスの可視化
- ✅ 開発・本番環境の自動切り替え
- ✅ TypeScript サポート
- ✅ Tailwind CSS によるスタイリング
- ✅ ESLint による静的解析

## 環境構成

| 環境 | Supabase | URL | 設定場所 |
|------|----------|-----|----------|
| 開発 | ローカルDocker | http://127.0.0.1:54321 | .env.local |
| 本番 | Supabaseクラウド | https://プロジェクト.supabase.co | Vercel環境変数 |

## セットアップ

### 1. 依存関係のインストール

```bash
npm install
```

### 2. 環境変数の設定

開発環境用の `.env.local` ファイルは既に含まれています。本番環境の設定は Vercel デプロイ時に行います。

### 3. ローカルSupabaseの起動（オプション）

ローカルでSupabaseを使用する場合：

```bash
# Supabase CLI をインストール（未インストールの場合）
npm install -g supabase

# Supabase を初期化
supabase init

# ローカル Supabase を起動
supabase start
```

### 4. 開発サーバーの起動

```bash
npm run dev
```

[http://localhost:3000](http://localhost:3000) をブラウザで開いて、Supabase接続ステータスを確認してください。

## プロジェクト構造

```
nextjs-supabase-app/
├── src/
│   └── app/
│       ├── layout.tsx
│       ├── page.tsx          # メインページ（接続テスト付き）
│       └── globals.css
├── lib/
│   └── supabase.ts          # Supabaseクライアント設定
├── public/                   # 静的アセット
├── .env.local               # 環境変数（開発用）
└── package.json
```

## Vercelデプロイ

### 1. GitHubリポジトリとの連携

```bash
git remote add origin https://github.com/YOUR_USERNAME/nextjs-supabase-app.git
git push -u origin main
```

### 2. Vercelでのインポート

1. [Vercel](https://vercel.com) にログイン
2. GitHubリポジトリをインポート
3. 本番用Supabaseの環境変数を設定

### 3. 環境変数の設定

Vercel Dashboard で以下の環境変数を設定：

- `NEXT_PUBLIC_SUPABASE_URL`: `https://YOUR_PROJECT_REF.supabase.co`
- `NEXT_PUBLIC_SUPABASE_ANON_KEY`: 本番用匿名キー

## Supabase本番プロジェクトの作成

```bash
# Supabaseにログイン
supabase login

# 本番プロジェクトを作成
supabase projects create nextjs-supabase-app-prod --org-id YOUR_ORG_ID --db-password "SecurePass123!" --region ap-northeast-1

# API キーを取得
supabase projects api-keys --project-ref YOUR_PROJECT_REF
```

## 開発ワークフロー

1. 新機能の開発はローカルSupabaseで行う
2. データベーススキーマの変更は `supabase/migrations` で管理
3. 本番反映前にステージング環境でテスト
4. Vercel の自動デプロイで本番反映

## トラブルシューティング

### Supabase接続エラー

- ローカル環境: `supabase start` でDockerコンテナが起動しているか確認
- 本番環境: Vercel の環境変数が正しく設定されているか確認

### ポート競合

開発サーバーのポートが競合する場合、Next.js は自動的に別のポートを使用します。

## 参考リンク

- [Next.js Documentation](https://nextjs.org/docs)
- [Supabase Documentation](https://supabase.com/docs)
- [Vercel Documentation](https://vercel.com/docs)
- [Tailwind CSS Documentation](https://tailwindcss.com/docs)

## ライセンス

MIT License