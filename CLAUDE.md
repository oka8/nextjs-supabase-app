# Next.js + Supabase プロジェクトガイド（Claude Code用）

このファイルは、Claude Codeがこのプロジェクトを効率的に理解し、開発をサポートするためのガイダンスです。

## プロジェクト概要

### 基本情報
- **プロジェクト名**: nextjs-supabase-app
- **フレームワーク**: Next.js 15 (App Router)
- **言語**: TypeScript
- **スタイリング**: Tailwind CSS
- **バックエンド**: Supabase
- **デプロイ**: Vercel

### アーキテクチャ
```
apps/
├── admin-app/        # 管理者向けアプリ（ポート3000）
│   ├── src/app/      # Next.js App Router
│   ├── src/components/auth/  # 管理者認証コンポーネント
│   ├── src/lib/      # ユーティリティ・設定ファイル
│   └── .env.local    # ローカルSupabase設定
│
└── user-app/         # ユーザー向けアプリ（ポート3002）
    ├── src/app/      # Next.js App Router
    ├── src/components/auth/  # ユーザー認証コンポーネント
    ├── src/components/ClientWrapper.tsx  # SSR/CSR対応
    ├── src/contexts/ # 認証コンテキスト
    ├── src/lib/      # ユーティリティ・設定ファイル
    └── .env.local    # ローカルSupabase設定

supabase/
├── config.toml       # ローカルSupabase設定
└── .gitignore        # Supabase固有の除外ファイル

package.json          # ルートレベル依存関係管理
.gitignore           # プロジェクト全体の除外設定
```

## 開発環境

### 必須コマンド
```bash
# 管理者アプリ開発サーバー起動（ポート3000）
cd apps/admin-app && npm run dev

# ユーザーアプリ開発サーバー起動（ポート3002）
cd apps/user-app && PORT=3002 npm run dev

# 両アプリの同時起動
npm run dev:admin & npm run dev:user

# ビルド
npm run build:admin    # 管理者アプリ
npm run build:user     # ユーザーアプリ

# リンター実行
npm run lint:admin     # 管理者アプリ
npm run lint:user      # ユーザーアプリ

# ローカルSupabase環境
supabase start         # 起動（Docker必須）
supabase stop          # 停止
supabase status        # 状態確認
```

### 環境変数
- **開発環境**: 各アプリの`.env.local` （ローカルSupabase用の設定済み）
  - `apps/admin-app/.env.local` - 管理者アプリ用（ポート3000）
  - `apps/user-app/.env.local` - ユーザーアプリ用（ポート3002）
- **本番環境**: Vercel Dashboard で設定

### ローカル開発環境の構成
- **ローカルSupabase**: Docker経由でポート54321
- **管理者アプリ**: http://localhost:3000
- **ユーザーアプリ**: http://localhost:3002
- **Supabase Studio**: http://localhost:54323

## Supabase設定

### 開発環境（ローカル）
```bash
# ローカルSupabase起動
supabase start

# 停止
supabase stop
```

### 本番環境
- Supabaseクラウドプロジェクトを使用
- 環境変数はVercelで管理

## コーディング規則

### ディレクトリ構造
- `apps/admin-app/src/app/` - 管理者向けページコンポーネント
- `apps/user-app/src/app/` - ユーザー向けページコンポーネント
- `apps/*/src/components/` - 再利用可能コンポーネント
- `apps/*/src/contexts/` - React Context（認証等）
- `apps/*/src/lib/` - ユーティリティ・設定ファイル
- `types/` - TypeScript型定義（今後追加）

### インポート規則
```typescript
// 外部ライブラリ
import React from 'react'
import { NextPage } from 'next'

// 内部モジュール（絶対パス推奨）
import { supabase } from '@/lib/supabase'
import { Button } from '@/components/ui/button'
```

### スタイリング
- Tailwind CSS を使用
- コンポーネント固有のスタイルはインラインクラス
- 共通スタイルは `globals.css` に定義

## よくある作業

### 新しいページの追加
1. `apps/{admin-app|user-app}/src/app/新しいページ名/page.tsx` を作成
2. 必要に応じて `layout.tsx` を同階層に作成
3. Supabaseを使用する場合は `'use client'` ディレクティブを追加
4. SSR/CSR問題がある場合は `ClientWrapper` コンポーネントを使用

### Supabase操作の追加
```typescript
'use client'

import { useState, useEffect } from 'react'
import { supabase } from '@/lib/supabase'

// 認証状態の監視
const { data: { user } } = await supabase.auth.getUser()

// データベース操作例
const { data, error } = await supabase
  .from('テーブル名')
  .select('*')
```

### 新しいコンポーネントの作成
1. `apps/{admin-app|user-app}/src/components/` ディレクトリに作成
2. コンポーネントファイルを作成
3. TypeScriptの型定義を含める
4. Tailwind CSSでスタイリング
5. SSR対応が必要な場合は `ClientWrapper` を活用

### SSR/CSR対応パターン
```typescript
// ClientWrapper使用例
import ClientWrapper from '@/components/ClientWrapper'

export default function Page() {
  return (
    <ClientWrapper fallback={<div>Loading...</div>}>
      <SupabaseComponent />
    </ClientWrapper>
  )
}
```

## テストとデプロイ

### 開発フロー
1. ローカルSupabase環境を起動（`supabase start`）
2. 開発対象のアプリサーバーを起動
3. ローカル環境で開発・テスト
4. `npm run lint:admin` / `npm run lint:user` で静的解析
5. `npm run build:admin` / `npm run build:user` でビルド確認
6. Git commit & push（日本語コミットメッセージ）
7. Vercel自動デプロイ

### 確認事項
- [ ] ローカルSupabase環境が正常に動作
- [ ] 管理者アプリ（ポート3000）が正常に起動
- [ ] ユーザーアプリ（ポート3002）が正常に起動
- [ ] TypeScriptエラーなし
- [ ] ESLintエラーなし
- [ ] SSR/CSRハイドレーション問題なし
- [ ] レスポンシブデザイン対応

## トラブルシューティング

### よくある問題
1. **Supabase接続エラー**
   - ローカル: `supabase status` で確認
   - Docker が動作しているか確認
   - 本番: Vercel環境変数を確認

2. **TypeScriptエラー**
   - 各アプリで `npm run build` で詳細確認
   - 型定義ファイルの更新が必要な場合あり

3. **SSR/CSRハイドレーション問題**
   - `ClientWrapper` コンポーネントを使用
   - `useEffect` で `isClient` 状態を管理
   - ブラウザ固有のコードはクライアント側でのみ実行

4. **Next.jsキャッシュ問題**
   - `.next` ディレクトリを削除 (`rm -rf apps/*/.next`)
   - 開発サーバーを再起動

5. **スタイリング問題**
   - Tailwind CSS設定を確認
   - ブラウザの開発者ツールでクラス適用状況を確認

6. **ポート競合**
   - 管理者アプリ: 3000
   - ユーザーアプリ: 3002 (`PORT=3002` を指定)
   - Supabase: 54321

## Claude Code使用時の注意点

### 推奨される質問パターン
- "新しい認証機能を追加してください"
- "データベーステーブルのCRUD操作を実装してください" 
- "レスポンシブなコンポーネントを作成してください"

### ファイル参照
- 管理者アプリ設定: `apps/admin-app/src/lib/supabase.ts:1`
- ユーザーアプリ設定: `apps/user-app/src/lib/supabase.ts:1`
- 管理者メインページ: `apps/admin-app/src/app/page.tsx:1`
- ユーザーメインページ: `apps/user-app/src/app/page.tsx:1`
- SSR対応コンポーネント: `apps/user-app/src/components/ClientWrapper.tsx:1`
- 認証コンテキスト: `apps/user-app/src/contexts/AuthContext.tsx:1`
- 環境変数（管理者）: `apps/admin-app/.env.local:1`
- 環境変数（ユーザー）: `apps/user-app/.env.local:1`
- Supabase設定: `supabase/config.toml:1`

### 開発時のベストプラクティス
1. 新機能追加時は必ずTypeScript型を定義
2. Supabaseの操作にはエラーハンドリングを追加
3. コンポーネントの再利用性を考慮
4. Tailwind CSSのユーティリティクラスを活用
5. 環境変数の取り扱いに注意（機密情報の保護）
6. SSR/CSR問題が発生した場合は`ClientWrapper`を使用
7. モノレポ構成のため、適切なアプリディレクトリで作業
8. 日本語コミットメッセージの徹底

### モノレポ管理の注意点
- 各アプリは独立したNext.jsプロジェクト
- 依存関係は各アプリで個別管理
- 共通コンポーネントは必要に応じて各アプリにコピー
- 環境変数は各アプリで個別設定

## Git運用規則

### コミットメッセージ
**必ず日本語でコミットメッセージを記述すること**

#### コミットメッセージのフォーマット
```bash
git commit -m "機能の概要を日本語で記述

- 変更内容1の詳細説明
- 変更内容2の詳細説明
- 修正したバグや追加した機能
- セキュリティ面の改善があれば記載

🤖 Generated with [Claude Code](https://claude.ai/code)

Co-Authored-By: Claude <noreply@anthropic.com>"
```

#### 良いコミットメッセージの例
```bash
# ✅ 良い例
"管理者認証システムの追加

- AdminAuthコンポーネントで管理者専用アクセス制御を実装
- メールベースの管理者認証機能を追加
- 未認証時のログイン画面を作成
- セッション管理とログアウト機能を実装"

# ❌ 悪い例
"Add admin auth system"
"Fix bugs"
"Update components"
```

#### コミットタイプの日本語表記
- **新機能**: 新しい機能の追加
- **修正**: バグ修正
- **改善**: 既存機能の改善・最適化
- **更新**: 依存関係やドキュメントの更新
- **リファクタリング**: コードの整理・構造改善
- **スタイル**: コードフォーマットやスタイルの修正
- **テスト**: テストコードの追加・修正
- **設定**: 設定ファイルの変更

### ブランチ戦略
- `main`: 本番環境（日本語コミットメッセージ必須）
- `develop`: 開発統合ブランチ
- `feature/機能名`: 新機能開発（日本語で機能名を記述）
- `fix/修正内容`: バグ修正（日本語で修正内容を記述）

### プルリクエスト
- タイトル: 日本語で変更内容を要約
- 説明: 変更の背景、実装内容、テスト方法を日本語で記述
- レビュー: コードレビューも日本語でコメント