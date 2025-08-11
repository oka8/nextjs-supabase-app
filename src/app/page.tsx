'use client'

import Image from "next/image"
import Link from "next/link"
import { useState, useEffect } from "react"
import { supabase } from "../../lib/supabase"
import { useAuth } from "@/contexts/AuthContext"

export default function Home() {
  const [isConnected, setIsConnected] = useState<boolean>(false)
  const [loading, setLoading] = useState(true)
  const { user, signOut, loading: authLoading } = useAuth()

  useEffect(() => {
    const checkConnection = async () => {
      try {
        const { data, error } = await supabase.auth.getSession()
        setIsConnected(true)
      } catch (error) {
        console.log('Supabase connection error:', error)
        setIsConnected(false)
      } finally {
        setLoading(false)
      }
    }

    checkConnection()
  }, [])

  const handleSignOut = async () => {
    try {
      await signOut()
    } catch (error) {
      console.error('Sign out error:', error)
    }
  }

  return (
    <div className="font-sans grid grid-rows-[20px_1fr_20px] items-center justify-items-center min-h-screen p-8 pb-20 gap-16 sm:p-20">
      <main className="flex flex-col gap-[32px] row-start-2 items-center sm:items-start">
        <div className="flex items-center gap-4">
          <Image
            className="dark:invert"
            src="/next.svg"
            alt="Next.js logo"
            width={180}
            height={38}
            priority
          />
          <span className="text-2xl font-bold">+</span>
          <div className="text-2xl font-bold text-green-600">Supabase</div>
        </div>

        {/* 認証状態表示 */}
        <div className="bg-blue-50 dark:bg-blue-900/20 border border-blue-200 dark:border-blue-800 rounded-lg p-4 w-full max-w-md">
          <div className="flex items-center gap-3">
            <div className={`w-3 h-3 rounded-full ${authLoading ? 'bg-yellow-500' : user ? 'bg-green-500' : 'bg-gray-500'}`}></div>
            <div className="flex-1">
              <div className="text-sm font-medium text-blue-900 dark:text-blue-100">
                認証状態: {authLoading ? '確認中...' : user ? 'ログイン済み' : '未ログイン'}
              </div>
              {user && (
                <div className="text-xs text-blue-700 dark:text-blue-300 mt-1">
                  {user.email}
                </div>
              )}
            </div>
            {user && (
              <button
                onClick={handleSignOut}
                className="text-xs bg-red-100 hover:bg-red-200 dark:bg-red-900/30 dark:hover:bg-red-900/50 text-red-700 dark:text-red-300 px-2 py-1 rounded transition-colors"
              >
                ログアウト
              </button>
            )}
          </div>
        </div>

        {/* Supabase接続状態 */}
        <div className="bg-gray-100 dark:bg-gray-800 p-4 rounded-lg">
          <div className="flex items-center gap-2">
            <div className={`w-3 h-3 rounded-full ${loading ? 'bg-yellow-500' : isConnected ? 'bg-green-500' : 'bg-red-500'}`}></div>
            <span className="text-sm font-medium">
              Supabase接続: {loading ? '確認中...' : isConnected ? '正常' : '切断'}
            </span>
          </div>
          {!loading && !isConnected && (
            <p className="text-sm text-gray-600 dark:text-gray-400 mt-2">
              .env.local の Supabase 設定を確認してください
            </p>
          )}
        </div>

        <div className="text-center sm:text-left">
          {!user ? (
            <div className="space-y-4">
              <h2 className="text-xl font-semibold text-gray-900 dark:text-white">
                アカウント機能を試してみましょう
              </h2>
              <p className="text-gray-600 dark:text-gray-400">
                Supabase Authを使用したログイン・サインアップ機能
              </p>
              <Link
                href="/auth"
                className="inline-flex items-center px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white font-medium rounded-md transition-colors"
              >
                ログイン / アカウント作成
              </Link>
            </div>
          ) : (
            <div className="space-y-4">
              <h2 className="text-xl font-semibold text-gray-900 dark:text-white">
                ようこそ！
              </h2>
              <p className="text-gray-600 dark:text-gray-400">
                Next.js + Supabase アプリケーションにログインしています
              </p>
              <div className="flex gap-3">
                <Link
                  href="/dashboard"
                  className="inline-flex items-center px-4 py-2 bg-green-600 hover:bg-green-700 text-white font-medium rounded-md transition-colors"
                >
                  ダッシュボードを見る
                </Link>
              </div>
            </div>
          )}
        </div>

        <ol className="font-mono list-inside list-decimal text-sm/6 text-center sm:text-left max-w-md">
          <li className="mb-2 tracking-[-.01em]">
            Supabase認証が統合済み{" "}
            <span className="text-green-600">✓</span>
          </li>
          <li className="mb-2 tracking-[-.01em]">
            ユーザー登録・ログイン機能{" "}
            <span className="text-green-600">✓</span>
          </li>
          <li className="tracking-[-.01em]">
            レスポンシブデザイン対応{" "}
            <span className="text-green-600">✓</span>
          </li>
        </ol>

        <div className="flex gap-4 items-center flex-col sm:flex-row">
          <a
            className="rounded-full border border-solid border-transparent transition-colors flex items-center justify-center bg-foreground text-background gap-2 hover:bg-[#383838] dark:hover:bg-[#ccc] font-medium text-sm sm:text-base h-10 sm:h-12 px-4 sm:px-5 sm:w-auto"
            href="https://vercel.com/new?utm_source=create-next-app&utm_medium=appdir-template-tw&utm_campaign=create-next-app"
            target="_blank"
            rel="noopener noreferrer"
          >
            <Image
              className="dark:invert"
              src="/vercel.svg"
              alt="Vercel logomark"
              width={20}
              height={20}
            />
            Deploy to Vercel
          </a>
          <a
            className="rounded-full border border-solid border-black/[.08] dark:border-white/[.145] transition-colors flex items-center justify-center hover:bg-[#f2f2f2] dark:hover:bg-[#1a1a1a] hover:border-transparent font-medium text-sm sm:text-base h-10 sm:h-12 px-4 sm:px-5 w-full sm:w-auto"
            href="https://supabase.com/docs"
            target="_blank"
            rel="noopener noreferrer"
          >
            Supabase Docs
          </a>
        </div>
      </main>
    </div>
  )
}