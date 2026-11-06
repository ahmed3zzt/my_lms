<template>
  <div class="mx-auto max-w-4xl px-4 py-12 sm:px-6 lg:px-8">
    <div class="mb-8">
      <h1 class="text-3xl font-extrabold text-white tracking-tight">Search Lessons & Courses</h1>
      <p class="mt-2 text-sm text-zinc-400">Search through all published backend engineering notes, code examples, and videos.</p>
    </div>

    <!-- Search Bar -->
    <div class="relative">
      <input
        v-model="query"
        type="text"
        placeholder="Type keywords (e.g. Raft, PostgreSQL, Go, Linux, epoll)..."
        class="w-full rounded-2xl border border-dark-border bg-dark-card px-5 py-4 pl-12 text-sm text-zinc-100 placeholder-zinc-500 focus:border-emerald-500 focus:outline-none focus:ring-1 focus:ring-emerald-500"
      />
      <svg class="absolute left-4 top-4.5 h-5 w-5 text-zinc-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
      </svg>
    </div>

    <!-- Results -->
    <div class="mt-8 space-y-4">
      <div v-if="isLoading" class="text-center py-10 text-xs text-zinc-500 font-mono">
        Searching repository...
      </div>

      <div v-else-if="results.length > 0" class="space-y-3">
        <RouterLink
          v-for="item in results"
          :key="item.id"
          :to="item.type === 'lesson' ? `/courses/${item.course_slug}/lessons/${item.slug}` : `/courses/${item.slug}`"
          class="flex items-start gap-4 rounded-xl border border-dark-border bg-dark-card p-4 hover:border-zinc-700 transition-colors group"
        >
          <div class="mt-0.5 rounded-lg p-2" :class="item.type === 'lesson' ? 'bg-emerald-500/10 text-emerald-400' : 'bg-blue-500/10 text-blue-400'">
            <svg v-if="item.type === 'lesson'" class="h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
            </svg>
            <svg v-else class="h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253" />
            </svg>
          </div>
          <div>
            <div class="flex items-center gap-2">
              <h3 class="text-sm font-semibold text-zinc-200 group-hover:text-emerald-400 transition-colors">
                {{ item.title }}
              </h3>
              <span class="rounded bg-zinc-800 px-2 py-0.5 text-[10px] font-mono text-zinc-400 uppercase">
                {{ item.type }}
              </span>
            </div>
            <p v-if="item.description" class="text-xs text-zinc-400 mt-1 line-clamp-2">
              {{ item.description }}
            </p>
          </div>
        </RouterLink>
      </div>

      <div v-else-if="query.trim()" class="text-center py-12 rounded-xl border border-dark-border bg-dark-card/30">
        <p class="text-sm text-zinc-400">No results found for "{{ query }}".</p>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, watch } from 'vue'
import { lessonService } from '@/services'
import type { SearchResult } from '@/types'

const query = ref('')
const results = ref<SearchResult[]>([])
const isLoading = ref(false)

let debounceTimer: any = null

watch(query, (val) => {
  clearTimeout(debounceTimer)
  if (!val.trim()) {
    results.value = []
    return
  }
  isLoading.value = true
  debounceTimer = setTimeout(async () => {
    try {
      results.value = await lessonService.searchLessons(val)
    } finally {
      isLoading.value = false
    }
  }, 250)
})
</script>
