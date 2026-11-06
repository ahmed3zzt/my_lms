import { isSupabaseConfigured } from './supabase/client'
import type { ICourseService } from './contracts/ICourseService'
import type { ILessonService } from './contracts/ILessonService'
import type { ICategoryService } from './contracts/ICategoryService'
import type { IStorageService } from './contracts/IStorageService'
import type { IAuthService } from './contracts/IAuthService'
import type { IProfileService } from './contracts/IProfileService'

import { SupabaseCourseService } from './supabase/CourseService'
import { SupabaseLessonService } from './supabase/LessonService'
import { SupabaseCategoryService } from './supabase/CategoryService'
import { SupabaseStorageService } from './supabase/StorageService'
import { SupabaseAuthService } from './supabase/AuthService'
import { SupabaseProfileService } from './supabase/ProfileService'

import {
  MockCourseService,
  MockLessonService,
  MockCategoryService,
  MockStorageService,
  MockAuthService,
  MockProfileService
} from './mock/MockServices'

const forceMock = import.meta.env.VITE_DATA_PROVIDER === 'mock'
const useSupabase = isSupabaseConfigured && !forceMock

export const isLiveBackend = useSupabase

export const courseService: ICourseService = useSupabase
  ? new SupabaseCourseService()
  : new MockCourseService()

export const lessonService: ILessonService = useSupabase
  ? new SupabaseLessonService()
  : new MockLessonService()

export const categoryService: ICategoryService = useSupabase
  ? new SupabaseCategoryService()
  : new MockCategoryService()

export const storageService: IStorageService = useSupabase
  ? new SupabaseStorageService()
  : new MockStorageService()

export const authService: IAuthService = useSupabase
  ? new SupabaseAuthService()
  : new MockAuthService()

export const profileService: IProfileService = useSupabase
  ? new SupabaseProfileService()
  : new MockProfileService()
