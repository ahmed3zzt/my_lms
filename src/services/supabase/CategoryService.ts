import type { ICategoryService } from '@/services/contracts/ICategoryService'
import type { Category, Tag } from '@/types'
import { supabase } from './client'

export class SupabaseCategoryService implements ICategoryService {
  async getCategories(): Promise<Category[]> {
    if (!supabase) throw new Error('Supabase is not configured')
    const { data, error } = await supabase
      .from('categories')
      .select('*, courses:courses(count)')
      .order('sort_order', { ascending: true })

    if (error) throw error

    return (data || []).map((c: any) => ({
      ...c,
      course_count: c.courses?.[0]?.count ?? 0
    }))
  }

  async getCategoryBySlug(slug: string): Promise<Category | null> {
    if (!supabase) throw new Error('Supabase is not configured')
    const { data, error } = await supabase
      .from('categories')
      .select('*')
      .eq('slug', slug)
      .single()

    if (error) {
      if (error.code === 'PGRST116') return null
      throw error
    }
    return data
  }

  async createCategory(category: Partial<Category>): Promise<Category> {
    if (!supabase) throw new Error('Supabase is not configured')
    const { data, error } = await supabase
      .from('categories')
      .insert([category])
      .select('*')
      .single()

    if (error) throw error
    return data
  }

  async updateCategory(id: string, category: Partial<Category>): Promise<Category> {
    if (!supabase) throw new Error('Supabase is not configured')
    const { data, error } = await supabase
      .from('categories')
      .update(category)
      .eq('id', id)
      .select('*')
      .single()

    if (error) throw error
    return data
  }

  async deleteCategory(id: string): Promise<void> {
    if (!supabase) throw new Error('Supabase is not configured')
    const { error } = await supabase.from('categories').delete().eq('id', id)
    if (error) throw error
  }

  async getTags(): Promise<Tag[]> {
    if (!supabase) throw new Error('Supabase is not configured')
    const { data, error } = await supabase
      .from('tags')
      .select('*')
      .order('name', { ascending: true })

    if (error) throw error
    return data || []
  }

  async createTag(name: string, slug: string): Promise<Tag> {
    if (!supabase) throw new Error('Supabase is not configured')
    const { data, error } = await supabase
      .from('tags')
      .insert([{ name, slug }])
      .select('*')
      .single()

    if (error) throw error
    return data
  }

  async deleteTag(id: string): Promise<void> {
    if (!supabase) throw new Error('Supabase is not configured')
    const { error } = await supabase.from('tags').delete().eq('id', id)
    if (error) throw error
  }
}
