<template>
  <section class="space-y-5">
    <div class="grid grid-cols-1 gap-5 xl:grid-cols-[1.6fr_0.8fr]">
      <div class="card">
        <div class="card-header">
          <h3 class="text-base font-semibold text-primary">Interactive Chart Area</h3>
          <span class="badge badge-secondary">{{ state.selectedGraphType }}</span>
        </div>

        <div class="chart-placeholder">
          <div
            class="flex h-24 w-52 items-center justify-center rounded-2xl border border-border bg-white text-base font-bold text-secondary"
          >
            {{ state.selectedX }} vs {{ state.selectedY }}
          </div>
          <p class="text-xs text-textSecondary">
            Replace this placeholder later with Chart.js, ApexCharts, or ECharts.
          </p>
        </div>
      </div>

      <div class="card">
        <div class="card-header">
          <h3 class="text-base font-semibold text-primary">Chart Insight</h3>
        </div>

        <div class="space-y-3">
          <div class="rounded-2xl border border-border bg-background p-3">
            <p class="text-xs text-textSecondary">Selected Graph</p>
            <p class="mt-1 text-sm font-semibold text-primary">{{ state.selectedGraphType }}</p>
          </div>

          <div class="rounded-2xl border border-border bg-background p-3">
            <p class="text-xs text-textSecondary">X Variable</p>
            <p class="mt-1 text-sm font-semibold text-primary">{{ state.selectedX }}</p>
          </div>

          <div class="rounded-2xl border border-border bg-background p-3">
            <p class="text-xs text-textSecondary">Y Variable</p>
            <p class="mt-1 text-sm font-semibold text-primary">{{ state.selectedY }}</p>
          </div>
        </div>
      </div>
    </div>
  </section>
</template>

<script setup>
import { useDashboardState } from '../composables/useDashboardState'

const { state } = useDashboardState()
</script>