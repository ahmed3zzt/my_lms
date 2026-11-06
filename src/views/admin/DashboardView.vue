<template>
  <div class="space-y-8">
    <!-- Stat Cards -->
    <div class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
      <div class="rounded-2xl border border-dark-border bg-dark-card p-5">
        <p class="text-xs font-mono text-zinc-500 uppercase">Total Courses</p>
        <p class="text-2xl font-bold text-white mt-1">{{ courses.length }}</p>
        <p class="text-xs text-zinc-500 mt-1 font-mono">Curriculum Tracks</p>
      </div>

      <div class="rounded-2xl border border-dark-border bg-dark-card p-5">
        <p class="text-xs font-mono text-zinc-500 uppercase">Published Lessons</p>
        <p class="text-2xl font-bold text-emerald-400 mt-1">{{ publishedLessonsCount }}</p>
        <p class="text-xs text-zinc-500 mt-1 font-mono">Live on website</p>
      </div>

      <div class="rounded-2xl border border-dark-border bg-dark-card p-5">
        <p class="text-xs font-mono text-zinc-500 uppercase">Draft Lessons</p>
        <p class="text-2xl font-bold text-amber-400 mt-1">{{ draftLessonsCount }}</p>
        <p class="text-xs text-zinc-500 mt-1 font-mono">Work in progress</p>
      </div>

      <div class="rounded-2xl border border-dark-border bg-dark-card p-5">
        <p class="text-xs font-mono text-zinc-500 uppercase">Hosting Cost</p>
        <p class="text-2xl font-bold text-emerald-400 mt-1">$0.00 / mo</p>
        <p class="text-xs text-zinc-500 mt-1 font-mono">100% Free Tier (Supabase + Pages)</p>
      </div>
    </div>

    <!-- Quick Action Bar -->
    <div class="flex flex-wrap items-center gap-4">
      <RouterLink
        to="/admin/lessons/new"
        class="inline-flex items-center gap-2 rounded-xl bg-emerald-500 px-4 py-2.5 text-xs font-semibold uppercase tracking-wider text-zinc-950 hover:bg-emerald-400 transition-colors shadow-lg shadow-emerald-500/10"
      >
        <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 4v16m8-8H4" />
        </svg>
        <span>Write New Lesson</span>
      </RouterLink>

      <RouterLink
        to="/admin/courses"
        class="inline-flex items-center gap-2 rounded-xl border border-dark-border bg-dark-card px-4 py-2.5 text-xs font-semibold uppercase tracking-wider text-zinc-200 hover:border-zinc-700 transition-colors"
      >
        <span>Create Course Track</span>
      </RouterLink>
    </div>

    <!-- Recent Lessons Table with Quick Publish / Unpublish Toggle -->
    <div class="rounded-2xl border border-dark-border bg-dark-card overflow-hidden">
      <div class="px-6 py-4 border-b border-dark-border flex items-center justify-between">
        <h2 class="text-base font-bold text-white">All Published & Draft Lessons</h2>
        <RouterLink to="/admin/lessons" class="text-xs font-mono text-emerald-400 hover:underline">
          View All Lessons →
        </RouterLink>
      </div>

      <div class="overflow-x-auto">
        <table class="w-full text-left text-xs">
          <thead class="bg-[#161b22] text-zinc-400 font-mono uppercase text-[10px] border-b border-dark-border">
            <tr>
              <th class="py-3 px-6">Title</th>
              <th class="py-3 px-6">Status</th>
              <th class="py-3 px-6">Reading Time</th>
              <th class="py-3 px-6">Course</th>
              <th class="py-3 px-6 text-right">Actions</th>
            </tr>
          </thead>
          <tbody class="divide-y divide-dark-border/60 text-zinc-300">
            <tr v-for="l in lessons" :key="l.id" class="hover:bg-zinc-800/20">
              <td class="py-4 px-6 font-medium text-white max-w-xs truncate">
                {{ l.title }}
              </td>
              <td class="py-4 px-6">
                <button
                  type="button"
                  @click="togglePublish(l)"
                  class="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-[11px] font-mono font-medium transition-colors cursor-pointer"
                  :class="l.is_published
                    ? 'bg-emerald-500/10 text-emerald-400 border border-emerald-500/30'
                    : 'bg-zinc-800 text-zinc-400 border border-zinc-700'"
                >
                  <span class="w-1.5 h-1.5 rounded-full" :class="l.is_published ? 'bg-emerald-400' : 'bg-zinc-500'"></span>
                  <span>{{ l.is_published ? 'Published' : 'Draft' }}</span>
                </button>
              </td>
              <td class="py-4 px-6 font-mono text-zinc-400">
                {{ l.reading_time_minutes }}m
              </td>
              <td class="py-4 px-6 font-mono text-zinc-400">
                {{ l.course?.title || 'Standalone' }}
              </td>
              <td class="py-4 px-6 text-right space-x-2">
                <RouterLink
                  :to="`/admin/lessons/${l.id}/edit`"
                  class="inline-block rounded bg-zinc-800 px-2.5 py-1 text-zinc-300 hover:text-white hover:bg-zinc-700"
                >
                  Edit
                </RouterLink>
                <button
                  type="button"
                  @click="deleteLesson(l.id)"
                  class="rounded bg-red-950/40 text-red-400 border border-red-500/20 px-2.5 py-1 hover:bg-red-900/60"
                >
                  Delete
                </button>
              </td>
            </tr>
          </tbody>
        </table>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, computed, onMounted } from 'vue'
import { courseService, lessonService } from '@/services'
import type { Course, Lesson } from '@/types'

const courses = ref<Course[]>([])
const lessons = ref<Lesson[]>([])
const isLoading = ref(true)

const publishedLessonsCount = computed(() => lessons.value.filter(l => l.is_published).length)
const draftLessonsCount = computed(() => lessons.value.filter(l => !l.is_published).length)

async function loadData() {
  isLoading.value = true
  try {
    const [c, l] = await Promise.all([
      courseService.getCourses(),
      lessonService.getLessons()
    ])
    courses.value = c
    lessons.value = l
  } finally {
    isLoading.value = false
  }
}

async function togglePublish(lesson: Lesson) {
  const newStatus = !lesson.is_published
  await lessonService.updateLesson(lesson.id, { is_published: newStatus })
  lesson.is_published = newStatus
}

async function deleteLesson(id: string) {
  if (!confirm('Are you sure you want to delete this lesson?')) return
  await lessonService.deleteLesson(id)
  lessons.value = lessons.value.filter(l => l.id !== id)
}

onMounted(() => {
  loadData()
})
</script>
