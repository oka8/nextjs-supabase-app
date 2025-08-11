'use client'

import Image from "next/image"
import { useState, useEffect } from "react"
import { supabase } from "../../lib/supabase"

export default function Home() {
  const [isConnected, setIsConnected] = useState<boolean>(false)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const checkConnection = async () => {
      try {
        // Try to get the current session to test the connection
        const { data, error } = await supabase.auth.getSession()
        
        // If we can call the auth API without network errors, the connection is working
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

        <div className="bg-gray-100 dark:bg-gray-800 p-4 rounded-lg">
          <div className="flex items-center gap-2">
            <div className={`w-3 h-3 rounded-full ${loading ? 'bg-yellow-500' : isConnected ? 'bg-green-500' : 'bg-red-500'}`}></div>
            <span className="text-sm font-medium">
              Supabase Status: {loading ? 'Checking...' : isConnected ? 'Connected' : 'Disconnected'}
            </span>
          </div>
          {!loading && !isConnected && (
            <p className="text-sm text-gray-600 dark:text-gray-400 mt-2">
              Make sure to set your Supabase URL and API key in .env.local
            </p>
          )}
        </div>

        <ol className="font-mono list-inside list-decimal text-sm/6 text-center sm:text-left">
          <li className="mb-2 tracking-[-.01em]">
            Configure your Supabase credentials in{" "}
            <code className="bg-black/[.05] dark:bg-white/[.06] font-mono font-semibold px-1 py-0.5 rounded">
              .env.local
            </code>
          </li>
          <li className="tracking-[-.01em]">
            Start building your app with Next.js and Supabase
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