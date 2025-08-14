'use client'

import { useState, useEffect, useCallback } from 'react'
import { createClient } from '@supabase/supabase-js'
import { mockAuth, isSupabaseAvailable } from '@/lib/mockAuth'

interface AdminAuthProps {
  children: React.ReactNode
}

export default function AdminAuth({ children }: AdminAuthProps) {
  const [isAuthenticated, setIsAuthenticated] = useState(false)
  const [isLoading, setIsLoading] = useState(true)
  const [isMounted, setIsMounted] = useState(false)
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [error, setError] = useState('')
  const [useSupabase, setUseSupabase] = useState(true)

  const supabase = createClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL || 'http://127.0.0.1:54321',
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || 'placeholder-key'
  )

  // 管理者メールアドレスのリスト（実際の運用では環境変数から取得）
  const adminEmails = [
    'admin@example.com',
    'test@example.com',
    // 実際の運用では環境変数から管理者リストを取得
    process.env.NEXT_PUBLIC_ADMIN_EMAIL || 'admin@test.com'
  ]

  useEffect(() => {
    setIsMounted(true)
    initializeAuth()
  }, [])

  const initializeAuth = async () => {
    // Supabaseの可用性をチェック
    const supabaseAvailable = await isSupabaseAvailable()
    setUseSupabase(supabaseAvailable)
    
    if (!supabaseAvailable) {
      console.log('🔧 ローカルSupabaseが利用できません。モック認証を使用します。')
    }
    
    checkAuthStatus()
  }

  const checkAuthStatus = async () => {
    try {
      let session = null
      
      if (useSupabase) {
        const { data } = await supabase.auth.getSession()
        session = data.session
      } else {
        const { data } = await mockAuth.getSession()
        session = data.session
      }
      
      if (session?.user?.email && adminEmails.includes(session.user.email)) {
        setIsAuthenticated(true)
      } else {
        setIsAuthenticated(false)
      }
    } catch (error) {
      console.error('Auth check error:', error)
      setIsAuthenticated(false)
    } finally {
      setIsLoading(false)
    }
  }

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault()
    setError('')
    
    try {
      let data, error
      
      if (useSupabase) {
        const result = await supabase.auth.signInWithPassword({
          email,
          password,
        })
        data = result.data
        error = result.error
      } else {
        const result = await mockAuth.signInWithPassword({
          email,
          password,
        })
        data = result.data
        error = result.error
      }

      if (error) {
        setError('ログインに失敗しました: ' + error.message)
        return
      }

      if (data.user?.email && adminEmails.includes(data.user.email)) {
        setIsAuthenticated(true)
      } else {
        setError('管理者権限がありません。')
        if (useSupabase) {
          await supabase.auth.signOut()
        } else {
          await mockAuth.signOut()
        }
      }
    } catch {
      setError('ログインエラーが発生しました。')
    }
  }

  const handleLogout = async () => {
    if (useSupabase) {
      await supabase.auth.signOut()
    } else {
      await mockAuth.signOut()
    }
    setIsAuthenticated(false)
  }

  // ハイドレーションエラーを防ぐため、クライアントサイドでマウント後のみレンダリング
  if (!isMounted || isLoading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-indigo-600"></div>
      </div>
    )
  }

  if (!isAuthenticated) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="max-w-md w-full space-y-8">
          <div>
            <h2 className="mt-6 text-center text-3xl font-extrabold text-gray-900">
              管理画面ログイン
            </h2>
            <p className="mt-2 text-center text-sm text-gray-600">
              管理者アカウントでログインしてください
            </p>
          </div>
          
          <form className="mt-8 space-y-6" onSubmit={handleLogin}>
            <div className="rounded-md shadow-sm -space-y-px">
              <div>
                <label htmlFor="email" className="sr-only">
                  メールアドレス
                </label>
                <input
                  id="email"
                  name="email"
                  type="email"
                  required
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="relative block w-full px-3 py-2 border border-gray-300 placeholder-gray-500 text-gray-900 rounded-t-md focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 focus:z-10 sm:text-sm"
                  placeholder="管理者メールアドレス"
                />
              </div>
              
              <div>
                <label htmlFor="password" className="sr-only">
                  パスワード
                </label>
                <input
                  id="password"
                  name="password"
                  type="password"
                  required
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="relative block w-full px-3 py-2 border border-gray-300 placeholder-gray-500 text-gray-900 rounded-b-md focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 focus:z-10 sm:text-sm"
                  placeholder="パスワード"
                />
              </div>
            </div>

            {error && (
              <div className="text-red-600 text-sm text-center">{error}</div>
            )}

            <div>
              <button
                type="submit"
                className="group relative w-full flex justify-center py-2 px-4 border border-transparent text-sm font-medium rounded-md text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
              >
                ログイン
              </button>
            </div>
          </form>

          <div className="mt-4 p-4 bg-blue-50 rounded-md">
            <p className="text-sm text-blue-800">
              <strong>テスト用アカウント:</strong><br />
              メール: admin@test.com<br />
              パスワード: pass1word!<br />
              {!useSupabase && (
                <span className="text-orange-600">
                  <br />📝 モック認証モードで動作中
                </span>
              )}
            </p>
          </div>
        </div>
      </div>
    )
  }

  return (
    <div>
      {/* ログアウトボタンを追加 */}
      <div className="fixed top-4 right-4 z-50">
        <button
          onClick={handleLogout}
          className="bg-red-600 text-white px-4 py-2 rounded-md text-sm hover:bg-red-700 focus:outline-none focus:ring-2 focus:ring-red-500"
        >
          ログアウト
        </button>
      </div>
      {children}
    </div>
  )
}