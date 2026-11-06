import type { IStorageService, StorageBucket } from '@/services/contracts/IStorageService'
import { supabase } from './client'

export class SupabaseStorageService implements IStorageService {
  async uploadFile(bucket: StorageBucket, path: string, file: File): Promise<string> {
    if (!supabase) throw new Error('Supabase is not configured')
    const cleanPath = path.startsWith('/') ? path.slice(1) : path
    const { error } = await supabase.storage.from(bucket).upload(cleanPath, file, {
      upsert: true
    })

    if (error) throw error
    return this.getPublicUrl(bucket, cleanPath)
  }

  getPublicUrl(bucket: StorageBucket, path: string): string {
    if (!supabase) return path
    const cleanPath = path.startsWith('/') ? path.slice(1) : path
    const { data } = supabase.storage.from(bucket).getPublicUrl(cleanPath)
    return data.publicUrl
  }

  async deleteFile(bucket: StorageBucket, path: string): Promise<void> {
    if (!supabase) throw new Error('Supabase is not configured')
    const cleanPath = path.startsWith('/') ? path.slice(1) : path
    const { error } = await supabase.storage.from(bucket).remove([cleanPath])
    if (error) throw error
  }
}
