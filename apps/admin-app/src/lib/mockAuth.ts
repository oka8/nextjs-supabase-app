// モック認証システム（ローカルSupabaseが利用できない環境用）

interface MockUser {
  id: string
  email: string
  created_at: string
}

interface MockSession {
  user: MockUser
  access_token: string
}

interface MockAuthResponse {
  data: {
    user?: MockUser
    session?: MockSession
  }
  error?: {
    message: string
  }
}

// 管理者メールアドレスのリスト
const ADMIN_EMAILS = [
  'admin@test.com',
  'admin@example.com',
  'test@example.com'
]

// 簡易パスワード検証（実際の運用では絶対に使用しないこと）
const MOCK_PASSWORDS: Record<string, string> = {
  'admin@test.com': 'pass1word!',
  'admin@example.com': 'admin123',
  'test@example.com': 'test123'
}

// ローカルストレージキー
const MOCK_SESSION_KEY = 'mock_admin_session'

class MockSupabaseAuth {
  private currentSession: MockSession | null = null

  constructor() {
    // ページロード時にセッションを復元
    this.loadSession()
  }

  private loadSession() {
    if (typeof window !== 'undefined') {
      const stored = localStorage.getItem(MOCK_SESSION_KEY)
      if (stored) {
        try {
          this.currentSession = JSON.parse(stored)
        } catch (error) {
          console.warn('モックセッションの復元に失敗:', error)
          localStorage.removeItem(MOCK_SESSION_KEY)
        }
      }
    }
  }

  private saveSession(session: MockSession) {
    if (typeof window !== 'undefined') {
      localStorage.setItem(MOCK_SESSION_KEY, JSON.stringify(session))
    }
    this.currentSession = session
  }

  private clearSession() {
    if (typeof window !== 'undefined') {
      localStorage.removeItem(MOCK_SESSION_KEY)
    }
    this.currentSession = null
  }

  async signInWithPassword({ email, password }: { email: string; password: string }): Promise<MockAuthResponse> {
    // 遅延を追加してリアルなAPI感を演出
    await new Promise(resolve => setTimeout(resolve, 500))

    // 管理者チェック
    if (!ADMIN_EMAILS.includes(email)) {
      return {
        data: {},
        error: { message: '管理者権限がありません' }
      }
    }

    // パスワードチェック
    if (MOCK_PASSWORDS[email] !== password) {
      return {
        data: {},
        error: { message: 'メールアドレスまたはパスワードが正しくありません' }
      }
    }

    // セッション作成
    const user: MockUser = {
      id: `mock-user-${Date.now()}`,
      email,
      created_at: new Date().toISOString()
    }

    const session: MockSession = {
      user,
      access_token: `mock-token-${Date.now()}`
    }

    this.saveSession(session)

    return {
      data: { user, session }
    }
  }

  async getSession(): Promise<{ data: { session: MockSession | null } }> {
    return {
      data: { session: this.currentSession }
    }
  }

  async signOut(): Promise<{ error?: { message: string } }> {
    this.clearSession()
    return {}
  }
}

// モック認証クライアントのインスタンス
export const mockAuth = new MockSupabaseAuth()

// Supabase接続チェック
export async function isSupabaseAvailable(): Promise<boolean> {
  if (typeof window === 'undefined') return false
  
  try {
    const response = await fetch('http://127.0.0.1:54321/health', {
      method: 'GET',
      timeout: 1000
    } as any)
    return response.ok
  } catch (error) {
    return false
  }
}