'use client'

import { useEffect, useState } from 'react'

interface NoSSRProps {
  children: React.ReactNode
  fallback?: React.ReactNode
}

/**
 * ハイドレーションエラーを防ぐため、クライアントサイドでのみレンダリングするコンポーネント
 */
export default function NoSSR({ children, fallback = null }: NoSSRProps) {
  const [hasMounted, setHasMounted] = useState(false)

  useEffect(() => {
    setHasMounted(true)
  }, [])

  if (!hasMounted) {
    return <>{fallback}</>
  }

  return <>{children}</>
}