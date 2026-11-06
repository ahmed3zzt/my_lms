<template>
  <nav v-if="items.length > 0" class="space-y-3">
    <p class="text-xs font-semibold uppercase tracking-wider text-zinc-400 font-mono">
      On This Page
    </p>
    <ul class="space-y-1.5 text-xs text-zinc-400 border-l border-dark-border">
      <li v-for="item in items" :key="item.id">
        <a
          :href="`#${item.id}`"
          class="block py-1 transition-colors border-l-2 -ml-[2px]"
          :class="[
            item.level === 3 ? 'pl-6' : 'pl-3',
            activeId === item.id
              ? 'border-emerald-400 text-emerald-400 font-medium'
              : 'border-transparent hover:border-zinc-500 hover:text-zinc-200'
          ]"
        >
          {{ item.text }}
        </a>
      </li>
    </ul>
  </nav>
</template>

<script setup lang="ts">
import { ref, onMounted, onUnmounted } from 'vue'
import type { TocItem } from '@/utils/markdown'

defineProps<{
  items: TocItem[]
}>()

const activeId = ref<string>('')
let observer: IntersectionObserver | null = null

onMounted(() => {
  observer = new IntersectionObserver(
    (entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          activeId.value = entry.target.id
        }
      })
    },
    { rootMargin: '-80px 0% -60% 0%' }
  )

  const headings = document.querySelectorAll('h2[id], h3[id]')
  headings.forEach((el) => observer?.observe(el))
})

onUnmounted(() => {
  observer?.disconnect()
})
</script>
