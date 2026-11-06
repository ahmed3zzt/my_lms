import type { Lesson, SearchResult } from '@/types'

export interface LessonFilter {
  courseId?: string
  courseSlug?: string
  isPublished?: boolean
  tagSlug?: string
}

export interface ILessonService {
  getLessons(filter?: LessonFilter): Promise<Lesson[]>
  getLatestLessons(limit?: number): Promise<Lesson[]>
  getLessonBySlug(courseSlug: string, lessonSlug: string): Promise<Lesson | null>
  createLesson(lesson: Partial<Lesson>): Promise<Lesson>
  updateLesson(id: string, lesson: Partial<Lesson>): Promise<Lesson>
  deleteLesson(id: string): Promise<void>
  searchLessons(query: string): Promise<SearchResult[]>
}
