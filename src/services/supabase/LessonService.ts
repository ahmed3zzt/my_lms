import type { ILessonService, LessonFilter } from '@/services/contracts/ILessonService'
import type { Lesson, SearchResult } from '@/types'
import { supabase } from './client'

export class SupabaseLessonService implements ILessonService {
  async getLessons(filter?: LessonFilter): Promise<Lesson[]> {
    if (!supabase) throw new Error('Supabase is not configured')
    let query = supabase
      .from('lessons')
      .select('*, course:courses(id, title, slug), tags:lesson_tags(tag:tags(*))')
      .order('sort_order', { ascending: true })

    if (filter?.isPublished !== undefined) {
      query = query.eq('is_published', filter.isPublished)
    }
    if (filter?.courseId) {
      query = query.eq('course_id', filter.courseId)
    }
    if (filter?.courseSlug) {
      const { data: crs } = await supabase
        .from('courses')
        .select('id')
        .eq('slug', filter.courseSlug)
        .single()
      if (crs) {
        query = query.eq('course_id', crs.id)
      }
    }

    const { data, error } = await query
    if (error) throw error

    return (data || []).map((row: any) => ({
      ...row,
      tags: row.tags?.map((t: any) => t.tag) || []
    }))
  }

  async getLatestLessons(limit = 6): Promise<Lesson[]> {
    if (!supabase) throw new Error('Supabase is not configured')
    const { data, error } = await supabase
      .from('lessons')
      .select('*, course:courses(id, title, slug, category:categories(*)), tags:lesson_tags(tag:tags(*))')
      .eq('is_published', true)
      .order('published_at', { ascending: false })
      .limit(limit)

    if (error) throw error

    return (data || []).map((row: any) => ({
      ...row,
      tags: row.tags?.map((t: any) => t.tag) || []
    }))
  }

  async getLessonBySlug(courseSlug: string, lessonSlug: string): Promise<Lesson | null> {
    if (!supabase) throw new Error('Supabase is not configured')
    // 1. Fetch course
    const { data: course, error: cErr } = await supabase
      .from('courses')
      .select('id, title, slug')
      .eq('slug', courseSlug)
      .single()

    if (cErr || !course) return null

    // 2. Fetch all published lessons for this course to calculate prev/next
    const { data: allCourseLessons } = await supabase
      .from('lessons')
      .select('id, title, slug, sort_order')
      .eq('course_id', course.id)
      .eq('is_published', true)
      .order('sort_order', { ascending: true })

    const currentIndex = (allCourseLessons || []).findIndex(l => l.slug === lessonSlug)
    const prev = currentIndex > 0 ? {
      title: allCourseLessons![currentIndex - 1].title,
      slug: allCourseLessons![currentIndex - 1].slug
    } : undefined
    const next = currentIndex >= 0 && currentIndex < (allCourseLessons || []).length - 1 ? {
      title: allCourseLessons![currentIndex + 1].title,
      slug: allCourseLessons![currentIndex + 1].slug
    } : undefined

    // 3. Fetch current lesson with attachments and tags
    const { data, error } = await supabase
      .from('lessons')
      .select('*, course:courses(*), attachments(*), tags:lesson_tags(tag:tags(*))')
      .eq('course_id', course.id)
      .eq('slug', lessonSlug)
      .single()

    if (error) {
      if (error.code === 'PGRST116') return null
      throw error
    }

    return {
      ...data,
      tags: data.tags?.map((t: any) => t.tag) || [],
      prev_lesson: prev,
      next_lesson: next
    }
  }

  async createLesson(lesson: Partial<Lesson>): Promise<Lesson> {
    if (!supabase) throw new Error('Supabase is not configured')
    const { tags, attachments, ...rest } = lesson as any
    const { data, error } = await supabase
      .from('lessons')
      .insert([rest])
      .select('*, course:courses(*)')
      .single()

    if (error) throw error
    return data
  }

  async updateLesson(id: string, lesson: Partial<Lesson>): Promise<Lesson> {
    if (!supabase) throw new Error('Supabase is not configured')
    const { tags, attachments, course, prev_lesson, next_lesson, ...rest } = lesson as any
    const { data, error } = await supabase
      .from('lessons')
      .update({ ...rest, updated_at: new Date().toISOString() })
      .eq('id', id)
      .select('*, course:courses(*)')
      .single()

    if (error) throw error
    return data
  }

  async deleteLesson(id: string): Promise<void> {
    if (!supabase) throw new Error('Supabase is not configured')
    const { error } = await supabase.from('lessons').delete().eq('id', id)
    if (error) throw error
  }

  async searchLessons(query: string): Promise<SearchResult[]> {
    if (!supabase) throw new Error('Supabase is not configured')
    const q = query.trim()
    if (!q) return []

    const [lessonsRes, coursesRes] = await Promise.all([
      supabase
        .from('lessons')
        .select('id, title, slug, description, course:courses(slug)')
        .eq('is_published', true)
        .ilike('title', `%${q}%`)
        .limit(10),
      supabase
        .from('courses')
        .select('id, title, slug, description, category:categories(name)')
        .eq('is_published', true)
        .ilike('title', `%${q}%`)
        .limit(5)
    ])

    const results: SearchResult[] = []

    if (coursesRes.data) {
      for (const c of coursesRes.data) {
        results.push({
          type: 'course',
          id: c.id,
          title: c.title,
          slug: c.slug,
          description: c.description,
          category_name: (c.category as any)?.name
        })
      }
    }

    if (lessonsRes.data) {
      for (const l of lessonsRes.data) {
        results.push({
          type: 'lesson',
          id: l.id,
          title: l.title,
          slug: l.slug,
          description: l.description,
          course_slug: (l.course as any)?.slug
        })
      }
    }

    return results
  }
}
