import { createRouter, createWebHistory, type RouteRecordRaw } from 'vue-router'
import { useAuthStore } from '@/stores/auth'

// Public Views
import HomeView from '@/views/public/HomeView.vue'
import CoursesView from '@/views/public/CoursesView.vue'
import CourseDetailView from '@/views/public/CourseDetailView.vue'
import LessonDetailView from '@/views/public/LessonDetailView.vue'
import CategoriesView from '@/views/public/CategoriesView.vue'
import SearchView from '@/views/public/SearchView.vue'
import AboutView from '@/views/public/AboutView.vue'
import ContactView from '@/views/public/ContactView.vue'
import NotFoundView from '@/views/NotFoundView.vue'

// Admin Views
import LoginView from '@/views/admin/LoginView.vue'
import AdminLayout from '@/views/admin/AdminLayout.vue'
import DashboardView from '@/views/admin/DashboardView.vue'
import CoursesAdminView from '@/views/admin/CoursesAdminView.vue'
import LessonsAdminView from '@/views/admin/LessonsAdminView.vue'
import LessonEditView from '@/views/admin/LessonEditView.vue'
import CategoriesAdminView from '@/views/admin/CategoriesAdminView.vue'

const routes: RouteRecordRaw[] = [
  // Public Routes
  {
    path: '/',
    name: 'home',
    component: HomeView,
    meta: { title: 'Ahmed Ezz | Backend Software Engineer & Educator' }
  },
  {
    path: '/courses',
    name: 'courses',
    component: CoursesView,
    meta: { title: 'Courses & Curriculum Tracks | Ahmed Ezz' }
  },
  {
    path: '/courses/:slug',
    name: 'course-detail',
    component: CourseDetailView,
    meta: { title: 'Course Details | Ahmed Ezz' }
  },
  {
    path: '/courses/:courseSlug/lessons/:lessonSlug',
    name: 'lesson-detail',
    component: LessonDetailView,
    meta: { title: 'Lesson Notes | Ahmed Ezz' }
  },
  {
    path: '/categories',
    name: 'categories',
    component: CategoriesView,
    meta: { title: 'Categories | Ahmed Ezz' }
  },
  {
    path: '/search',
    name: 'search',
    component: SearchView,
    meta: { title: 'Search Lessons | Ahmed Ezz' }
  },
  {
    path: '/about',
    name: 'about',
    component: AboutView,
    meta: { title: 'About Ahmed Ezz | Backend Software Engineer' }
  },
  {
    path: '/contact',
    name: 'contact',
    component: ContactView,
    meta: { title: 'Contact | Ahmed Ezz' }
  },

  // Admin Routes
  {
    path: '/admin/login',
    name: 'admin-login',
    component: LoginView,
    meta: { title: 'Admin Login | Ahmed Ezz' }
  },
  {
    path: '/admin',
    component: AdminLayout,
    meta: { requiresAuth: true },
    children: [
      {
        path: '',
        name: 'admin-dashboard',
        component: DashboardView,
        meta: { title: 'Admin Dashboard | Ahmed Ezz' }
      },
      {
        path: 'courses',
        name: 'admin-courses',
        component: CoursesAdminView,
        meta: { title: 'Manage Courses | Admin' }
      },
      {
        path: 'lessons',
        name: 'admin-lessons',
        component: LessonsAdminView,
        meta: { title: 'Manage Lessons | Admin' }
      },
      {
        path: 'lessons/new',
        name: 'admin-lesson-new',
        component: LessonEditView,
        meta: { title: 'Compose Lesson | Admin' }
      },
      {
        path: 'lessons/:id/edit',
        name: 'admin-lesson-edit',
        component: LessonEditView,
        meta: { title: 'Edit Lesson | Admin' }
      },
      {
        path: 'categories',
        name: 'admin-categories',
        component: CategoriesAdminView,
        meta: { title: 'Manage Categories & Tags | Admin' }
      }
    ]
  },

  // Fallback 404
  {
    path: '/:pathMatch(.*)*',
    name: 'not-found',
    component: NotFoundView,
    meta: { title: 'Page Not Found | Ahmed Ezz' }
  }
]

export const router = createRouter({
  history: createWebHistory(),
  routes,
  scrollBehavior(to, _from, savedPosition) {
    if (savedPosition) return savedPosition
    if (to.hash) {
      return { el: to.hash, behavior: 'smooth' }
    }
    return { top: 0, behavior: 'smooth' }
  }
})

// Navigation Guard for Admin Routes
router.beforeEach(async (to, _from, next) => {
  const authStore = useAuthStore()

  // Set document title
  if (to.meta.title) {
    document.title = String(to.meta.title)
  }

  if (to.matched.some(record => record.meta.requiresAuth)) {
    if (authStore.isLoading) {
      await authStore.init()
    }
    if (!authStore.user) {
      next({ name: 'admin-login' })
      return
    }
  }

  next()
})
