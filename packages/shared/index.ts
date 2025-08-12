// Supabase client and types
export { supabase } from './lib/supabase'
export type { User, Session, AuthChangeEvent } from './lib/supabase'

// Authentication context
export { AuthProvider, useAuth } from './contexts/AuthContext'

// Authentication components
export { default as LoginForm } from './components/auth/LoginForm'
export { default as SignUpForm } from './components/auth/SignUpForm'
export { default as GoogleSignInButton } from './components/auth/GoogleSignInButton'
export { default as ProtectedRoute } from './components/auth/ProtectedRoute'