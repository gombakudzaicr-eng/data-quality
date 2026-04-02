<template>
  <section class="space-y-5">
    <div class="grid grid-cols-1 gap-5 xl:grid-cols-[1.6fr_0.8fr]">
      <div class="card">
        <div class="card-header">
          <div>
            <h3 class="text-base font-semibold text-primary">Interactive Chart Area</h3>
            <p class="mt-1 text-xs text-textSecondary">
              Dataset: {{ activeDatasetData.name }}
            </p>
          </div>
          <span class="badge badge-secondary">{{ finalChartType }}</span>
        </div>

        <div v-if="canRenderChart" class="rounded-2xl border border-border bg-white p-4">
          <DynamicChart
            :chart-type="finalChartType"
            :x-key="chartXKey"
            :y-key="chartYKey"
            :rows="activeDatasetData.previewRows || []"
            :column-summary="activeDatasetData.columnSummary || []"
          />
        </div>

        <div v-else class="chart-placeholder">
          <div
            class="flex h-24 w-64 items-center justify-center rounded-2xl border border-border bg-white px-4 text-center text-sm font-bold text-secondary"
          >
            Select a compatible chart setup
          </div>

          <p class="text-xs text-textSecondary">
            Upload data and choose suitable variables to render a chart.
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
            <p class="mt-1 text-sm font-semibold text-primary">
              {{ state.selectedGraphType || 'Not selected' }}
            </p>
          </div>

          <div class="rounded-2xl border border-border bg-background p-3">
            <p class="text-xs text-textSecondary">Recommended Graph</p>
            <p class="mt-1 text-sm font-semibold text-primary">
              {{ recommendedGraph }}
            </p>
          </div>

          <div class="rounded-2xl border border-border bg-background p-3">
            <p class="text-xs text-textSecondary">X Variable</p>
            <p class="mt-1 text-sm font-semibold text-primary">
              {{ chartXKey || 'Not selected' }}
            </p>
          </div>

          <div class="rounded-2xl border border-border bg-background p-3">
            <p class="text-xs text-textSecondary">Y Variable</p>
            <p class="mt-1 text-sm font-semibold text-primary">
              {{ chartYKey || 'Not selected' }}
            </p>
          </div>

          <div class="rounded-2xl border border-border bg-background p-3">
            <p class="text-xs text-textSecondary">Auto Note</p>
            <p class="mt-1 text-sm text-primary">
              {{ autoInsight }}
            </p>
          </div>
        </div>
      </div>
    </div>
  </section>
</template>

<script setup>
import { computed } from 'vue'
import { useDashboardState } from '../composables/useDashboardState'
import DynamicChart from '../components/DynamicChart.vue'

const { state, activeDatasetData } = useDashboardState()

const xMeta = computed(() =>
  (activeDatasetData.value?.columnSummary || []).find(
    (col) => col.name === state.selectedX
  )
)

const yMeta = computed(() =>
  (activeDatasetData.value?.columnSummary || []).find(
    (col) => col.name === state.selectedY
  )
)

const recommendedGraph = computed(() => {
  const xType = xMeta.value?.category
  const yType = yMeta.value?.category

  if (!xType) return 'Bar Chart'
  if (xType === 'Quantitative' && yType === 'Quantitative') return 'Scatter Plot'
  if (xType === 'Qualitative' && yType === 'Qualitative') return 'Bar Chart'
  if (xType === 'Qualitative' && yType === 'Quantitative') return 'Bar Chart'
  if (xType === 'Quantitative' && yType === 'Qualitative') return 'Bar Chart'
  return 'Bar Chart'
})

const finalChartType = computed(() => {
  return recommendedGraph.value
})

const chartXKey = computed(() => state.selectedX || '')
const chartYKey = computed(() => {
  if (finalChartType.value === 'Scatter Plot') {
    return state.selectedY || ''
  }
  return state.selectedY || ''
})

const canRenderChart = computed(() => {
  if (!chartXKey.value) return false
  if (!(activeDatasetData.value?.previewRows || []).length) return false
  if (finalChartType.value === 'Scatter Plot') return !!chartYKey.value
  return true
})

const autoInsight = computed(() => {
  if (!state.selectedX) {
    return 'Upload a dataset and select variables to generate chart guidance.'
  }

  return `Current chart is prepared using ${chartXKey.value}${chartYKey.value ? ` and ${chartYKey.value}` : ''}.`
})
</script>
