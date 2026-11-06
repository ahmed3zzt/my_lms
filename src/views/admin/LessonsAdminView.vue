<template>
  <div class="space-y-6">
    <div class="flex items-center justify-between">
      <div>
        <h1 class="text-2xl font-bold text-white tracking-tight">Manage Lessons</h1>
        <p class="text-xs text-zinc-400 mt-1">Full index of published, draft, and upcoming lessons.</p>
      </div>

      <RouterLink
        to="/admin/lessons/new"
        class="rounded-xl bg-emerald-500 px-4 py-2 text-xs font-semibold uppercase tracking-wider text-zinc-950 hover:bg-emerald-400 transition-colors"
      >
        + Compose Lesson
      </RouterLink>
    </div>

    <!-- Filter Bar -->
    <div class="flex flex-wrap items-center gap-4">
      <input
        v-model="searchQuery"
        type="text"
        placeholder="Filter by title..."
        class="rounded-xl border border-dark-border bg-dark-card px-4 py-2 text-xs text-zinc-200 placeholder-zinc-500 focus:outline-none focus:border-emerald-500"
      />

      <select
        v-model="selectedCourseId"
        class="rounded-xl border border-dark-border bg-dark-card px-4 py-2 text-xs text-zinc-200 focus:outline-none focus:border-emerald-500"
      >
        <option value="">All Courses</option>
        <option v-for="c in courses" :key="c.id" :value="c.id">{{ c.title }}</option>
      </select>
    </div>

    <!-- Table -->
    <div class="rounded-2xl border border-dark-border bg-dark-card overflow-hidden">
      <div class="overflow-x-auto">
        <table class="w-full text-left text-xs">
          <thead class="bg-[#161b22] text-zinc-400 font-mono uppercase text-[10px] border-b border-dark-border">
            <tr>
              <th class="py-3 px-6">Lesson Title</th>
              <th class="py-3 px-6">Course Track</th>
              <th class="py-3 px-6">Status</th>
              <th class="py-3 px-6">Reading Time</th>
              <th class="py-3 px-6 text-right">Actions</th>
            </tr>
          </thead>
          <tbody class="divide-y divide-dark-border/60 text-zinc-300">
            <tr v-for="l in filteredLessons" :key="l.id" class="hover:bg-zinc-800/20">
              <td class="py-4 px-6 font-medium text-white max-w-sm truncate">
                {{ l.title }}
              </td>
              <td class="py-4 px-6 text-zinc-400 font-mono">
                {{ l.course?.title || 'Standalone' }}
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
import { lessonService, courseService } from '@/services'
import type { Lesson, Course } from '@/types'

const lessons = ref<Lesson[]>([])
const courses = ref<Course[]>([])
const searchQuery = ref('')
const selectedCourseId = ref('')

const filteredLessons = computed(() => {
  return lessons.value.filter(l => {
    const matchesSearch = !searchQuery.value || l.title.toLowerCase().includes(searchQuery.value.toLowerCase())
    const matchesCourse = !selectedCourseId.value || l.course_id === selectedCourseId.value
    return matchesSearch && matchesCourse
  })
})

async function loadData() {
  const [l, c] = await Promise.all([
    lessonService.getLessons(),
    courseService.getCourses()
  ])
  lessons.value = l
  courses.value = c
}

async function togglePublish(l: Lesson) {
  const newStatus = !l.is_published
  await lessonService.updateLesson(l.id, { is_published: newStatus })
  l.is_published = newStatus
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
