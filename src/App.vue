<template>
  <div class="min-h-screen bg-background text-primary">
    <div class="flex min-h-screen">
      <Sidebar />

      <div class="flex min-w-0 flex-1 flex-col">
        <header class="border-b border-border bg-white lg:hidden">
          <div class="px-4 py-4 sm:px-6">
            <h1 class="text-lg font-bold text-primary">Dura Capital</h1>
            <p class="mt-1 text-sm text-textSecondary">
              Data Quality Control Dashboard
            </p>
          </div>

          <div class="border-t border-border px-4 py-3">
            <div class="flex gap-2 overflow-x-auto">
              <RouterLink
                v-for="item in navItems"
                :key="item.to"
                :to="item.to"
                class="flex-1 text-center rounded-full px-2 py-1 text-[11px] font-semibold bg-[#002455] text-white transition hover:bg-secondary"
                active-class="bg-secondary text-white border-secondary"
              >
                {{ item.label }}
              </RouterLink>
            </div>
          </div>
        </header>

       <main class="flex-1 p-4 sm:p-5 lg:p-6">
          <Topbar />

        <nav class="mb-6 hidden lg:flex gap-2">
  <RouterLink
    v-for="item in navItems"
    :key="item.to"
    :to="item.to"
    class="min-w-0 flex-1 rounded-full px-2 py-1 text-center text-[11px] font-semibold leading-tight bg-[#002455] text-white transition hover:bg-secondary"
    active-class="bg-secondary text-white shadow-sm"
  >
    {{ item.label }}
  </RouterLink>
</nav>

          <RouterView />
        </main>
      </div>
    </div>
  </div>
</template>

<script setup>
import Sidebar from './components/Sidebar.vue'
import Topbar from './components/Topbar.vue'

const navItems = [
  { label: 'Overview', to: '/overview' },
  { label: 'Data Quality', to: '/data-quality' },
  { label: 'EDA Summary', to: '/eda-summary' },
  { label: 'Visualizations', to: '/visualizations' },
  { label: 'Correlation', to: '/correlation' },
  { label: 'Key Management', to: '/key-management' },
  { label: 'Merge Datasets', to: '/merge-datasets' },
  { label: 'Reports / Export', to: '/reports-export' },
]
</script>
