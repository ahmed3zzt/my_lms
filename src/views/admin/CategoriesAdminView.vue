<template>
  <div class="space-y-12">
    <!-- Manage Categories -->
    <div class="space-y-6">
      <div class="flex items-center justify-between">
        <div>
          <h2 class="text-xl font-bold text-white tracking-tight">Categories</h2>
          <p class="text-xs text-zinc-400 mt-1">Organize courses into high-level subject areas.</p>
        </div>
        <button
          type="button"
          @click="openCategoryModal()"
          class="rounded-xl bg-emerald-500 px-4 py-2 text-xs font-semibold uppercase tracking-wider text-zinc-950 hover:bg-emerald-400 transition-colors"
        >
          + Add Category
        </button>
      </div>

      <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div
          v-for="cat in categories"
          :key="cat.id"
          class="rounded-xl border border-dark-border bg-dark-card p-4 flex items-center justify-between"
        >
          <div>
            <div class="flex items-center gap-2">
              <span class="font-semibold text-sm text-zinc-100">{{ cat.name }}</span>
              <span class="text-[10px] font-mono text-zinc-500">/{{ cat.slug }}</span>
            </div>
            <p class="text-xs text-zinc-400 mt-1 line-clamp-1">{{ cat.description }}</p>
          </div>

          <div class="flex items-center gap-2">
            <button
              type="button"
              @click="openCategoryModal(cat)"
              class="rounded bg-zinc-800 px-2.5 py-1 text-xs text-zinc-300 hover:text-white"
            >
              Edit
            </button>
            <button
              type="button"
              @click="deleteCategory(cat.id)"
              class="rounded bg-red-950/40 text-red-400 border border-red-500/20 px-2.5 py-1 text-xs hover:bg-red-900/60"
            >
              Delete
            </button>
          </div>
        </div>
      </div>
    </div>

    <!-- Manage Tags -->
    <div class="space-y-6 border-t border-dark-border pt-8">
      <div>
        <h2 class="text-xl font-bold text-white tracking-tight">Tags</h2>
        <p class="text-xs text-zinc-400 mt-1">Granular keywords for lessons (e.g. #Go, #Postgres, #Raft).</p>
      </div>

      <!-- Add Tag Form -->
      <form @submit.prevent="createTag" class="flex items-center gap-3 max-w-md">
        <input
          v-model="newTagName"
          type="text"
          placeholder="New tag name (e.g. eBPF)"
          required
          class="flex-1 rounded-xl border border-dark-border bg-dark-card px-3 py-2 text-xs text-zinc-200 focus:outline-none focus:border-emerald-500"
        />
        <button
          type="submit"
          class="rounded-xl bg-zinc-800 hover:bg-zinc-700 text-zinc-200 px-4 py-2 text-xs font-semibold"
        >
          Add Tag
        </button>
      </form>

      <!-- Tags List -->
      <div class="flex flex-wrap gap-2">
        <div
          v-for="tag in tags"
          :key="tag.id"
          class="flex items-center gap-2 rounded-lg border border-dark-border bg-dark-card px-3 py-1.5 text-xs text-zinc-300"
        >
          <span>#{{ tag.name }}</span>
          <button
            type="button"
            @click="deleteTag(tag.id)"
            class="text-zinc-500 hover:text-red-400"
            title="Delete tag"
          >
            ×
          </button>
        </div>
      </div>
    </div>

    <!-- Category Modal -->
    <div v-if="isCatModalOpen" class="fixed inset-0 z-50 flex items-center justify-center p-4">
      <div class="fixed inset-0 bg-black/70 backdrop-blur-sm" @click="isCatModalOpen = false"></div>
      <div class="relative w-full max-w-md rounded-2xl border border-dark-border bg-[#0d1117] p-6 shadow-2xl space-y-4 text-xs">
        <h3 class="text-base font-bold text-white">
          {{ editingCatId ? 'Edit Category' : 'Create Category' }}
        </h3>

        <form @submit.prevent="saveCategory" class="space-y-3">
          <div>
            <label class="block font-medium text-zinc-300 mb-1">Name</label>
            <input
              v-model="catForm.name"
              type="text"
              required
              class="w-full rounded-xl border border-dark-border bg-[#090a0f] px-3 py-2 text-sm text-zinc-100 focus:outline-none focus:border-emerald-500"
            />
          </div>

          <div>
            <label class="block font-medium text-zinc-300 mb-1">Slug</label>
            <input
              v-model="catForm.slug"
              type="text"
              required
              class="w-full rounded-xl border border-dark-border bg-[#090a0f] px-3 py-2 text-sm font-mono text-zinc-100 focus:outline-none focus:border-emerald-500"
            />
          </div>

          <div>
            <label class="block font-medium text-zinc-300 mb-1">Description</label>
            <textarea
              v-model="catForm.description"
              rows="3"
              class="w-full rounded-xl border border-dark-border bg-[#090a0f] px-3 py-2 text-sm text-zinc-100 focus:outline-none focus:border-emerald-500"
            ></textarea>
          </div>

          <div class="flex justify-end gap-2 pt-3 border-t border-dark-border">
            <button
              type="button"
              @click="isCatModalOpen = false"
              class="rounded-xl border border-dark-border px-3 py-1.5 text-zinc-400"
            >
              Cancel
            </button>
            <button
              type="submit"
              class="rounded-xl bg-emerald-500 px-4 py-1.5 font-semibold text-zinc-950"
            >
              Save
            </button>
          </div>
        </form>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted } from 'vue'
import { categoryService } from '@/services'
import type { Category, Tag } from '@/types'
import { slugify } from '@/utils/markdown'

const categories = ref<Category[]>([])
const tags = ref<Tag[]>([])
const isCatModalOpen = ref(false)
const editingCatId = ref<string | null>(null)
const newTagName = ref('')

const catForm = ref({
  name: '',
  slug: '',
  description: ''
})

async function loadData() {
  const [c, t] = await Promise.all([
    categoryService.getCategories(),
    categoryService.getTags()
  ])
  categories.value = c
  tags.value = t
}

function openCategoryModal(cat?: Category) {
  if (cat) {
    editingCatId.value = cat.id
    catForm.value = {
      name: cat.name,
      slug: cat.slug,
      description: cat.description || ''
    }
  } else {
    editingCatId.value = null
    catForm.value = {
      name: '',
      slug: '',
      description: ''
    }
  }
  isCatModalOpen.value = true
}

async function saveCategory() {
  if (!catForm.value.slug) {
    catForm.value.slug = slugify(catForm.value.name)
  }
  if (editingCatId.value) {
    await categoryService.updateCategory(editingCatId.value, catForm.value)
  } else {
    await categoryService.createCategory(catForm.value)
  }
  isCatModalOpen.value = false
  await loadData()
}

async function deleteCategory(id: string) {
  if (!confirm('Are you sure you want to delete this category?')) return
  await categoryService.deleteCategory(id)
  await loadData()
}

async function createTag() {
  const name = newTagName.value.trim()
  if (!name) return
  const slug = slugify(name)
  await categoryService.createTag(name, slug)
  newTagName.value = ''
  await loadData()
}

async function deleteTag(id: string) {
  if (!confirm('Delete this tag?')) return
  await categoryService.deleteTag(id)
  await loadData()
}

onMounted(() => {
  loadData()
})
</script>
