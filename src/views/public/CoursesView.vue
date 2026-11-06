<template>
  <div class="mx-auto max-w-7xl px-4 py-12 sm:px-6 lg:px-8">
    <!-- Header -->
    <div class="max-w-2xl">
      <span class="text-xs font-mono uppercase tracking-wider text-emerald-400">Curriculum Tracks</span>
      <h1 class="text-3xl sm:text-4xl font-extrabold tracking-tight text-white mt-1">
        Backend Engineering Courses
      </h1>
      <p class="mt-3 text-base text-zinc-400">
        In-depth, structured series covering distributed systems, low-level Linux internals, database engines, and architecture.
      </p>
    </div>

    <!-- Category Filter Tabs -->
    <div class="mt-8 flex flex-wrap items-center gap-2 border-b border-dark-border pb-4">
      <button
        type="button"
        @click="selectedCategory = ''"
        class="rounded-xl px-4 py-2 text-xs font-medium transition-colors"
        :class="!selectedCategory
          ? 'bg-emerald-500 text-zinc-950 font-semibold'
          : 'bg-dark-card text-zinc-400 border border-dark-border hover:text-white'"
      >
        All Tracks ({{ courses.length }})
      </button>

      <button
        v-for="cat in categories"
        :key="cat.id"
        type="button"
        @click="selectedCategory = cat.slug"
        class="rounded-xl px-4 py-2 text-xs font-medium transition-colors"
        :class="selectedCategory === cat.slug
          ? 'bg-emerald-500 text-zinc-950 font-semibold'
          : 'bg-dark-card text-zinc-400 border border-dark-border hover:text-white'"
      >
        {{ cat.name }}
      </button>
    </div>

    <!-- Course Grid -->
    <div v-if="isLoading" class="mt-8 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
      <div v-for="i in 3" :key="i" class="h-72 rounded-2xl bg-zinc-900/50 animate-pulse border border-dark-border"></div>
    </div>

    <div v-else-if="filteredCourses.length > 0" class="mt-8 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
      <CourseCard
        v-for="course in filteredCourses"
        :key="course.id"
        :course="course"
      />
    </div>

    <div v-else class="mt-16 text-center py-12 rounded-2xl border border-dark-border bg-dark-card/40">
      <p class="text-zinc-400 text-sm">No courses found in this category.</p>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, computed, onMounted, watch } from 'vue'
import { useRoute } from 'vue-router'
import { courseService, categoryService } from '@/services'
import type { Course, Category } from '@/types'
import CourseCard from '@/components/course/CourseCard.vue'

const route = useRoute()
const isLoading = ref(true)
const courses = ref<Course[]>([])
const categories = ref<Category[]>([])
const selectedCategory = ref<string>('')

const filteredCourses = computed(() => {
  if (!selectedCategory.value) return courses.value
  return courses.value.filter(c => c.category?.slug === selectedCategory.value)
})

onMounted(async () => {
  if (route.query.category) {
    selectedCategory.value = String(route.query.category)
  }
  try {
    const [cData, catData] = await Promise.all([
      courseService.getCourses({ isPublished: true }),
      categoryService.getCategories()
    ])
    courses.value = cData
    categories.value = catData
  } catch (err) {
    console.error('Error fetching courses:', err)
  } finally {
    isLoading.value = false
  }
})

watch(() => route.query.category, (newCat) => {
  if (newCat) {
    selectedCategory.value = String(newCat)
  } else {
    selectedCategory.value = ''
  }
})
</script>
