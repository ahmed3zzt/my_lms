import type { Category, Tag } from '@/types'

export interface ICategoryService {
  getCategories(): Promise<Category[]>
  getCategoryBySlug(slug: string): Promise<Category | null>
  createCategory(category: Partial<Category>): Promise<Category>
  updateCategory(id: string, category: Partial<Category>): Promise<Category>
  deleteCategory(id: string): Promise<void>
  
  // Tag operations
  getTags(): Promise<Tag[]>
  createTag(name: string, slug: string): Promise<Tag>
  deleteTag(id: string): Promise<void>
}
