import type { ICourseService, CourseFilter } from '@/services/contracts/ICourseService'
import type { Course } from '@/types'
import { supabase } from './client'

export class SupabaseCourseService implements ICourseService {
  async getCourses(filter?: CourseFilter): Promise<Course[]> {
    if (!supabase) throw new Error('Supabase is not configured')
    let query = supabase
      .from('courses')
      .select('*, category:categories(*), lessons:lessons(count)')
      .order('sort_order', { ascending: true })

    if (filter?.isPublished !== undefined) {
      query = query.eq('is_published', filter.isPublished)
    }
    if (filter?.isFeatured !== undefined) {
      query = query.eq('is_featured', filter.isFeatured)
    }
    if (filter?.categorySlug) {
      // Filter by joined category
      const { data: cat } = await supabase
        .from('categories')
        .select('id')
        .eq('slug', filter.categorySlug)
        .single()
      if (cat) {
        query = query.eq('category_id', cat.id)
      }
    }

    const { data, error } = await query
    if (error) throw error

    return (data || []).map((row: any) => ({
      ...row,
      lesson_count: row.lessons?.[0]?.count ?? 0
    }))
  }

  async getCourseBySlug(slug: string): Promise<Course | null> {
    if (!supabase) throw new Error('Supabase is not configured')
    const { data, error } = await supabase
      .from('courses')
      .select('*, category:categories(*), lessons:lessons(*)')
      .eq('slug', slug)
      .order('sort_order', { foreignTable: 'lessons', ascending: true })
      .single()

    if (error) {
      if (error.code === 'PGRST116') return null // Not found
      throw error
    }

    return {
      ...data,
      lesson_count: data.lessons?.length || 0
    }
  }

  async createCourse(course: Partial<Course>): Promise<Course> {
    if (!supabase) throw new Error('Supabase is not configured')
    const { data, error } = await supabase
      .from('courses')
      .insert([course])
      .select('*, category:categories(*)')
      .single()

    if (error) throw error
    return data
  }

  async updateCourse(id: string, course: Partial<Course>): Promise<Course> {
    if (!supabase) throw new Error('Supabase is not configured')
    const { data, error } = await supabase
      .from('courses')
      .update({ ...course, updated_at: new Date().toISOString() })
      .eq('id', id)
      .select('*, category:categories(*)')
      .single()

    if (error) throw error
    return data
  }

  async deleteCourse(id: string): Promise<void> {
    if (!supabase) throw new Error('Supabase is not configured')
    const { error } = await supabase.from('courses').delete().eq('id', id)
    if (error) throw error
  }
}
