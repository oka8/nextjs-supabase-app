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
src/app/          # Next.js App Router
├── layout.tsx   # ルートレイアウト
├── page.tsx     # メインページ（Supabase接続テスト付き）
└── globals.css  # グローバルスタイル

lib/
└── supabase.ts  # Supabaseクライアント設定

.env.local       # 開発環境変数
```

## 開発環境

### 必須コマンド
```bash
# 開発サーバー起動
npm run dev

# ビルド
npm run build

# リンター実行
npm run lint

# 型チェック
npm run type-check  # カスタムスクリプト（追加予定）
```

### 環境変数
- **開発環境**: `.env.local` （ローカルSupabase用の設定済み）
- **本番環境**: Vercel Dashboard で設定

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
- `src/app/` - ページコンポーネント
- `src/components/` - 再利用可能コンポーネント（今後追加）
- `lib/` - ユーティリティ・設定ファイル
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
1. `src/app/新しいページ名/page.tsx` を作成
2. 必要に応じて `layout.tsx` を同階層に作成
3. Supabaseを使用する場合は `'use client'` ディレクティブを追加

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
1. `src/components/` ディレクトリを作成（初回）
2. コンポーネントファイルを作成
3. TypeScriptの型定義を含める
4. Tailwind CSSでスタイリング

## テストとデプロイ

### 開発フロー
1. ローカル環境で開発・テスト
2. `npm run lint` で静的解析
3. `npm run build` でビルド確認
4. Git commit & push
5. Vercel自動デプロイ

### 確認事項
- [ ] Supabase接続ステータスが正常
- [ ] TypeScriptエラーなし
- [ ] ESLintエラーなし
- [ ] レスポンシブデザイン対応

## トラブルシューティング

### よくある問題
1. **Supabase接続エラー**
   - ローカル: `supabase status` で確認
   - 本番: Vercel環境変数を確認

2. **TypeScriptエラー**
   - `npm run build` で詳細確認
   - 型定義ファイルの更新が必要な場合あり

3. **スタイリング問題**
   - Tailwind CSS設定を確認
   - ブラウザの開発者ツールでクラス適用状況を確認

## Claude Code使用時の注意点

### 推奨される質問パターン
- "新しい認証機能を追加してください"
- "データベーステーブルのCRUD操作を実装してください" 
- "レスポンシブなコンポーネントを作成してください"

### ファイル参照
- 設定ファイル: `lib/supabase.ts:1`
- メインページ: `src/app/page.tsx:1`
- 環境変数: `.env.local:1`

### 開発時のベストプラクティス
1. 新機能追加時は必ずTypeScript型を定義
2. Supabaseの操作にはエラーハンドリングを追加
3. コンポーネントの再利用性を考慮
4. Tailwind CSSのユーティリティクラスを活用
5. 環境変数の取り扱いに注意（機密情報の保護）