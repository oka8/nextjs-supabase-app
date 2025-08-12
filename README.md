# Next.js + Supabase Monorepo

このプロジェクトは、Next.js 15 と Supabase を使用したモノレポ構成のアプリケーションです。ユーザー向けアプリと管理画面を独立してデプロイできるように設計されています。

## 📁 プロジェクト構成

```
nextjs-supabase-app/
├── apps/
│   ├── user-app/          # ユーザー向けアプリケーション
│   └── admin-app/         # 管理画面アプリケーション
├── packages/
│   └── shared/            # 共通ライブラリ
├── package.json           # モノレポ管理
└── README.md             # このファイル
```

## 🚀 アプリケーション構成

### ユーザーアプリ (`apps/user-app`)
- **目的**: 一般ユーザー向けのフロントエンド
- **機能**: 
  - ユーザー認証（メール・Google OAuth）
  - ユーザーダッシュボード
  - レスポンシブデザイン
- **独立デプロイ**: 可能

### 管理画面 (`apps/admin-app`)
- **目的**: システム管理者向けの管理画面
- **機能**:
  - システム監視ダッシュボード
  - ユーザー管理機能
  - システム設定
- **独立デプロイ**: 可能

### 共通ライブラリ (`packages/shared`)
- **目的**: 両アプリで共有するコンポーネント・ロジック
- **内容**:
  - Supabase クライアント設定
  - 認証コンテキスト
  - 共通認証コンポーネント

## 🛠️ 開発環境セットアップ

### 前提条件
- Node.js 18以上
- npm または yarn
- Supabase プロジェクト

### 初期セットアップ

```bash
# リポジトリをクローン
git clone https://github.com/oka8/nextjs-supabase-app.git
cd nextjs-supabase-app

# 全体の依存関係をインストール
npm run install:all

# 環境変数ファイルをコピー（必要に応じて編集）
cp .env.local apps/user-app/
cp .env.local apps/admin-app/
```

### 開発サーバー起動

```bash
# ユーザーアプリの開発サーバー
npm run dev:user

# 管理画面の開発サーバー
npm run dev:admin

# 共通ライブラリの開発（型チェック）
npm run dev:shared
```

## 🌐 デプロイ

### 独立デプロイのメリット
- **スケーラビリティ**: 各アプリを独立してスケーリング可能
- **セキュリティ**: 管理画面への一般ユーザーアクセスを完全に分離
- **開発効率**: 各チームが独立して開発・デプロイ可能
- **障害分離**: 一方のアプリの障害が他方に影響しない

### Vercel デプロイ

#### ユーザーアプリのデプロイ
```bash
# ユーザーアプリディレクトリに移動
cd apps/user-app

# Vercelにデプロイ
vercel --prod

# または、ルートから
npm run deploy:user
```

#### 管理画面のデプロイ
```bash
# 管理画面ディレクトリに移動
cd apps/admin-app

# Vercelにデプロイ
vercel --prod

# または、ルートから
npm run deploy:admin
```

### 環境変数設定

各アプリで以下の環境変数が必要です：

```bash
# Supabase設定
NEXT_PUBLIC_SUPABASE_URL=https://your-project.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=your-anon-key

# サイトURL（OAuth用）
NEXT_PUBLIC_SITE_URL=https://your-app-domain.vercel.app
```

## 📝 開発ワークフロー

### 共通コンポーネントの変更
1. `packages/shared` で変更を実装
2. 両アプリで動作テスト
3. 共通ライブラリをコミット
4. 必要に応じて各アプリをデプロイ

### ユーザーアプリのみの変更
1. `apps/user-app` で変更を実装
2. ユーザーアプリのみをデプロイ
3. 管理画面への影響なし

### 管理画面のみの変更
1. `apps/admin-app` で変更を実装
2. 管理画面のみをデプロイ
3. ユーザーアプリへの影響なし

## 🔧 使用可能なコマンド

```bash
# 開発
npm run dev:user          # ユーザーアプリ開発サーバー
npm run dev:admin         # 管理画面開発サーバー
npm run dev:shared        # 共通ライブラリ監視

# ビルド
npm run build:user        # ユーザーアプリビルド
npm run build:admin       # 管理画面ビルド
npm run build:shared      # 共通ライブラリビルド

# リント
npm run lint:user         # ユーザーアプリリント
npm run lint:admin        # 管理画面リント

# デプロイ
npm run deploy:user       # ユーザーアプリデプロイ
npm run deploy:admin      # 管理画面デプロイ

# セットアップ
npm run install:all       # 全ての依存関係インストール
```

## 🌍 本番環境URL

### ユーザーアプリ
- **開発**: http://localhost:3001
- **本番**: https://your-user-app.vercel.app

### 管理画面
- **開発**: http://localhost:3000
- **本番**: https://your-admin-app.vercel.app

## 🛡️ セキュリティ考慮事項

### アクセス制御
- **ユーザーアプリ**: 一般ユーザー向け、公開アクセス
- **管理画面**: 管理者専用、アクセス制限必要

### 認証分離
- 両アプリで同じSupabaseプロジェクトを使用
- 役割ベースのアクセス制御を実装推奨
- 管理画面アクセスには追加認証を検討

## 📚 技術スタック

- **Frontend**: Next.js 15, React 18, TypeScript
- **Styling**: Tailwind CSS
- **Authentication**: Supabase Auth (Email + Google OAuth)
- **Database**: Supabase PostgreSQL
- **Deployment**: Vercel
- **Monorepo**: npm workspaces

## 🤝 開発チーム構成案

### チーム分離例
- **ユーザーチーム**: `apps/user-app` の開発・運用
- **管理チーム**: `apps/admin-app` の開発・運用
- **共通チーム**: `packages/shared` の開発・メンテナンス

### ブランチ戦略例
- `main`: 本番環境
- `develop`: 開発統合
- `feature/user-*`: ユーザーアプリ機能
- `feature/admin-*`: 管理画面機能
- `feature/shared-*`: 共通ライブラリ機能

## 📞 サポート

問題や質問がある場合は、以下を参照してください：

- [Next.js Documentation](https://nextjs.org/docs)
- [Supabase Documentation](https://supabase.com/docs)
- [Vercel Documentation](https://vercel.com/docs)

---

**ライセンス**: MIT