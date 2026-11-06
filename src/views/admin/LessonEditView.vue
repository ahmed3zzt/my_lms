<template>
  <div class="space-y-6">
    <!-- Top Action Bar -->
    <div class="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-dark-border pb-4">
      <div>
        <RouterLink to="/admin/lessons" class="text-xs font-mono text-zinc-500 hover:text-emerald-400">
          ← Back to Lessons List
        </RouterLink>
        <h1 class="text-2xl font-bold text-white tracking-tight mt-1">
          {{ isEditing ? 'Edit Lesson' : 'Compose New Lesson' }}
        </h1>
      </div>

      <div class="flex items-center gap-3">
        <!-- Publish Toggle -->
        <button
          type="button"
          @click="lessonForm.is_published = !lessonForm.is_published"
          class="inline-flex items-center gap-2 rounded-xl px-4 py-2 text-xs font-mono font-medium border transition-colors cursor-pointer"
          :class="lessonForm.is_published
            ? 'bg-emerald-500/10 text-emerald-400 border-emerald-500/30'
            : 'bg-zinc-800 text-zinc-400 border-zinc-700'"
        >
          <span class="w-2 h-2 rounded-full" :class="lessonForm.is_published ? 'bg-emerald-400' : 'bg-zinc-500'"></span>
          <span>{{ lessonForm.is_published ? 'Published' : 'Draft' }}</span>
        </button>

        <button
          type="button"
          @click="saveLesson"
          :disabled="isSaving"
          class="rounded-xl bg-emerald-500 px-6 py-2.5 text-xs font-bold uppercase tracking-wider text-zinc-950 hover:bg-emerald-400 transition-colors shadow-lg shadow-emerald-500/10 disabled:opacity-50"
        >
          {{ isSaving ? 'Saving...' : 'Save Lesson' }}
        </button>
      </div>
    </div>

    <!-- Metadata Grid -->
    <div class="rounded-2xl border border-dark-border bg-dark-card p-6 space-y-4 text-xs">
      <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <div class="md:col-span-2">
          <label class="block font-medium text-zinc-300 mb-1">Lesson Title</label>
          <input
            v-model="lessonForm.title"
            type="text"
            required
            placeholder="e.g. Implementing Raft Leader Election in Go"
            class="w-full rounded-xl border border-dark-border bg-[#090a0f] px-3 py-2 text-sm text-zinc-100 focus:border-emerald-500 focus:outline-none"
            @input="handleTitleChange"
          />
        </div>

        <div>
          <label class="block font-medium text-zinc-300 mb-1">Slug (URL)</label>
          <input
            v-model="lessonForm.slug"
            type="text"
            required
            class="w-full rounded-xl border border-dark-border bg-[#090a0f] px-3 py-2 text-sm font-mono text-zinc-100 focus:border-emerald-500 focus:outline-none"
          />
        </div>

        <div>
          <label class="block font-medium text-zinc-300 mb-1">Course Track</label>
          <select
            v-model="lessonForm.course_id"
            class="w-full rounded-xl border border-dark-border bg-[#090a0f] px-3 py-2 text-sm text-zinc-100 focus:border-emerald-500 focus:outline-none"
          >
            <option v-for="c in courses" :key="c.id" :value="c.id">
              {{ c.title }}
            </option>
          </select>
        </div>
      </div>

      <div class="grid grid-cols-1 md:grid-cols-3 gap-4">
        <div>
          <label class="block font-medium text-zinc-300 mb-1">YouTube Video URL</label>
          <input
            v-model="lessonForm.youtube_url"
            type="text"
            placeholder="https://youtube.com/watch?v=..."
            class="w-full rounded-xl border border-dark-border bg-[#090a0f] px-3 py-2 text-sm text-zinc-100 focus:border-emerald-500 focus:outline-none"
          />
        </div>

        <div>
          <label class="block font-medium text-zinc-300 mb-1">GitHub Repository URL</label>
          <input
            v-model="lessonForm.github_repo_url"
            type="text"
            placeholder="https://github.com/ahmedezz/..."
            class="w-full rounded-xl border border-dark-border bg-[#090a0f] px-3 py-2 text-sm text-zinc-100 focus:border-emerald-500 focus:outline-none"
          />
        </div>

        <div>
          <label class="block font-medium text-zinc-300 mb-1">Estimated Reading Time (minutes)</label>
          <input
            v-model.number="lessonForm.reading_time_minutes"
            type="number"
            class="w-full rounded-xl border border-dark-border bg-[#090a0f] px-3 py-2 text-sm text-zinc-100 focus:border-emerald-500 focus:outline-none"
          />
        </div>
      </div>

      <div>
        <label class="block font-medium text-zinc-300 mb-1">Short Description / Subtitle</label>
        <textarea
          v-model="lessonForm.description"
          rows="2"
          placeholder="Brief summary of the lesson concepts..."
          class="w-full rounded-xl border border-dark-border bg-[#090a0f] px-3 py-2 text-sm text-zinc-100 focus:border-emerald-500 focus:outline-none"
        ></textarea>
      </div>

      <!-- File & Asset Upload Center -->
      <div class="rounded-xl border border-dark-border bg-[#090a0f] p-4 space-y-3">
        <div class="flex items-center justify-between">
          <p class="font-mono text-xs font-semibold text-zinc-300 uppercase">
            Asset & Attachment Storage Manager (Supabase Storage)
          </p>
          <span class="text-[11px] text-zinc-500">Supports Images, PDFs, ZIP files</span>
        </div>

        <div class="flex flex-wrap items-center gap-3">
          <label class="cursor-pointer inline-flex items-center gap-2 rounded-lg bg-zinc-800 px-3 py-2 text-xs font-medium text-zinc-300 hover:bg-zinc-700 hover:text-white transition-colors">
            <svg class="h-4 w-4 text-emerald-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
            </svg>
            <span>Upload Image</span>
            <input type="file" accept="image/*" class="hidden" @change="uploadImage" />
          </label>

          <label class="cursor-pointer inline-flex items-center gap-2 rounded-lg bg-zinc-800 px-3 py-2 text-xs font-medium text-zinc-300 hover:bg-zinc-700 hover:text-white transition-colors">
            <svg class="h-4 w-4 text-blue-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
            </svg>
            <span>Upload PDF / ZIP</span>
            <input type="file" accept=".pdf,.zip,.tar.gz" class="hidden" @change="uploadAttachment" />
          </label>

          <span v-if="uploadStatus" class="text-xs font-mono text-emerald-400">{{ uploadStatus }}</span>
        </div>
      </div>
    </div>

    <!-- Split-Pane Markdown Editor & Live Preview -->
    <div class="rounded-2xl border border-dark-border bg-dark-card overflow-hidden">
      <div class="grid grid-cols-1 lg:grid-cols-2 divide-y lg:divide-y-0 lg:divide-x divide-dark-border">
        <!-- Editor Left -->
        <div class="flex flex-col h-[750px]">
          <div class="px-4 py-2 border-b border-dark-border bg-[#161b22] text-xs font-mono text-zinc-400 flex items-center justify-between">
            <span>Markdown Source</span>
            <span class="text-zinc-500">Supports GFM, Code Blocks, Callouts, Mermaid</span>
          </div>
          <textarea
            v-model="lessonForm.content_markdown"
            class="flex-1 w-full bg-[#090a0f] p-4 text-sm font-mono text-zinc-200 leading-relaxed resize-none focus:outline-none"
            placeholder="Write your markdown lesson notes here..."
            @input="handleMarkdownInput"
          ></textarea>
        </div>

        <!-- Live Preview Right -->
        <div class="flex flex-col h-[750px] overflow-hidden">
          <div class="px-4 py-2 border-b border-dark-border bg-[#161b22] text-xs font-mono text-zinc-400 flex items-center justify-between">
            <span>Live Rendered Documentation Preview</span>
            <span class="text-emerald-400">● Live Sync</span>
          </div>
          <div class="flex-1 p-6 overflow-y-auto bg-dark-card">
            <MarkdownRenderer :content="lessonForm.content_markdown" />
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, computed, onMounted } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import { lessonService, courseService, storageService } from '@/services'
import type { Course } from '@/types'
import { slugify, calculateReadingTime } from '@/utils/markdown'
import MarkdownRenderer from '@/components/markdown/MarkdownRenderer.vue'

const route = useRoute()
const router = useRouter()

const isEditing = computed(() => Boolean(route.params.id))
const courses = ref<Course[]>([])
const isSaving = ref(false)
const uploadStatus = ref('')

const lessonForm = ref({
  title: '',
  slug: '',
  course_id: '',
  description: '',
  content_markdown: '',
  youtube_url: '',
  github_repo_url: '',
  reading_time_minutes: 5,
  is_published: false
})

function handleTitleChange() {
  if (!isEditing.value) {
    lessonForm.value.slug = slugify(lessonForm.value.title)
  }
}

function handleMarkdownInput() {
  lessonForm.value.reading_time_minutes = calculateReadingTime(lessonForm.value.content_markdown)
}

async function uploadImage(e: Event) {
  const file = (e.target as HTMLInputElement).files?.[0]
  if (!file) return
  uploadStatus.value = 'Uploading image...'
  try {
    const filename = `${Date.now()}-${file.name}`
    const url = await storageService.uploadFile('lesson-images', filename, file)
    lessonForm.value.content_markdown += `\n\n![${file.name}](${url})\n`
    uploadStatus.value = 'Image uploaded and inserted!'
    setTimeout(() => { uploadStatus.value = '' }, 3000)
  } catch (err: any) {
    uploadStatus.value = `Error: ${err.message}`
  }
}

async function uploadAttachment(e: Event) {
  const file = (e.target as HTMLInputElement).files?.[0]
  if (!file) return
  uploadStatus.value = 'Uploading attachment...'
  try {
    const filename = `${Date.now()}-${file.name}`
    const url = await storageService.uploadFile('lesson-files', filename, file)
    lessonForm.value.content_markdown += `\n\n[Download ${file.name}](${url})\n`
    uploadStatus.value = 'Attachment uploaded and linked!'
    setTimeout(() => { uploadStatus.value = '' }, 3000)
  } catch (err: any) {
    uploadStatus.value = `Error: ${err.message}`
  }
}

async function saveLesson() {
  if (!lessonForm.value.title.trim()) {
    alert('Please enter a lesson title')
    return
  }
  isSaving.value = true
  try {
    if (isEditing.value) {
      await lessonService.updateLesson(String(route.params.id), lessonForm.value)
    } else {
      await lessonService.createLesson(lessonForm.value)
    }
    router.push('/admin')
  } catch (err: any) {
    alert(`Failed to save: ${err.message}`)
  } finally {
    isSaving.value = false
  }
}

onMounted(async () => {
  const allCourses = await courseService.getCourses()
  courses.value = allCourses
  if (!lessonForm.value.course_id && allCourses.length > 0) {
    lessonForm.value.course_id = allCourses[0].id
  }

  if (isEditing.value) {
    const lessons = await lessonService.getLessons()
    const found = lessons.find(l => l.id === route.params.id)
    if (found) {
      lessonForm.value = {
        title: found.title,
        slug: found.slug,
        course_id: found.course_id,
        description: found.description || '',
        content_markdown: found.content_markdown || '',
        youtube_url: found.youtube_url || '',
        github_repo_url: found.github_repo_url || '',
        reading_time_minutes: found.reading_time_minutes || 5,
        is_published: found.is_published
      }
    }
  }
})
</script>
