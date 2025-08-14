'use client'

export default function GlobalError({
  error: _error,
  reset,
}: {
  error: Error & { digest?: string }
  reset: () => void
}) {
  return (
    <html>
      <body>
        <div className="min-h-screen bg-gray-50 dark:bg-gray-900 flex flex-col justify-center items-center px-4">
          <div className="max-w-md text-center">
            <h1 className="text-9xl font-bold text-gray-200 dark:text-gray-700 mb-4">
              500
            </h1>
            
            <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-4">
              サーバーエラーが発生しました
            </h2>
            
            <p className="text-gray-600 dark:text-gray-400 mb-8">
              予期しないエラーが発生しました。しばらく時間をおいて再度お試しください。
            </p>
            
            <button
              onClick={() => reset()}
              className="inline-flex items-center px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white font-medium rounded-md transition-colors"
            >
              再試行
            </button>
          </div>
        </div>
      </body>
    </html>
  )
}