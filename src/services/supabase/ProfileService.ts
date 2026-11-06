import type { IProfileService } from '@/services/contracts/IProfileService'
import type { Profile } from '@/types'
import { supabase } from './client'

export class SupabaseProfileService implements IProfileService {
  async getProfile(): Promise<Profile> {
    const defaultProfile: Profile = {
      id: 'default-profile-id',
      full_name: 'Ahmed Ezz',
      title: 'Backend Software Engineer',
      bio: 'Backend Software Engineer passionate about backend development, Linux, databases, distributed systems, clean architecture, and teaching programming through practical examples.',
      github_url: 'https://github.com/ahmedezz',
      linkedin_url: 'https://linkedin.com/in/ahmedezz',
      portfolio_url: 'https://ahmedezz.dev',
      email: 'ahmed@example.com',
      avatar_url: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=400&q=80',
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString()
    }

    if (!supabase) return defaultProfile

    const { data, error } = await supabase
      .from('profiles')
      .select('*')
      .limit(1)
      .maybeSingle()

    if (error || !data) {
      return defaultProfile
    }
    return data
  }

  async updateProfile(profile: Partial<Profile>): Promise<Profile> {
    if (!supabase) throw new Error('Supabase is not configured')
    const { data, error } = await supabase
      .from('profiles')
      .upsert({ ...profile, updated_at: new Date().toISOString() })
      .select('*')
      .single()

    if (error) throw error
    return data
  }
}
