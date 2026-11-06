import type { ICourseService, CourseFilter } from '@/services/contracts/ICourseService'
import type { ILessonService, LessonFilter } from '@/services/contracts/ILessonService'
import type { ICategoryService } from '@/services/contracts/ICategoryService'
import type { IStorageService, StorageBucket } from '@/services/contracts/IStorageService'
import type { IAuthService, AuthUser } from '@/services/contracts/IAuthService'
import type { IProfileService } from '@/services/contracts/IProfileService'
import type { Course, Lesson, Category, Tag, Profile, SearchResult } from '@/types'
import { mockCategories, mockCourses, mockLessons, mockTags, mockProfile } from './mockData'

export class MockCourseService implements ICourseService {
  private courses: Course[] = JSON.parse(JSON.stringify(mockCourses))

  async getCourses(filter?: CourseFilter): Promise<Course[]> {
    let result = [...this.courses]
    if (filter?.isPublished !== undefined) {
      result = result.filter(c => c.is_published === filter.isPublished)
    }
    if (filter?.isFeatured !== undefined) {
      result = result.filter(c => c.is_featured === filter.isFeatured)
    }
    if (filter?.categorySlug) {
      const cat = mockCategories.find(c => c.slug === filter.categorySlug)
      if (cat) {
        result = result.filter(c => c.category_id === cat.id)
      }
    }
    return result.map(c => ({
      ...c,
      category: mockCategories.find(cat => cat.id === c.category_id)
    }))
  }

  async getCourseBySlug(slug: string): Promise<Course | null> {
    const course = this.courses.find(c => c.slug === slug)
    if (!course) return null
    const lessons = mockLessons.filter(l => l.course_id === course.id)
    return {
      ...course,
      category: mockCategories.find(cat => cat.id === course.category_id),
      lessons,
      lesson_count: lessons.length
    }
  }

  async createCourse(course: Partial<Course>): Promise<Course> {
    const newCourse: Course = {
      id: crypto.randomUUID(),
      title: course.title || 'Untitled Course',
      slug: course.slug || 'untitled-course',
      description: course.description || '',
      cover_image_url: course.cover_image_url,
      category_id: course.category_id,
      is_featured: course.is_featured ?? false,
      is_published: course.is_published ?? false,
      sort_order: course.sort_order ?? this.courses.length + 1,
      lesson_count: 0,
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString()
    }
    this.courses.push(newCourse)
    return newCourse
  }

  async updateCourse(id: string, course: Partial<Course>): Promise<Course> {
    const index = this.courses.findIndex(c => c.id === id)
    if (index === -1) throw new Error('Course not found')
    this.courses[index] = {
      ...this.courses[index],
      ...course,
      updated_at: new Date().toISOString()
    }
    return this.courses[index]
  }

  async deleteCourse(id: string): Promise<void> {
    this.courses = this.courses.filter(c => c.id !== id)
  }
}

export class MockLessonService implements ILessonService {
  private lessons: Lesson[] = JSON.parse(JSON.stringify(mockLessons))

  async getLessons(filter?: LessonFilter): Promise<Lesson[]> {
    let result = [...this.lessons]
    if (filter?.isPublished !== undefined) {
      result = result.filter(l => l.is_published === filter.isPublished)
    }
    if (filter?.courseId) {
      result = result.filter(l => l.course_id === filter.courseId)
    }
    if (filter?.courseSlug) {
      const course = mockCourses.find(c => c.slug === filter.courseSlug)
      if (course) {
        result = result.filter(l => l.course_id === course.id)
      }
    }
    return result.map(l => ({
      ...l,
      course: mockCourses.find(c => c.id === l.course_id)
    }))
  }

  async getLatestLessons(limit = 6): Promise<Lesson[]> {
    const published = this.lessons.filter(l => l.is_published)
    published.sort((a, b) => new Date(b.created_at).getTime() - new Date(a.created_at).getTime())
    return published.slice(0, limit).map(l => ({
      ...l,
      course: mockCourses.find(c => c.id === l.course_id)
    }))
  }

  async getLessonBySlug(courseSlug: string, lessonSlug: string): Promise<Lesson | null> {
    const course = mockCourses.find(c => c.slug === courseSlug)
    if (!course) return null
    const courseLessons = this.lessons
      .filter(l => l.course_id === course.id && l.is_published)
      .sort((a, b) => a.sort_order - b.sort_order)

    const index = courseLessons.findIndex(l => l.slug === lessonSlug)
    if (index === -1) return null

    const lesson = courseLessons[index]
    const prev = index > 0 ? { title: courseLessons[index - 1].title, slug: courseLessons[index - 1].slug } : undefined
    const next = index < courseLessons.length - 1 ? { title: courseLessons[index + 1].title, slug: courseLessons[index + 1].slug } : undefined

    return {
      ...lesson,
      course,
      prev_lesson: prev,
      next_lesson: next
    }
  }

  async createLesson(lesson: Partial<Lesson>): Promise<Lesson> {
    const newLesson: Lesson = {
      id: crypto.randomUUID(),
      course_id: lesson.course_id || mockCourses[0].id,
      title: lesson.title || 'Untitled Lesson',
      slug: lesson.slug || 'untitled-lesson',
      description: lesson.description || '',
      content_markdown: lesson.content_markdown || '',
      cover_image_url: lesson.cover_image_url,
      youtube_url: lesson.youtube_url,
      github_repo_url: lesson.github_repo_url,
      reading_time_minutes: lesson.reading_time_minutes || 5,
      sort_order: lesson.sort_order ?? this.lessons.length + 1,
      is_published: lesson.is_published ?? false,
      published_at: lesson.is_published ? new Date().toISOString() : undefined,
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString()
    }
    this.lessons.push(newLesson)
    return newLesson
  }

  async updateLesson(id: string, lesson: Partial<Lesson>): Promise<Lesson> {
    const index = this.lessons.findIndex(l => l.id === id)
    if (index === -1) throw new Error('Lesson not found')
    this.lessons[index] = {
      ...this.lessons[index],
      ...lesson,
      updated_at: new Date().toISOString()
    }
    return this.lessons[index]
  }

  async deleteLesson(id: string): Promise<void> {
    this.lessons = this.lessons.filter(l => l.id !== id)
  }

  async searchLessons(query: string): Promise<SearchResult[]> {
    const q = query.toLowerCase().trim()
    if (!q) return []
    const results: SearchResult[] = []

    for (const c of mockCourses) {
      if (c.title.toLowerCase().includes(q) || c.description?.toLowerCase().includes(q)) {
        results.push({
          type: 'course',
          id: c.id,
          title: c.title,
          slug: c.slug,
          description: c.description
        })
      }
    }

    for (const l of this.lessons) {
      if (l.title.toLowerCase().includes(q) || l.description?.toLowerCase().includes(q) || l.content_markdown.toLowerCase().includes(q)) {
        const c = mockCourses.find(course => course.id === l.course_id)
        results.push({
          type: 'lesson',
          id: l.id,
          title: l.title,
          slug: l.slug,
          description: l.description,
          course_slug: c?.slug
        })
      }
    }

    return results
  }
}

export class MockCategoryService implements ICategoryService {
  private categories: Category[] = JSON.parse(JSON.stringify(mockCategories))
  private tags: Tag[] = JSON.parse(JSON.stringify(mockTags))

  async getCategories(): Promise<Category[]> {
    return [...this.categories]
  }

  async getCategoryBySlug(slug: string): Promise<Category | null> {
    return this.categories.find(c => c.slug === slug) || null
  }

  async createCategory(category: Partial<Category>): Promise<Category> {
    const newCat: Category = {
      id: crypto.randomUUID(),
      name: category.name || 'New Category',
      slug: category.slug || 'new-category',
      description: category.description || '',
      icon: category.icon || 'Folder',
      sort_order: category.sort_order ?? this.categories.length + 1,
      created_at: new Date().toISOString(),
      course_count: 0
    }
    this.categories.push(newCat)
    return newCat
  }

  async updateCategory(id: string, category: Partial<Category>): Promise<Category> {
    const index = this.categories.findIndex(c => c.id === id)
    if (index === -1) throw new Error('Category not found')
    this.categories[index] = { ...this.categories[index], ...category }
    return this.categories[index]
  }

  async deleteCategory(id: string): Promise<void> {
    this.categories = this.categories.filter(c => c.id !== id)
  }

  async getTags(): Promise<Tag[]> {
    return [...this.tags]
  }

  async createTag(name: string, slug: string): Promise<Tag> {
    const newTag: Tag = {
      id: crypto.randomUUID(),
      name,
      slug,
      created_at: new Date().toISOString()
    }
    this.tags.push(newTag)
    return newTag
  }

  async deleteTag(id: string): Promise<void> {
    this.tags = this.tags.filter(t => t.id !== id)
  }
}

export class MockStorageService implements IStorageService {
  async uploadFile(_bucket: StorageBucket, path: string, _file: File): Promise<string> {
    // Generate a placeholder object URL for local mock
    return `https://images.unsplash.com/photo-1558494949-ef010cbdcc31?auto=format&fit=crop&w=800&q=80#${path}`
  }

  getPublicUrl(_bucket: StorageBucket, path: string): string {
    return path
  }

  async deleteFile(_bucket: StorageBucket, _path: string): Promise<void> {
    // no-op
  }
}

export class MockAuthService implements IAuthService {
  private currentUser: AuthUser | null = null
  private listeners: ((user: AuthUser | null) => void)[] = []

  constructor() {
    const saved = localStorage.getItem('mock_admin_auth')
    if (saved) {
      try {
        this.currentUser = JSON.parse(saved)
      } catch {
        // ignore
      }
    }
  }

  async getCurrentUser(): Promise<AuthUser | null> {
    return this.currentUser
  }

  async signIn(email: string, _password: string): Promise<AuthUser> {
    this.currentUser = {
      id: '00000000-0000-0000-0000-000000000001',
      email
    }
    localStorage.setItem('mock_admin_auth', JSON.stringify(this.currentUser))
    this.listeners.forEach(cb => cb(this.currentUser))
    return this.currentUser
  }

  async signOut(): Promise<void> {
    this.currentUser = null
    localStorage.removeItem('mock_admin_auth')
    this.listeners.forEach(cb => cb(null))
  }

  onAuthStateChange(callback: (user: AuthUser | null) => void): { unsubscribe: () => void } {
    this.listeners.push(callback)
    callback(this.currentUser)
    return {
      unsubscribe: () => {
        this.listeners = this.listeners.filter(cb => cb !== callback)
      }
    }
  }
}

export class MockProfileService implements IProfileService {
  private profile: Profile = { ...mockProfile }

  async getProfile(): Promise<Profile> {
    return { ...this.profile }
  }

  async updateProfile(profile: Partial<Profile>): Promise<Profile> {
    this.profile = {
      ...this.profile,
      ...profile,
      updated_at: new Date().toISOString()
    }
    return { ...this.profile }
  }
}
