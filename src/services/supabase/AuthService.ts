import type { IAuthService, AuthUser } from '@/services/contracts/IAuthService'
import { supabase } from './client'

export class SupabaseAuthService implements IAuthService {
  async getCurrentUser(): Promise<AuthUser | null> {
    if (!supabase) return null
    const { data: { user }, error } = await supabase.auth.getUser()
    if (error || !user) return null
    return {
      id: user.id,
      email: user.email || ''
    }
  }

  async signIn(email: string, password: string): Promise<AuthUser> {
    if (!supabase) throw new Error('Supabase is not configured')
    const { data, error } = await supabase.auth.signInWithPassword({
      email,
      password
    })
    if (error) throw error
    if (!data.user) throw new Error('User not found')
    return {
      id: data.user.id,
      email: data.user.email || ''
    }
  }

  async signOut(): Promise<void> {
    if (!supabase) return
    const { error } = await supabase.auth.signOut()
    if (error) throw error
  }

  onAuthStateChange(callback: (user: AuthUser | null) => void): { unsubscribe: () => void } {
    if (!supabase) {
      return { unsubscribe: () => {} }
    }
    const { data: { subscription } } = supabase.auth.onAuthStateChange((_event, session) => {
      if (session?.user) {
        callback({
          id: session.user.id,
          email: session.user.email || ''
        })
      } else {
        callback(null)
      }
    })
    return { unsubscribe: () => subscription.unsubscribe() }
  }
}
