import type { Course } from '@/types'

export interface CourseFilter {
  categorySlug?: string
  isFeatured?: boolean
  isPublished?: boolean
}

export interface ICourseService {
  getCourses(filter?: CourseFilter): Promise<Course[]>
  getCourseBySlug(slug: string): Promise<Course | null>
  createCourse(course: Partial<Course>): Promise<Course>
  updateCourse(id: string, course: Partial<Course>): Promise<Course>
  deleteCourse(id: string): Promise<void>
}
