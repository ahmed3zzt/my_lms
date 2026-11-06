<template>
  <div class="space-y-8">
    <div class="flex items-center justify-between">
      <div>
        <h1 class="text-2xl font-bold text-white tracking-tight">Manage Courses</h1>
        <p class="text-xs text-zinc-400 mt-1">Add, update, or remove curriculum series.</p>
      </div>
      <button
        type="button"
        @click="openModal()"
        class="rounded-xl bg-emerald-500 px-4 py-2 text-xs font-semibold uppercase tracking-wider text-zinc-950 hover:bg-emerald-400 transition-colors"
      >
        + New Course
      </button>
    </div>

    <!-- Course List Table -->
    <div class="rounded-2xl border border-dark-border bg-dark-card overflow-hidden">
      <div class="overflow-x-auto">
        <table class="w-full text-left text-xs">
          <thead class="bg-[#161b22] text-zinc-400 font-mono uppercase text-[10px] border-b border-dark-border">
            <tr>
              <th class="py-3 px-6">Course</th>
              <th class="py-3 px-6">Category</th>
              <th class="py-3 px-6">Status</th>
              <th class="py-3 px-6">Featured</th>
              <th class="py-3 px-6 text-right">Actions</th>
            </tr>
          </thead>
          <tbody class="divide-y divide-dark-border/60 text-zinc-300">
            <tr v-for="c in courses" :key="c.id" class="hover:bg-zinc-800/20">
              <td class="py-4 px-6">
                <div class="flex items-center gap-3">
                  <img
                    v-if="c.cover_image_url"
                    :src="c.cover_image_url"
                    class="h-10 w-16 object-cover rounded-lg border border-dark-border"
                  />
                  <div>
                    <p class="font-medium text-white">{{ c.title }}</p>
                    <p class="text-[11px] font-mono text-zinc-500">/courses/{{ c.slug }}</p>
                  </div>
                </div>
              </td>
              <td class="py-4 px-6 text-zinc-400 font-mono">
                {{ c.category?.name || 'Uncategorized' }}
              </td>
              <td class="py-4 px-6">
                <span
                  class="px-2 py-0.5 rounded-full text-[10px] font-mono"
                  :class="c.is_published ? 'bg-emerald-500/10 text-emerald-400 border border-emerald-500/20' : 'bg-zinc-800 text-zinc-400'"
                >
                  {{ c.is_published ? 'Published' : 'Draft' }}
                </span>
              </td>
              <td class="py-4 px-6 text-zinc-400 font-mono">
                {{ c.is_featured ? '⭐ Yes' : 'No' }}
              </td>
              <td class="py-4 px-6 text-right space-x-2">
                <button
                  type="button"
                  @click="openModal(c)"
                  class="rounded bg-zinc-800 px-2.5 py-1 text-zinc-300 hover:text-white hover:bg-zinc-700"
                >
                  Edit
                </button>
                <button
                  type="button"
                  @click="deleteCourse(c.id)"
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

    <!-- Create / Edit Modal -->
    <div v-if="isModalOpen" class="fixed inset-0 z-50 flex items-center justify-center p-4">
      <div class="fixed inset-0 bg-black/70 backdrop-blur-sm" @click="isModalOpen = false"></div>
      <div class="relative w-full max-w-lg rounded-2xl border border-dark-border bg-[#0d1117] p-6 shadow-2xl space-y-4">
        <h2 class="text-lg font-bold text-white">
          {{ editingId ? 'Edit Course' : 'Create New Course' }}
        </h2>

        <form @submit.prevent="saveCourse" class="space-y-4 text-xs">
          <div>
            <label class="block font-medium text-zinc-300 mb-1">Course Title</label>
            <input
              v-model="form.title"
              type="text"
              required
              class="w-full rounded-xl border border-dark-border bg-[#090a0f] px-3 py-2 text-sm text-zinc-100 focus:border-emerald-500 focus:outline-none"
            />
          </div>

          <div>
            <label class="block font-medium text-zinc-300 mb-1">Slug</label>
            <input
              v-model="form.slug"
              type="text"
              required
              class="w-full rounded-xl border border-dark-border bg-[#090a0f] px-3 py-2 text-sm font-mono text-zinc-100 focus:border-emerald-500 focus:outline-none"
            />
          </div>

          <div>
            <label class="block font-medium text-zinc-300 mb-1">Category</label>
            <select
              v-model="form.category_id"
              class="w-full rounded-xl border border-dark-border bg-[#090a0f] px-3 py-2 text-sm text-zinc-100 focus:border-emerald-500 focus:outline-none"
            >
              <option value="">Select Category</option>
              <option v-for="cat in categories" :key="cat.id" :value="cat.id">
                {{ cat.name }}
              </option>
            </select>
          </div>

          <div>
            <label class="block font-medium text-zinc-300 mb-1">Description</label>
            <textarea
              v-model="form.description"
              rows="3"
              class="w-full rounded-xl border border-dark-border bg-[#090a0f] px-3 py-2 text-sm text-zinc-100 focus:border-emerald-500 focus:outline-none"
            ></textarea>
          </div>

          <div>
            <label class="block font-medium text-zinc-300 mb-1">Cover Image URL</label>
            <input
              v-model="form.cover_image_url"
              type="text"
              placeholder="https://... or upload below"
              class="w-full rounded-xl border border-dark-border bg-[#090a0f] px-3 py-2 text-sm text-zinc-100 focus:border-emerald-500 focus:outline-none"
            />
          </div>

          <div class="flex items-center gap-6 pt-2">
            <label class="flex items-center gap-2 cursor-pointer">
              <input type="checkbox" v-model="form.is_published" class="rounded bg-zinc-800 text-emerald-500" />
              <span class="text-zinc-300">Published</span>
            </label>
            <label class="flex items-center gap-2 cursor-pointer">
              <input type="checkbox" v-model="form.is_featured" class="rounded bg-zinc-800 text-emerald-500" />
              <span class="text-zinc-300">Featured on Home</span>
            </label>
          </div>

          <div class="flex justify-end gap-3 pt-4 border-t border-dark-border">
            <button
              type="button"
              @click="isModalOpen = false"
              class="rounded-xl border border-dark-border px-4 py-2 text-zinc-400 hover:text-white"
            >
              Cancel
            </button>
            <button
              type="submit"
              class="rounded-xl bg-emerald-500 px-5 py-2 font-semibold text-zinc-950 hover:bg-emerald-400"
            >
              Save Course
            </button>
          </div>
        </form>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted } from 'vue'
import { courseService, categoryService } from '@/services'
import type { Course, Category } from '@/types'
import { slugify } from '@/utils/markdown'

const courses = ref<Course[]>([])
const categories = ref<Category[]>([])
const isModalOpen = ref(false)
const editingId = ref<string | null>(null)

const form = ref({
  title: '',
  slug: '',
  description: '',
  category_id: '',
  cover_image_url: '',
  is_published: true,
  is_featured: false
})

async function loadData() {
  const [c, cats] = await Promise.all([
    courseService.getCourses(),
    categoryService.getCategories()
  ])
  courses.value = c
  categories.value = cats
}

function openModal(course?: Course) {
  if (course) {
    editingId.value = course.id
    form.value = {
      title: course.title,
      slug: course.slug,
      description: course.description || '',
      category_id: course.category_id || '',
      cover_image_url: course.cover_image_url || '',
      is_published: course.is_published,
      is_featured: course.is_featured
    }
  } else {
    editingId.value = null
    form.value = {
      title: '',
      slug: '',
      description: '',
      category_id: categories.value[0]?.id || '',
      cover_image_url: '',
      is_published: true,
      is_featured: false
    }
  }
  isModalOpen.value = true
}

async function saveCourse() {
  if (!form.value.slug) {
    form.value.slug = slugify(form.value.title)
  }
  if (editingId.value) {
    await courseService.updateCourse(editingId.value, form.value)
  } else {
    await courseService.createCourse(form.value)
  }
  isModalOpen.value = false
  await loadData()
}

async function deleteCourse(id: string) {
  if (!confirm('Are you sure you want to delete this course and all its lessons?')) return
  await courseService.deleteCourse(id)
  await loadData()
}

onMounted(() => {
  loadData()
})
</script>
