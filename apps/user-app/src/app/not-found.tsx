'use client'

import Link from 'next/link'

export default function NotFound() {
  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900 flex flex-col justify-center items-center px-4">
      <div className="max-w-md text-center">
        <h1 className="text-9xl font-bold text-gray-200 dark:text-gray-700 mb-4">
          404
        </h1>
        
        <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-4">
          ページが見つかりません
        </h2>
        
        <p className="text-gray-600 dark:text-gray-400 mb-8">
          お探しのページは存在しないか、移動した可能性があります。
        </p>
        
        <Link
          href="/"
          className="inline-flex items-center px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white font-medium rounded-md transition-colors"
        >
          ← ホームに戻る
        </Link>
      </div>
    </div>
  )
}