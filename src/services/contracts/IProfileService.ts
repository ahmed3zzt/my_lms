import type { Profile } from '@/types'

export interface IProfileService {
  getProfile(): Promise<Profile>
  updateProfile(profile: Partial<Profile>): Promise<Profile>
}
