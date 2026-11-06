<template>
  <div class="relative overflow-hidden">
    <!-- Glow Background Gradients -->
    <div class="absolute -top-40 left-1/2 -z-10 -translate-x-1/2 transform-gpu blur-3xl sm:-top-80" aria-hidden="true">
      <div class="aspect-[1155/678] w-[68.4375rem] bg-gradient-to-tr from-emerald-500/20 to-teal-400/10 opacity-30"></div>
    </div>

    <!-- 1. Hero Section -->
    <section class="mx-auto max-w-7xl px-4 pt-16 pb-20 sm:px-6 lg:px-8 text-center md:text-left">
      <div class="grid grid-cols-1 md:grid-cols-12 gap-12 items-center">
        <div class="md:col-span-8 space-y-6">
          <div class="inline-flex items-center gap-2 rounded-full border border-emerald-500/30 bg-emerald-500/10 px-3 py-1 text-xs font-mono text-emerald-400">
            <span class="inline-block w-2 h-2 rounded-full bg-emerald-400 animate-pulse"></span>
            {{ siteData.site.hero.badge }}
          </div>

          <h1 class="text-4xl sm:text-5xl lg:text-6xl font-extrabold tracking-tight text-white leading-[1.1]">
            {{ siteData.site.hero.heading }} <span class="bg-gradient-to-r from-emerald-400 to-teal-300 bg-clip-text text-transparent">{{ siteData.site.hero.headingHighlight }}</span>
          </h1>

          <p class="max-w-2xl text-base sm:text-lg text-zinc-400 leading-relaxed">
            {{ siteData.site.hero.description }}
          </p>

          <div class="flex flex-wrap items-center justify-center md:justify-start gap-4 pt-2">
            <RouterLink
              to="/courses"
              class="inline-flex items-center gap-2 rounded-xl bg-emerald-500 px-5 py-3 text-sm font-semibold text-zinc-950 hover:bg-emerald-400 transition-colors shadow-lg shadow-emerald-500/20"
            >
              <span>Explore Courses</span>
              <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M14 5l7 7m0 0l-7 7m7-7H3" />
              </svg>
            </RouterLink>

            <a
              :href="siteData.profile.links.youtube"
              target="_blank"
              rel="noopener noreferrer"
              class="inline-flex items-center gap-2 rounded-xl border border-dark-border bg-dark-card px-5 py-3 text-sm font-medium text-zinc-300 hover:border-zinc-700 hover:text-white transition-colors"
            >
              <svg class="w-4 h-4 text-red-500" fill="currentColor" viewBox="0 0 24 24">
                <path d="M23.498 6.186a3.016 3.016 0 0 0-2.122-2.136C19.505 3.545 12 3.545 12 3.545s-7.505 0-9.377.505A3.017 3.017 0 0 0 .502 6.186C0 8.07 0 12 0 12s0 3.93.502 5.814a3.016 3.016 0 0 0 2.122 2.136c1.871.505 9.376.505 9.376.505s7.505 0 9.377-.505a3.015 3.015 0 0 0 2.122-2.136C24 15.93 24 12 24 12s0-3.93-.502-5.814zM9.545 15.568V8.432L15.818 12l-6.273 3.568z"/>
              </svg>
              <span>Watch on YouTube</span>
            </a>
          </div>
        </div>

        <!-- Terminal Card Preview -->
        <div class="md:col-span-4">
          <div class="rounded-2xl border border-dark-border bg-dark-card/90 shadow-2xl p-5 text-left font-mono text-xs">
            <div class="flex items-center justify-between pb-3 border-b border-dark-border/80 text-zinc-500">
              <div class="flex items-center gap-2">
                <span class="w-3 h-3 rounded-full bg-red-500/80 inline-block"></span>
                <span class="w-3 h-3 rounded-full bg-yellow-500/80 inline-block"></span>
                <span class="w-3 h-3 rounded-full bg-green-500/80 inline-block"></span>
              </div>
              <span>bash - {{ siteData.site.terminal.user }}</span>
            </div>
            <div class="mt-4 space-y-2 text-zinc-300">
              <p><span class="text-emerald-400">$</span> whoami</p>
              <p class="text-zinc-400">{{ siteData.site.terminal.whoami }}</p>
              <p><span class="text-emerald-400">$</span> cat interests.txt</p>
              <p class="text-zinc-400">
                <span v-for="(interest, idx) in siteData.site.terminal.interests" :key="idx" class="block">
                  • {{ interest }}
                </span>
              </p>
              <p class="pt-2"><span class="text-emerald-400">$</span> ./start_learning.sh</p>
              <p class="text-emerald-400 flex items-center gap-2">
                <span class="inline-block w-2 h-2 bg-emerald-400 rounded-full animate-ping"></span>
                {{ siteData.site.terminal.status }}
              </p>
            </div>
          </div>
        </div>
      </div>
    </section>

    <!-- 2. Latest Lessons -->
    <section class="border-t border-dark-border bg-dark-card/30 py-16">
      <div class="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div class="flex flex-col sm:flex-row items-start sm:items-end justify-between gap-4 mb-10">
          <div>
            <h2 class="text-2xl font-bold tracking-tight text-white">Latest Lesson Notes</h2>
            <p class="text-sm text-zinc-400 mt-1">Direct companion code, notes, and diagrams from recent YouTube episodes.</p>
          </div>
          <RouterLink to="/courses" class="text-xs font-mono text-emerald-400 hover:underline">
            View All Courses & Lessons →
          </RouterLink>
        </div>

        <div v-if="isLoading" class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          <div v-for="i in 3" :key="i" class="h-56 rounded-2xl bg-zinc-900/50 animate-pulse border border-dark-border"></div>
        </div>

        <div v-else class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          <LessonCard
            v-for="lesson in latestLessons"
            :key="lesson.id"
            :lesson="lesson"
          />
        </div>
      </div>
    </section>

    <!-- 3. Featured Courses -->
    <section class="py-16">
      <div class="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div class="mb-10 text-center md:text-left">
          <h2 class="text-2xl font-bold tracking-tight text-white">Structured Learning Tracks</h2>
          <p class="text-sm text-zinc-400 mt-1">End-to-end courses designed to take you from foundational concepts to production-grade architectures.</p>
        </div>

        <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          <CourseCard
            v-for="course in featuredCourses"
            :key="course.id"
            :course="course"
          />
        </div>
      </div>
    </section>

    <!-- 4. Categories Section -->
    <section class="border-t border-dark-border bg-dark-card/20 py-16">
      <div class="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div class="mb-8 flex items-center justify-between">
          <h2 class="text-2xl font-bold tracking-tight text-white">Topics & Domains</h2>
          <RouterLink to="/categories" class="text-xs font-mono text-emerald-400 hover:underline">
            Browse All Categories →
          </RouterLink>
        </div>

        <div class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          <RouterLink
            v-for="cat in categories"
            :key="cat.id"
            :to="`/courses?category=${cat.slug}`"
            class="group rounded-xl border border-dark-border bg-dark-card p-5 hover:border-zinc-700 hover:bg-zinc-800/40 transition-colors"
          >
            <div class="flex items-center justify-between mb-2">
              <span class="text-sm font-semibold text-zinc-200 group-hover:text-emerald-400 transition-colors">
                {{ cat.name }}
              </span>
              <span class="rounded bg-zinc-800 px-2 py-0.5 text-[10px] font-mono text-zinc-400">
                {{ cat.course_count || 1 }} tracks
              </span>
            </div>
            <p class="text-xs text-zinc-400 line-clamp-2 leading-relaxed">
              {{ cat.description }}
            </p>
          </RouterLink>
        </div>
      </div>
    </section>

    <!-- 5. About Preview & Contact Callout -->
    <section class="border-t border-dark-border py-16">
      <div class="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div class="rounded-3xl border border-dark-border bg-gradient-to-b from-[#11131a] to-[#0d1117] p-8 sm:p-12">
          <div class="grid grid-cols-1 md:grid-cols-12 gap-8 items-center">
            <div class="md:col-span-8 space-y-4">
              <span class="text-xs font-mono uppercase tracking-wider text-emerald-400">About {{ siteData.profile.name }}</span>
              <h3 class="text-2xl sm:text-3xl font-bold text-white">
                {{ siteData.profile.shortBio }}
              </h3>
              <p class="text-sm sm:text-base text-zinc-400 leading-relaxed">
                {{ siteData.profile.aboutPreview }}
              </p>
              <div class="pt-2 flex flex-wrap gap-4">
                <RouterLink
                  to="/about"
                  class="inline-flex items-center gap-1.5 text-sm font-semibold text-emerald-400 hover:underline"
                >
                  Read Full Bio & Experience →
                </RouterLink>
                <RouterLink
                  to="/contact"
                  class="inline-flex items-center gap-1.5 text-sm font-semibold text-zinc-400 hover:text-zinc-200"
                >
                  Get In Touch →
                </RouterLink>
              </div>
            </div>

            <div class="md:col-span-4 flex justify-center">
              <div class="relative">
                <img
                  :src="siteData.profile.avatarUrl"
                  :alt="siteData.profile.name"
                  class="h-44 w-44 rounded-full object-cover border-4 border-emerald-500/20 shadow-2xl"
                />
                <span class="absolute bottom-2 right-2 rounded-full bg-emerald-500 p-2 text-zinc-950 shadow-md">
                  <svg class="h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M5 13l4 4L19 7" />
                  </svg>
                </span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted } from 'vue'
import { courseService, lessonService, categoryService } from '@/services'
import type { Course, Lesson, Category } from '@/types'
import CourseCard from '@/components/course/CourseCard.vue'
import LessonCard from '@/components/lesson/LessonCard.vue'
import siteData from '@/data'

const isLoading = ref(true)
const latestLessons = ref<Lesson[]>([])
const featuredCourses = ref<Course[]>([])
const categories = ref<Category[]>([])

onMounted(async () => {
  try {
    const [lessons, courses, cats] = await Promise.all([
      lessonService.getLatestLessons(6),
      courseService.getCourses({ isPublished: true }),
      categoryService.getCategories()
    ])
    latestLessons.value = lessons
    featuredCourses.value = courses
    categories.value = cats
  } catch (err) {
    console.error('Failed to load home page data:', err)
  } finally {
    isLoading.value = false
  }
})
</script>
