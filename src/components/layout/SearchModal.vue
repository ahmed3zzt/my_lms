<template>
  <div v-if="isOpen" class="fixed inset-0 z-50 overflow-y-auto p-4 sm:p-6 md:p-20">
    <!-- Backdrop -->
    <div class="fixed inset-0 bg-black/70 backdrop-blur-sm transition-opacity" @click="$emit('close')"></div>

    <!-- Modal Box -->
    <div class="relative mx-auto max-w-xl rounded-2xl border border-dark-border bg-[#0d1117] shadow-2xl overflow-hidden">
      <!-- Search Input -->
      <div class="flex items-center px-4 border-b border-dark-border">
        <svg class="h-5 w-5 text-zinc-400 mr-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
        </svg>
        <input
          ref="searchInputRef"
          v-model="query"
          type="text"
          placeholder="Search lessons, topics, or code..."
          class="w-full bg-transparent py-4 text-sm text-zinc-100 placeholder-zinc-500 focus:outline-none"
          @keydown.esc="$emit('close')"
        />
        <button
          type="button"
          @click="$emit('close')"
          class="text-xs text-zinc-500 hover:text-zinc-300 px-2 py-1 rounded bg-zinc-800"
        >
          ESC
        </button>
      </div>

      <!-- Results list -->
      <div class="max-h-96 overflow-y-auto p-2">
        <div v-if="isLoading" class="p-4 text-center text-xs text-zinc-500">
          Searching...
        </div>

        <div v-else-if="results.length > 0" class="space-y-1">
          <button
            v-for="item in results"
            :key="item.id"
            @click="navigateTo(item)"
            class="w-full flex items-start gap-3 rounded-xl p-3 text-left hover:bg-zinc-800/60 transition-colors group cursor-pointer"
          >
            <div class="mt-0.5 rounded-lg p-1.5" :class="item.type === 'lesson' ? 'bg-emerald-500/10 text-emerald-400' : 'bg-blue-500/10 text-blue-400'">
              <svg v-if="item.type === 'lesson'" class="h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
              </svg>
              <svg v-else class="h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253" />
              </svg>
            </div>
            <div>
              <div class="flex items-center gap-2">
                <span class="text-sm font-medium text-zinc-200 group-hover:text-emerald-400 transition-colors">
                  {{ item.title }}
                </span>
                <span class="text-[10px] uppercase font-mono px-1.5 py-0.5 rounded bg-zinc-800 text-zinc-400">
                  {{ item.type }}
                </span>
              </div>
              <p v-if="item.description" class="text-xs text-zinc-500 line-clamp-1 mt-0.5">
                {{ item.description }}
              </p>
            </div>
          </button>
        </div>

        <div v-else-if="query.trim()" class="p-8 text-center text-sm text-zinc-500">
          No lessons or courses found matching "{{ query }}"
        </div>

        <div v-else class="p-6 text-center text-xs text-zinc-500">
          Type keywords like "Raft", "Postgres", "Linux", or "Go" to find lessons.
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, watch, nextTick } from 'vue'
import { useRouter } from 'vue-router'
import { lessonService } from '@/services'
import type { SearchResult } from '@/types'

const props = defineProps<{
  isOpen: boolean
}>()

const emit = defineEmits<{
  (e: 'close'): void
}>()

const router = useRouter()
const query = ref('')
const results = ref<SearchResult[]>([])
const isLoading = ref(false)
const searchInputRef = ref<HTMLInputElement | null>(null)

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

watch(() => props.isOpen, (open) => {
  if (open) {
    nextTick(() => {
      searchInputRef.value?.focus()
    })
  } else {
    query.value = ''
    results.value = []
  }
})

function navigateTo(item: SearchResult) {
  emit('close')
  if (item.type === 'lesson' && item.course_slug) {
    router.push(`/courses/${item.course_slug}/lessons/${item.slug}`)
  } else if (item.type === 'course') {
    router.push(`/courses/${item.slug}`)
  }
}
</script>
