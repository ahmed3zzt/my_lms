<template>
  <RouterLink
    :to="`/courses/${course.slug}`"
    class="group relative flex flex-col overflow-hidden rounded-2xl border border-dark-border bg-dark-card transition-all duration-300 hover:-translate-y-1 hover:border-zinc-700 hover:shadow-xl hover:shadow-emerald-500/5"
  >
    <!-- Cover Image -->
    <div class="aspect-[16/9] w-full overflow-hidden bg-zinc-900 relative">
      <img
        v-if="course.cover_image_url"
        :src="course.cover_image_url"
        :alt="course.title"
        class="h-full w-full object-cover transition-transform duration-500 group-hover:scale-105"
        loading="lazy"
      />
      <div v-else class="flex h-full w-full items-center justify-center bg-zinc-900 text-zinc-600">
        <svg class="h-10 w-10" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="1.5" d="M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 012-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10" />
        </svg>
      </div>

      <!-- Badge for Category -->
      <span
        v-if="course.category"
        class="absolute top-3 left-3 rounded-lg bg-black/60 backdrop-blur-md px-2.5 py-1 text-[11px] font-medium text-emerald-400 border border-white/10"
      >
        {{ course.category.name }}
      </span>

      <!-- Lesson count badge -->
      <span class="absolute bottom-3 right-3 rounded-lg bg-black/70 backdrop-blur-md px-2.5 py-0.5 text-xs font-mono text-zinc-300 border border-white/10">
        {{ course.lesson_count || 0 }} lessons
      </span>
    </div>

    <!-- Details -->
    <div class="flex flex-1 flex-col justify-between p-5">
      <div>
        <h3 class="font-semibold text-lg text-zinc-100 group-hover:text-emerald-400 transition-colors line-clamp-1">
          {{ course.title }}
        </h3>
        <p v-if="course.description" class="mt-2 text-sm text-zinc-400 line-clamp-2 leading-relaxed">
          {{ course.description }}
        </p>
      </div>

      <div class="mt-4 pt-4 border-t border-dark-border/60 flex items-center justify-between text-xs text-zinc-500 font-mono">
        <span>Curriculum</span>
        <span class="flex items-center gap-1 text-emerald-400 group-hover:translate-x-0.5 transition-transform">
          Explore Track →
        </span>
      </div>
    </div>
  </RouterLink>
</template>

<script setup lang="ts">
import type { Course } from '@/types'

defineProps<{
  course: Course
}>()
</script>
