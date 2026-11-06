export interface Profile {
  id: string
  full_name: string
  title: string
  bio: string
  avatar_url?: string
  github_url?: string
  linkedin_url?: string
  portfolio_url?: string
  email?: string
  created_at: string
  updated_at: string
}

export interface Category {
  id: string
  name: string
  slug: string
  description?: string
  icon?: string
  sort_order: number
  created_at: string
  course_count?: number
}

export interface Course {
  id: string
  category_id?: string
  title: string
  slug: string
  description?: string
  cover_image_url?: string
  is_featured: boolean
  is_published: boolean
  sort_order: number
  created_at: string
  updated_at: string
  category?: Category
  lesson_count?: number
  lessons?: Lesson[]
}

export interface Tag {
  id: string
  name: string
  slug: string
  created_at: string
}

export interface Attachment {
  id: string
  lesson_id: string
  title: string
  file_url: string
  file_type: string
  file_size: number
  created_at: string
}

export interface Lesson {
  id: string
  course_id: string
  title: string
  slug: string
  description?: string
  content_markdown: string
  cover_image_url?: string
  youtube_url?: string
  github_repo_url?: string
  reading_time_minutes: number
  sort_order: number
  is_published: boolean
  published_at?: string
  created_at: string
  updated_at: string
  course?: Course
  tags?: Tag[]
  attachments?: Attachment[]
  prev_lesson?: { title: string; slug: string }
  next_lesson?: { title: string; slug: string }
}

export interface SearchResult {
  type: 'course' | 'lesson'
  id: string
  title: string
  slug: string
  description?: string
  category_name?: string
  course_slug?: string
}
