
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
          <span class="badge badge-secondary">{{ recommendedGraph }}</span>
        </div>

        <div class="chart-placeholder">
          <div
            class="flex h-24 w-64 items-center justify-center rounded-2xl border border-border bg-white px-4 text-center text-sm font-bold text-secondary"
          >
            {{ chartTitle }}
          </div>

          <p class="text-xs text-textSecondary">
            {{ chartMessage }}
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

          <div
            class="rounded-2xl border p-3"
            :class="isGoodMatch ? 'border-accent bg-background' : 'border-warning bg-background'"
          >
            <p class="text-xs text-textSecondary">Chart Match Status</p>
            <p class="mt-1 text-sm font-semibold text-primary">
              {{ matchStatus }}
            </p>
          </div>

          <div class="rounded-2xl border border-border bg-background p-3">
            <p class="text-xs text-textSecondary">X Variable</p>
            <p class="mt-1 text-sm font-semibold text-primary">
              {{ state.selectedX || 'Not selected' }}
            </p>
            <p class="mt-1 text-xs text-textSecondary">
              Type: {{ xMeta?.category || 'Unknown' }}
            </p>
          </div>

          <div class="rounded-2xl border border-border bg-background p-3">
            <p class="text-xs text-textSecondary">Y Variable</p>
            <p class="mt-1 text-sm font-semibold text-primary">
              {{ state.selectedY || 'Not selected' }}
            </p>
            <p class="mt-1 text-xs text-textSecondary">
              Type: {{ yMeta?.category || 'Unknown' }}
            </p>
          </div>

          <div class="rounded-2xl border border-border bg-background p-3">
            <p class="text-xs text-textSecondary">Available Columns</p>
            <div class="mt-2 flex flex-wrap gap-2">
              <span
                v-for="col in activeDatasetData.columnSummary || []"
                :key="col.name"
                class="badge"
                :class="col.category === 'Quantitative' ? 'badge-secondary' : 'badge-primary'"
              >
                {{ col.name }}
              </span>
            </div>
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

  if (!xType && !yType) return 'No recommendation yet'
  if (xType === 'Quantitative' && yType === 'Quantitative') return 'Scatter Plot'
  if (xType === 'Qualitative' && yType === 'Quantitative') return 'Bar Chart'
  if (xType === 'Quantitative' && !state.selectedY) return 'Histogram'
  if (xType === 'Quantitative' && yType === 'Qualitative') return 'Bar Chart'
  if (xType === 'Qualitative' && yType === 'Qualitative') return 'Bar Chart'
  return state.selectedGraphType || 'Chart'
})

const isGoodMatch = computed(() => {
  const selected = state.selectedGraphType
  const xType = xMeta.value?.category
  const yType = yMeta.value?.category

  if (!selected || !xType) return true

  if (selected === 'Scatter Plot') {
    return xType === 'Quantitative' && yType === 'Quantitative'
  }

  if (selected === 'Histogram' || selected === 'Box Plot') {
    return xType === 'Quantitative'
  }

  if (selected === 'Line Chart') {
    return xType === 'Quantitative' && yType === 'Quantitative'
  }

  if (selected === 'Bar Chart' || selected === 'Pie Chart') {
    return xType === 'Qualitative' || yType === 'Qualitative'
  }

  return true
})

const matchStatus = computed(() => {
  if (!state.selectedX) return 'Select variables to evaluate chart fit'
  if (isGoodMatch.value) return 'Current chart matches the selected variable types'
  return `Current chart is not ideal. Try ${recommendedGraph.value}`
})

const chartTitle = computed(() => {
  if (!state.selectedX) return 'Select variables'

  if (recommendedGraph.value === 'Histogram') {
    return `Histogram of ${state.selectedX}`
  }

  if (recommendedGraph.value === 'Pie Chart') {
    return `Pie Chart of ${state.selectedX}`
  }

  if (!state.selectedY) {
    return `${recommendedGraph.value} of ${state.selectedX}`
  }

  return `${state.selectedX} vs ${state.selectedY}`
})

const chartMessage = computed(() => {
  if (!state.selectedX) {
    return 'Choose variables from the sidebar to prepare a chart.'
  }

  if (isGoodMatch.value) {
    return `The current setup is appropriate for a ${state.selectedGraphType}.`
  }

  return `The selected variables would be better represented with a ${recommendedGraph.value}.`
})

const autoInsight = computed(() => {
  const xType = xMeta.value?.category
  const yType = yMeta.value?.category

  if (!state.selectedX) {
    return 'Upload a dataset and select variables to generate chart guidance.'
  }

  if (!state.selectedY) {
    return `${state.selectedX} is currently treated as ${xType || 'Unknown'}, so ${recommendedGraph.value} is recommended.`
  }

  return `${state.selectedX} is ${xType || 'Unknown'} and ${state.selectedY} is ${yType || 'Unknown'}, so ${recommendedGraph.value} is the recommended chart.`
})
</script>