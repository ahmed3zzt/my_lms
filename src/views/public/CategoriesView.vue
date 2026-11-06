<template>
  <div class="mx-auto max-w-7xl px-4 py-12 sm:px-6 lg:px-8">
    <div class="max-w-2xl mb-12">
      <span class="text-xs font-mono uppercase tracking-wider text-emerald-400">Knowledge Domains</span>
      <h1 class="text-3xl sm:text-4xl font-extrabold tracking-tight text-white mt-1">
        Explore by Category
      </h1>
      <p class="mt-3 text-base text-zinc-400">
        Filter through specific architectural themes, infrastructure topics, database internals, and systems programming.
      </p>
    </div>

    <div v-if="isLoading" class="grid grid-cols-1 md:grid-cols-2 gap-6">
      <div v-for="i in 4" :key="i" class="h-44 rounded-2xl bg-zinc-900/50 animate-pulse border border-dark-border"></div>
    </div>

    <div v-else class="grid grid-cols-1 md:grid-cols-2 gap-6">
      <div
        v-for="cat in categories"
        :key="cat.id"
        class="rounded-2xl border border-dark-border bg-dark-card p-6 flex flex-col justify-between hover:border-zinc-700 transition-colors"
      >
        <div>
          <div class="flex items-center justify-between mb-4">
            <span class="flex h-10 w-10 items-center justify-center rounded-xl bg-emerald-500/10 text-emerald-400 border border-emerald-500/20">
              <svg class="h-5 w-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M3 7v10a2 2 0 002 2h14a2 2 0 002-2V9a2 2 0 00-2-2h-6l-2-2H5a2 2 0 00-2 2z" />
              </svg>
            </span>
            <span class="rounded bg-zinc-800 px-2.5 py-1 text-xs font-mono text-zinc-400">
              {{ cat.course_count || 1 }} Tracks
            </span>
          </div>

          <h2 class="text-lg font-bold text-white mb-2">
            {{ cat.name }}
          </h2>
          <p class="text-sm text-zinc-400 leading-relaxed">
            {{ cat.description }}
          </p>
        </div>

        <div class="mt-6 pt-4 border-t border-dark-border/60">
          <RouterLink
            :to="`/courses?category=${cat.slug}`"
            class="text-xs font-semibold text-emerald-400 hover:text-emerald-300 flex items-center gap-1 group"
          >
            <span>Explore {{ cat.name }} Tracks</span>
            <span class="group-hover:translate-x-1 transition-transform">→</span>
          </RouterLink>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted } from 'vue'
import { categoryService } from '@/services'
import type { Category } from '@/types'

const isLoading = ref(true)
const categories = ref<Category[]>([])

onMounted(async () => {
  try {
    categories.value = await categoryService.getCategories()
  } catch (err) {
    console.error('Failed to load categories:', err)
  } finally {
    isLoading.value = false
  }
})
</script>
