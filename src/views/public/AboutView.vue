<template>
  <div class="mx-auto max-w-4xl px-4 py-12 sm:px-6 lg:px-8 space-y-12">
    <!-- Header with Profile Photo -->
    <div class="flex flex-col sm:flex-row items-center sm:items-start gap-8 border-b border-dark-border pb-10">
      <img
        src="https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=400&q=80"
        alt="Ahmed Ezz"
        class="h-32 w-32 sm:h-40 sm:w-40 rounded-3xl object-cover border-2 border-emerald-500/30 shadow-xl shadow-emerald-500/5 shrink-0"
      />
      <div class="text-center sm:text-left space-y-3">
        <div class="inline-flex items-center gap-2 rounded-full border border-emerald-500/30 bg-emerald-500/10 px-3 py-0.5 text-xs font-mono text-emerald-400">
          Staff / Principal Backend Mindset
        </div>
        <h1 class="text-3xl sm:text-4xl font-extrabold text-white tracking-tight">
          Ahmed Ezz
        </h1>
        <p class="text-lg font-medium text-emerald-400 font-mono">
          Backend Software Engineer
        </p>
        <p class="text-zinc-400 text-sm leading-relaxed max-w-xl">
          Backend Software Engineer passionate about backend development, Linux, databases, distributed systems, clean architecture, and teaching programming through practical examples.
        </p>

        <!-- Social & Direct Channels -->
        <div class="pt-3 flex flex-wrap items-center justify-center sm:justify-start gap-3 text-xs">
          <a
            href="https://github.com"
            target="_blank"
            rel="noopener noreferrer"
            class="flex items-center gap-1.5 rounded-xl border border-dark-border bg-dark-card px-3 py-2 text-zinc-300 hover:border-zinc-700 hover:text-white transition-colors"
          >
            <span>GitHub</span>
          </a>
          <a
            href="https://linkedin.com"
            target="_blank"
            rel="noopener noreferrer"
            class="flex items-center gap-1.5 rounded-xl border border-dark-border bg-dark-card px-3 py-2 text-zinc-300 hover:border-zinc-700 hover:text-white transition-colors"
          >
            <span>LinkedIn</span>
          </a>
          <a
            href="https://ahmedezz.dev"
            target="_blank"
            rel="noopener noreferrer"
            class="flex items-center gap-1.5 rounded-xl border border-dark-border bg-dark-card px-3 py-2 text-zinc-300 hover:border-zinc-700 hover:text-white transition-colors"
          >
            <span>Portfolio</span>
          </a>
          <a
            href="mailto:contact@ahmedezz.dev"
            class="flex items-center gap-1.5 rounded-xl border border-emerald-500/30 bg-emerald-500/10 px-3 py-2 text-emerald-400 hover:bg-emerald-500/20 transition-colors"
          >
            <span>Email</span>
          </a>
        </div>
      </div>
    </div>

    <!-- Core Engineering Competencies & Skills -->
    <section class="space-y-6">
      <h2 class="text-xl font-bold text-white tracking-tight">Technical Skills & Expertise</h2>
      <div class="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
        <div
          v-for="skillGroup in skills"
          :key="skillGroup.category"
          class="rounded-2xl border border-dark-border bg-dark-card p-5"
        >
          <h3 class="text-xs font-mono font-bold uppercase tracking-wider text-emerald-400 mb-3">
            {{ skillGroup.category }}
          </h3>
          <ul class="space-y-1.5 text-xs text-zinc-300">
            <li v-for="item in skillGroup.items" :key="item" class="flex items-center gap-2">
              <span class="w-1.5 h-1.5 rounded-full bg-emerald-500"></span>
              {{ item }}
            </li>
          </ul>
        </div>
      </div>
    </section>

    <!-- Experience Timeline -->
    <section class="space-y-6">
      <h2 class="text-xl font-bold text-white tracking-tight">Experience & Focus</h2>
      <div class="space-y-4">
        <div
          v-for="exp in experience"
          :key="exp.role"
          class="rounded-2xl border border-dark-border bg-dark-card p-6"
        >
          <div class="flex flex-col sm:flex-row sm:items-center justify-between gap-1 mb-2">
            <h3 class="font-bold text-base text-zinc-100">{{ exp.role }}</h3>
            <span class="text-xs font-mono text-zinc-500">{{ exp.period }}</span>
          </div>
          <p class="text-xs text-emerald-400 font-mono mb-3">{{ exp.company }}</p>
          <p class="text-sm text-zinc-400 leading-relaxed">{{ exp.description }}</p>
        </div>
      </div>
    </section>
  </div>
</template>

<script setup lang="ts">
const skills = [
  {
    category: 'Languages & Runtimes',
    items: ['Golang (Advanced)', 'C / Modern C++', 'TypeScript / Node.js', 'Bash & Shell Scripting']
  },
  {
    category: 'Distributed Systems',
    items: ['Raft & Paxos Consensus', 'gRPC & Protocol Buffers', 'Event Streaming & Kafka', 'Distributed Locking & Transactions']
  },
  {
    category: 'Storage & Databases',
    items: ['PostgreSQL Internals & WAL', 'LSM-Trees & B-Trees', 'Redis & In-Memory Stores', 'Database Partitioning & Sharding']
  },
  {
    category: 'Operating Systems & Linux',
    items: ['Linux Kernel Subsystems', 'epoll & Non-blocking I/O', 'eBPF Observability', 'cgroups & Namespaces']
  },
  {
    category: 'Architecture & Design',
    items: ['Clean Architecture & DDD', 'SOLID Principles & Microservices', 'High-Throughput Concurrency', 'Zero-Downtime Migrations']
  },
  {
    category: 'Teaching & Mentorship',
    items: ['YouTube Video Production', 'System Design Masterclasses', 'Technical Writing & Documentation', 'Interactive Code Labs']
  }
]

const experience = [
  {
    role: 'Lead Backend Engineer & Educator',
    company: 'Independent Systems & Educational Platform',
    period: '2023 - Present',
    description: 'Designed and built distributed microservices, open-source storage engines, and comprehensive curriculum notes for backend developers worldwide.'
  },
  {
    role: 'Senior Backend Engineer',
    company: 'Distributed Infrastructure Systems',
    period: '2020 - 2023',
    description: 'Specialized in high-load transactional systems, write-ahead logging synchronization, database optimization, and cloud-native container orchestration.'
  }
]
</script>
