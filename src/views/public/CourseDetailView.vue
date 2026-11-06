<template>
  <div class="mx-auto max-w-7xl px-4 py-12 sm:px-6 lg:px-8">
    <div v-if="isLoading" class="space-y-6 animate-pulse">
      <div class="h-8 w-40 bg-zinc-800 rounded"></div>
      <div class="h-12 w-2/3 bg-zinc-800 rounded"></div>
      <div class="h-64 bg-zinc-900 rounded-2xl"></div>
    </div>

    <div v-else-if="course" class="space-y-12">
      <!-- Course Banner Header -->
      <div class="grid grid-cols-1 lg:grid-cols-12 gap-8 items-center rounded-3xl border border-dark-border bg-dark-card p-6 sm:p-10">
        <div class="lg:col-span-8 space-y-4">
          <div class="flex items-center gap-2">
            <RouterLink to="/courses" class="text-xs font-mono text-zinc-400 hover:text-zinc-200">
              Courses
            </RouterLink>
            <span class="text-xs text-zinc-600">/</span>
            <span v-if="course.category" class="rounded bg-emerald-500/10 border border-emerald-500/20 px-2 py-0.5 text-xs font-mono text-emerald-400">
              {{ course.category.name }}
            </span>
          </div>

          <h1 class="text-3xl sm:text-4xl font-extrabold text-white tracking-tight">
            {{ course.title }}
          </h1>

          <p class="text-base text-zinc-400 leading-relaxed max-w-2xl">
            {{ course.description }}
          </p>

          <div class="pt-2 flex items-center gap-6 text-xs font-mono text-zinc-500">
            <span class="flex items-center gap-1.5 text-zinc-300">
              <svg class="w-4 h-4 text-emerald-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 012-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10" />
              </svg>
              {{ lessons.length }} Lessons Available
            </span>
            <span>Free Access</span>
          </div>
        </div>

        <div class="lg:col-span-4 overflow-hidden rounded-2xl border border-dark-border aspect-video bg-zinc-900">
          <img
            v-if="course.cover_image_url"
            :src="course.cover_image_url"
            :alt="course.title"
            class="h-full w-full object-cover"
          />
        </div>
      </div>

      <!-- Curriculum Lessons List -->
      <div>
        <div class="flex items-center justify-between mb-6">
          <h2 class="text-xl font-bold text-white">Course Curriculum</h2>
          <span class="text-xs font-mono text-zinc-500">{{ lessons.length }} Lessons</span>
        </div>

        <div v-if="lessons.length > 0" class="space-y-3">
          <RouterLink
            v-for="(lesson, idx) in lessons"
            :key="lesson.id"
            :to="`/courses/${course.slug}/lessons/${lesson.slug}`"
            class="group flex flex-col sm:flex-row sm:items-center justify-between gap-4 rounded-xl border border-dark-border bg-dark-card p-5 hover:border-zinc-700 hover:bg-zinc-800/40 transition-colors"
          >
            <div class="flex items-start sm:items-center gap-4">
              <span class="flex h-8 w-8 items-center justify-center rounded-lg bg-zinc-800 text-xs font-mono text-zinc-400 group-hover:bg-emerald-500/20 group-hover:text-emerald-400 transition-colors shrink-0">
                {{ String(idx + 1).padStart(2, '0') }}
              </span>
              <div>
                <h3 class="text-sm sm:text-base font-semibold text-zinc-200 group-hover:text-emerald-400 transition-colors">
                  {{ lesson.title }}
                </h3>
                <p v-if="lesson.description" class="text-xs text-zinc-400 line-clamp-1 mt-0.5">
                  {{ lesson.description }}
                </p>
              </div>
            </div>

            <div class="flex items-center gap-4 text-xs font-mono text-zinc-500 shrink-0 self-end sm:self-center">
              <span class="flex items-center gap-1">
                <svg class="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
                {{ lesson.reading_time_minutes }}m
              </span>
              <span class="text-emerald-400 group-hover:translate-x-1 transition-transform">
                Read Notes →
              </span>
            </div>
          </RouterLink>
        </div>

        <div v-else class="text-center py-12 rounded-2xl border border-dark-border bg-dark-card/30">
          <p class="text-sm text-zinc-500">No lessons published yet in this course.</p>
        </div>
      </div>
    </div>

    <div v-else class="text-center py-20">
      <h2 class="text-2xl font-bold text-white">Course Not Found</h2>
      <RouterLink to="/courses" class="mt-4 inline-block text-xs font-mono text-emerald-400 hover:underline">
        ← Back to all courses
      </RouterLink>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted } from 'vue'
import { useRoute } from 'vue-router'
import { courseService, lessonService } from '@/services'
import type { Course, Lesson } from '@/types'

const route = useRoute()
const isLoading = ref(true)
const course = ref<Course | null>(null)
const lessons = ref<Lesson[]>([])

onMounted(async () => {
  const slug = String(route.params.slug || '')
  try {
    const [cData, lData] = await Promise.all([
      courseService.getCourseBySlug(slug),
      lessonService.getLessons({ courseSlug: slug, isPublished: true })
    ])
    course.value = cData
    lessons.value = lData
  } catch (err) {
    console.error('Error fetching course detail:', err)
  } finally {
    isLoading.value = false
  }
})
</script>
