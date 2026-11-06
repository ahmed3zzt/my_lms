<template>
  <div class="mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8">
    <div v-if="isLoading" class="space-y-6 animate-pulse">
      <div class="h-8 w-48 bg-zinc-800 rounded"></div>
      <div class="h-12 w-3/4 bg-zinc-800 rounded"></div>
      <div class="h-96 w-full bg-zinc-900 rounded-2xl"></div>
    </div>

    <div v-else-if="lesson" class="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
      <!-- Left Sidebar: Course Lessons Curriculum -->
      <aside class="lg:col-span-3 order-2 lg:order-1">
        <div class="sticky top-24 rounded-2xl border border-dark-border bg-dark-card p-4 space-y-4">
          <div>
            <RouterLink :to="`/courses/${courseSlug}`" class="text-xs font-mono text-emerald-400 hover:underline flex items-center gap-1 mb-1">
              ← Course Overview
            </RouterLink>
            <h2 class="text-sm font-bold text-zinc-100 line-clamp-2">
              {{ currentCourse?.title }}
            </h2>
          </div>

          <div class="border-t border-dark-border/80 pt-3">
            <p class="text-[11px] font-mono uppercase tracking-wider text-zinc-500 mb-2">
              Course Lessons ({{ courseLessons.length }})
            </p>
            <div class="space-y-1">
              <RouterLink
                v-for="(cls, idx) in courseLessons"
                :key="cls.id"
                :to="`/courses/${courseSlug}/lessons/${cls.slug}`"
                class="flex items-start gap-2.5 rounded-lg px-2.5 py-2 text-xs transition-colors"
                :class="cls.slug === lesson.slug
                  ? 'bg-emerald-500/10 text-emerald-400 font-medium border border-emerald-500/20'
                  : 'text-zinc-400 hover:bg-zinc-800/40 hover:text-zinc-200'"
              >
                <span class="font-mono text-[11px] text-zinc-500 shrink-0">
                  {{ String(idx + 1).padStart(2, '0') }}.
                </span>
                <span class="line-clamp-2">{{ cls.title }}</span>
              </RouterLink>
            </div>
          </div>
        </div>
      </aside>

      <!-- Center: Main Lesson Content -->
      <main class="lg:col-span-6 order-1 lg:order-2 space-y-8 min-w-0">
        <!-- Breadcrumb & Metadata Header -->
        <div>
          <div class="flex flex-wrap items-center gap-2 text-xs font-mono text-zinc-400 mb-2">
            <RouterLink to="/courses" class="hover:text-zinc-200">Courses</RouterLink>
            <span>/</span>
            <RouterLink :to="`/courses/${courseSlug}`" class="text-emerald-400 hover:underline">
              {{ currentCourse?.title }}
            </RouterLink>
          </div>

          <h1 class="text-3xl sm:text-4xl font-extrabold tracking-tight text-white leading-tight">
            {{ lesson.title }}
          </h1>

          <div class="mt-4 flex flex-wrap items-center gap-4 text-xs font-mono text-zinc-400 pb-4 border-b border-dark-border">
            <span class="flex items-center gap-1.5">
              <svg class="h-4 w-4 text-emerald-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
              {{ lesson.reading_time_minutes }} min read
            </span>

            <span v-if="lesson.published_at" class="flex items-center gap-1.5">
              <svg class="h-4 w-4 text-zinc-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
              </svg>
              {{ new Date(lesson.published_at).toLocaleDateString() }}
            </span>

            <!-- Tags -->
            <div class="flex items-center gap-1.5 ml-auto">
              <span
                v-for="tag in lesson.tags || []"
                :key="tag.id"
                class="rounded bg-zinc-800 px-2 py-0.5 text-[10px] text-zinc-300"
              >
                #{{ tag.name }}
              </span>
            </div>
          </div>
        </div>

        <!-- YouTube Video Lesson Embed (if present) -->
        <div v-if="youtubeEmbedUrl" class="overflow-hidden rounded-2xl border border-dark-border bg-black shadow-2xl">
          <div class="aspect-video w-full">
            <iframe
              :src="youtubeEmbedUrl"
              title="YouTube video player"
              frameborder="0"
              allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
              allowfullscreen
              class="h-full w-full"
            ></iframe>
          </div>
        </div>

        <!-- Action Links: GitHub Repo + Video -->
        <div v-if="lesson.github_repo_url || lesson.youtube_url" class="flex flex-wrap items-center gap-3">
          <a
            v-if="lesson.github_repo_url"
            :href="lesson.github_repo_url"
            target="_blank"
            rel="noopener noreferrer"
            class="inline-flex items-center gap-2 rounded-xl border border-dark-border bg-dark-card px-4 py-2.5 text-xs font-medium text-zinc-200 hover:border-zinc-700 hover:text-white transition-colors"
          >
            <svg class="h-4 w-4 text-emerald-400" fill="currentColor" viewBox="0 0 24 24">
              <path fill-rule="evenodd" clip-rule="evenodd" d="M12 2C6.477 2 2 6.484 2 12.017c0 4.425 2.865 8.18 6.839 9.504.5.092.682-.217.682-.483 0-.237-.008-.868-.013-1.703-2.782.605-3.369-1.343-3.369-1.343-.454-1.158-1.11-1.466-1.11-1.466-.908-.62.069-.608.069-.608 1.003.07 1.53 1.032 1.53 1.032.892 1.53 2.341 1.088 2.91.832.092-.647.35-1.088.636-1.338-2.22-.253-4.555-1.113-4.555-4.951 0-1.093.39-1.988 1.029-2.688-.103-.253-.446-1.272.098-2.65 0 0 .84-.27 2.75 1.026A9.564 9.564 0 0112 6.844c.85.004 1.705.115 2.504.337 1.909-1.296 2.747-1.027 2.747-1.027.546 1.379.202 2.398.1 2.651.64.7 1.028 1.595 1.028 2.688 0 3.848-2.339 4.695-4.566 4.943.359.309.678.92.678 1.855 0 1.338-.012 2.419-.012 2.747 0 .268.18.58.688.482A10.019 10.019 0 0022 12.017C22 6.484 17.522 2 12 2z" />
            </svg>
            <span>GitHub Repository</span>
          </a>

          <a
            v-if="lesson.youtube_url"
            :href="lesson.youtube_url"
            target="_blank"
            rel="noopener noreferrer"
            class="inline-flex items-center gap-2 rounded-xl border border-dark-border bg-dark-card px-4 py-2.5 text-xs font-medium text-zinc-200 hover:border-zinc-700 hover:text-white transition-colors"
          >
            <svg class="h-4 w-4 text-red-500" fill="currentColor" viewBox="0 0 24 24">
              <path d="M23.498 6.186a3.016 3.016 0 0 0-2.122-2.136C19.505 3.545 12 3.545 12 3.545s-7.505 0-9.377.505A3.017 3.017 0 0 0 .502 6.186C0 8.07 0 12 0 12s0 3.93.502 5.814a3.016 3.016 0 0 0 2.122 2.136c1.871.505 9.376.505 9.376.505s7.505 0 9.377-.505a3.015 3.015 0 0 0 2.122-2.136C24 15.93 24 12 24 12s0-3.93-.502-5.814zM9.545 15.568V8.432L15.818 12l-6.273 3.568z"/>
            </svg>
            <span>Watch on YouTube</span>
          </a>
        </div>

        <!-- Markdown Lesson Body -->
        <MarkdownRenderer :content="lesson.content_markdown" />

        <!-- Downloadable Attachments -->
        <AttachmentList :attachments="lesson.attachments" />

        <!-- Prev / Next Lesson Navigation Footer -->
        <div class="border-t border-dark-border pt-6 grid grid-cols-1 sm:grid-cols-2 gap-4">
          <RouterLink
            v-if="lesson.prev_lesson"
            :to="`/courses/${courseSlug}/lessons/${lesson.prev_lesson.slug}`"
            class="rounded-xl border border-dark-border bg-dark-card p-4 hover:border-zinc-700 transition-colors group text-left"
          >
            <span class="text-[11px] font-mono text-zinc-500 flex items-center gap-1 mb-1">
              ← Previous Lesson
            </span>
            <span class="text-sm font-medium text-zinc-200 group-hover:text-emerald-400 transition-colors line-clamp-1">
              {{ lesson.prev_lesson.title }}
            </span>
          </RouterLink>
          <div v-else></div>

          <RouterLink
            v-if="lesson.next_lesson"
            :to="`/courses/${courseSlug}/lessons/${lesson.next_lesson.slug}`"
            class="rounded-xl border border-dark-border bg-dark-card p-4 hover:border-zinc-700 transition-colors group text-right"
          >
            <span class="text-[11px] font-mono text-zinc-500 flex items-center justify-end gap-1 mb-1">
              Next Lesson →
            </span>
            <span class="text-sm font-medium text-zinc-200 group-hover:text-emerald-400 transition-colors line-clamp-1">
              {{ lesson.next_lesson.title }}
            </span>
          </RouterLink>
        </div>
      </main>

      <!-- Right Column: Sticky Table of Contents -->
      <aside class="hidden lg:block lg:col-span-3 order-3">
        <div class="sticky top-24 rounded-2xl border border-dark-border bg-dark-card p-4">
          <TableOfContents :items="tocItems" />
        </div>
      </aside>
    </div>

    <!-- 404 fallback -->
    <div v-else class="text-center py-20">
      <h2 class="text-2xl font-bold text-white">Lesson Not Found</h2>
      <p class="text-zinc-400 mt-2 text-sm">The requested lesson notes could not be found or have been moved.</p>
      <RouterLink to="/courses" class="mt-6 inline-block rounded-xl bg-emerald-500 px-4 py-2 text-xs font-semibold text-zinc-950">
        Back to Courses
      </RouterLink>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, computed, watch, onMounted } from 'vue'
import { useRoute } from 'vue-router'
import { lessonService, courseService } from '@/services'
import type { Lesson, Course } from '@/types'
import { extractToc, type TocItem } from '@/utils/markdown'
import MarkdownRenderer from '@/components/markdown/MarkdownRenderer.vue'
import AttachmentList from '@/components/lesson/AttachmentList.vue'
import TableOfContents from '@/components/lesson/TableOfContents.vue'

const route = useRoute()
const isLoading = ref(true)
const lesson = ref<Lesson | null>(null)
const currentCourse = ref<Course | null>(null)
const courseLessons = ref<Lesson[]>([])
const tocItems = ref<TocItem[]>([])

const courseSlug = computed(() => String(route.params.courseSlug || ''))
const lessonSlug = computed(() => String(route.params.lessonSlug || ''))

const youtubeEmbedUrl = computed(() => {
  if (!lesson.value?.youtube_url) return ''
  const url = lesson.value.youtube_url
  const regExp = /^.*(youtu.be\/|v\/|u\/\w\/|embed\/|watch\?v=|\&v=)([^#\&\?]*).*/
  const match = url.match(regExp)
  return (match && match[2].length === 11)
    ? `https://www.youtube.com/embed/${match[2]}`
    : ''
})

async function fetchLessonData() {
  isLoading.value = true
  try {
    const [les, crs, allLessons] = await Promise.all([
      lessonService.getLessonBySlug(courseSlug.value, lessonSlug.value),
      courseService.getCourseBySlug(courseSlug.value),
      lessonService.getLessons({ courseSlug: courseSlug.value, isPublished: true })
    ])
    lesson.value = les
    currentCourse.value = crs
    courseLessons.value = allLessons
    if (les?.content_markdown) {
      tocItems.value = extractToc(les.content_markdown)
    }
  } catch (err) {
    console.error('Failed to load lesson:', err)
  } finally {
    isLoading.value = false
  }
}

onMounted(() => {
  fetchLessonData()
})

watch(() => [route.params.courseSlug, route.params.lessonSlug], () => {
  if (route.params.lessonSlug) {
    fetchLessonData()
    window.scrollTo({ top: 0, behavior: 'smooth' })
  }
})
</script>
