<template>
  <RouterLink
    :to="`/courses/${courseSlug}/lessons/${lesson.slug}`"
    class="group relative flex flex-col justify-between rounded-2xl border border-dark-border bg-dark-card p-5 transition-all duration-300 hover:-translate-y-1 hover:border-zinc-700 hover:shadow-lg hover:shadow-emerald-500/5"
  >
    <div>
      <div class="flex items-center justify-between gap-2 text-xs font-mono text-zinc-500 mb-3">
        <span v-if="courseTitle" class="text-emerald-400 font-medium truncate max-w-[200px]">
          {{ courseTitle }}
        </span>
        <span class="flex items-center gap-1 shrink-0">
          <svg class="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
          </svg>
          {{ lesson.reading_time_minutes }} min read
        </span>
      </div>

      <h3 class="text-base font-semibold text-zinc-100 group-hover:text-emerald-400 transition-colors line-clamp-2">
        {{ lesson.title }}
      </h3>

      <p v-if="lesson.description" class="mt-2 text-sm text-zinc-400 line-clamp-2 leading-relaxed">
        {{ lesson.description }}
      </p>
    </div>

    <!-- Tags and Meta -->
    <div class="mt-4 pt-3 border-t border-dark-border/60 flex items-center justify-between">
      <div class="flex flex-wrap gap-1.5">
        <span
          v-for="tag in (lesson.tags || []).slice(0, 2)"
          :key="tag.id"
          class="rounded-md bg-zinc-800/80 px-2 py-0.5 text-[11px] font-mono text-zinc-400"
        >
          #{{ tag.name }}
        </span>
      </div>

      <span class="text-xs font-medium text-emerald-400 flex items-center gap-1 group-hover:translate-x-1 transition-transform">
        Read Lesson →
      </span>
    </div>
  </RouterLink>
</template>

<script setup lang="ts">
import { computed } from 'vue'
import type { Lesson } from '@/types'

const props = defineProps<{
  lesson: Lesson
}>()

const courseSlug = computed(() => props.lesson.course?.slug || 'distributed-systems')
const courseTitle = computed(() => props.lesson.course?.title)
</script>
