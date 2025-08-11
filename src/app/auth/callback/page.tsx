'use client'

import { useEffect, useState } from 'react'
import { useRouter } from 'next/navigation'
import { supabase } from '@/lib/supabase'

export default function AuthCallback() {
  const router = useRouter()
  const [status, setStatus] = useState<'loading' | 'success' | 'error'>('loading')
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    const handleAuthCallback = async () => {
      try {
        // URLから認証コードを取得してセッションを交換
        const hashParams = new URLSearchParams(window.location.hash.slice(1))
        const searchParams = new URLSearchParams(window.location.search)
        
        // OAuth認証の場合、コールバック処理
        if (hashParams.get('access_token') || searchParams.get('code')) {
          const { data, error } = await supabase.auth.getSession()
          
          if (error) {
            console.error('Auth callback error:', error)
            setError(error.message)
            setStatus('error')
            return
          }

          if (data.session) {
            setStatus('success')
            // 成功時はホームページにリダイレクト
            setTimeout(() => router.push('/'), 2000)
          } else {
            // セッションがない場合、認証状態の変更を待つ
            const { data: authListener } = supabase.auth.onAuthStateChange((event, session) => {
              if (event === 'SIGNED_IN' && session) {
                setStatus('success')
                setTimeout(() => router.push('/'), 2000)
              }
            })
            
            // 5秒後に認証が完了しない場合はエラー
            setTimeout(() => {
              setError('認証がタイムアウトしました')
              setStatus('error')
              authListener.subscription.unsubscribe()
            }, 5000)
          }
        } else {
          setError('認証パラメータが見つかりません')
          setStatus('error')
        }
      } catch (error) {
        console.error('Auth callback error:', error)
        setError('認証処理中にエラーが発生しました')
        setStatus('error')
      }
    }

    handleAuthCallback()
  }, [router])

  if (status === 'loading') {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50 dark:bg-gray-900">
        <div className="text-center">
          <div className="animate-spin rounded-full h-16 w-16 border-b-4 border-blue-600 mx-auto mb-4"></div>
          <h2 className="text-xl font-semibold text-gray-900 dark:text-white mb-2">
            認証を処理しています...
          </h2>
          <p className="text-gray-600 dark:text-gray-400">
            少々お待ちください
          </p>
        </div>
      </div>
    )
  }

  if (status === 'success') {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50 dark:bg-gray-900">
        <div className="text-center">
          <div className="mx-auto flex items-center justify-center h-16 w-16 rounded-full bg-green-100 dark:bg-green-900/20 mb-4">
            <svg
              className="h-8 w-8 text-green-600 dark:text-green-400"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M5 13l4 4L19 7"
              />
            </svg>
          </div>
          <h2 className="text-xl font-semibold text-gray-900 dark:text-white mb-2">
            ログインに成功しました！
          </h2>
          <p className="text-gray-600 dark:text-gray-400">
            ホームページにリダイレクトしています...
          </p>
        </div>
      </div>
    )
  }

  if (status === 'error') {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50 dark:bg-gray-900">
        <div className="text-center max-w-md mx-auto">
          <div className="mx-auto flex items-center justify-center h-16 w-16 rounded-full bg-red-100 dark:bg-red-900/20 mb-4">
            <svg
              className="h-8 w-8 text-red-600 dark:text-red-400"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M6 18L18 6M6 6l12 12"
              />
            </svg>
          </div>
          <h2 className="text-xl font-semibold text-gray-900 dark:text-white mb-2">
            認証に失敗しました
          </h2>
          <p className="text-gray-600 dark:text-gray-400 mb-6">
            {error || '認証処理中にエラーが発生しました'}
          </p>
          <button
            onClick={() => router.push('/auth')}
            className="inline-flex items-center px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
          >
            ログイン画面に戻る
          </button>
        </div>
      </div>
    )
  }

  return null
}