<template>
  <div v-if="attachments && attachments.length > 0" class="rounded-2xl border border-dark-border bg-dark-card p-5">
    <div class="flex items-center gap-2 mb-3">
      <svg class="h-4 w-4 text-emerald-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4" />
      </svg>
      <h3 class="text-sm font-semibold uppercase tracking-wider text-zinc-300 font-mono">
        Lesson Attachments & Downloads
      </h3>
    </div>

    <div class="space-y-2">
      <a
        v-for="file in attachments"
        :key="file.id"
        :href="file.file_url"
        target="_blank"
        download
        class="flex items-center justify-between rounded-xl border border-dark-border/80 bg-zinc-900/60 px-4 py-3 text-sm text-zinc-300 hover:border-emerald-500/40 hover:bg-zinc-800/60 transition-colors group"
      >
        <div class="flex items-center gap-3">
          <!-- File Type Icon -->
          <span class="rounded-lg p-2 bg-zinc-800 text-zinc-400 group-hover:text-emerald-400 transition-colors">
            <svg v-if="file.title.endsWith('.pdf')" class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M7 21h10a2 2 0 002-2V9.414a1 1 0 00-.293-.707l-5.414-5.414A1 1 0 0012.586 3H7a2 2 0 00-2 2v14a2 2 0 002 2z" />
            </svg>
            <svg v-else-if="file.title.endsWith('.zip') || file.title.endsWith('.tar.gz')" class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M5 8h14M5 8a2 2 0 110-4h14a2 2 0 110 4M5 8v10a2 2 0 002 2h10a2 2 0 002-2V8m-9 4h4" />
            </svg>
            <svg v-else class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
            </svg>
          </span>
          <div>
            <p class="font-medium text-zinc-200 group-hover:text-emerald-400 transition-colors">
              {{ file.title }}
            </p>
            <p class="text-xs text-zinc-500 font-mono">
              {{ formatSize(file.file_size) }}
            </p>
          </div>
        </div>

        <span class="inline-flex items-center gap-1.5 rounded-lg border border-dark-border bg-zinc-800 px-3 py-1 text-xs text-zinc-300 group-hover:border-emerald-500/50 group-hover:text-emerald-400 transition-colors">
          <span>Download</span>
          <svg class="h-3.5 w-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4" />
          </svg>
        </span>
      </a>
    </div>
  </div>
</template>

<script setup lang="ts">
import type { Attachment } from '@/types'

defineProps<{
  attachments?: Attachment[]
}>()

function formatSize(bytes: number): string {
  if (!bytes || bytes <= 0) return 'File'
  const units = ['B', 'KB', 'MB', 'GB']
  let size = bytes
  let unitIndex = 0
  while (size >= 1024 && unitIndex < units.length - 1) {
    size /= 1024
    unitIndex++
  }
  return `${size.toFixed(1)} ${units[unitIndex]}`
}
</script>
