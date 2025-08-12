'use client'

import dynamic from 'next/dynamic'
import { ReactNode } from 'react'
import NoSSR from '../NoSSR'

// ハイドレーションエラーを防ぐため、AdminAuthを動的インポート
const AdminAuth = dynamic(() => import('./AdminAuth'), {
  ssr: false, // サーバーサイドレンダリングを無効化
  loading: () => (
    <div className="min-h-screen bg-gray-50 flex items-center justify-center">
      <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-indigo-600"></div>
    </div>
  )
})

interface AdminAuthWrapperProps {
  children: ReactNode
}

export default function AdminAuthWrapper({ children }: AdminAuthWrapperProps) {
  return (
    <NoSSR 
      fallback={
        <div className="min-h-screen bg-gray-50 flex items-center justify-center">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-indigo-600"></div>
        </div>
      }
    >
      <AdminAuth>{children}</AdminAuth>
    </NoSSR>
  )
}