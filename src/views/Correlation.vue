
<template>
  <section class="space-y-6">
    <div class="card">
      <div class="card-header">
        <div>
          <h3 class="text-lg font-semibold text-primary">Correlation Heatmap</h3>
          <p class="mt-1 text-sm text-textSecondary">
            Quantitative columns from the active dataset preview
          </p>
        </div>
      </div>

      <div v-if="correlationLabels.length >= 2" class="space-y-4">
        <div class="overflow-x-auto">
          <div
            class="grid gap-3"
            :style="{ gridTemplateColumns: `repeat(${correlationLabels.length}, minmax(140px, 1fr))` }"
          >
            <div
              v-for="(row, rowIndex) in correlationMatrix"
              :key="rowIndex"
              class="contents"
            >
              <div
                v-for="(value, colIndex) in row"
                :key="`${rowIndex}-${colIndex}`"
                class="rounded-2xl p-4"
                :style="heatmapStyle(value)"
              >
                <div class="text-xs opacity-90">
                  {{ correlationLabels[rowIndex] }} / {{ correlationLabels[colIndex] }}
                </div>
                <div class="mt-3 text-2xl font-bold">
                  {{ value.toFixed(2) }}
                </div>
              </div>
            </div>
          </div>
        </div>

        <div class="rounded-2xl border border-border bg-background p-4">
          <p class="text-sm text-textSecondary">
            Values close to 1 indicate a strong positive relationship, values close to -1 indicate a strong negative relationship, and values near 0 indicate a weak relationship.
          </p>
        </div>
      </div>

      <p v-else class="text-sm text-textSecondary">
        At least two quantitative columns are needed to calculate correlation.
      </p>
    </div>

    <div class="card">
      <div class="card-header">
        <h3 class="text-lg font-semibold text-primary">Correlation Details</h3>
      </div>

      <div
        v-if="correlationDetails.length"
        class="overflow-x-auto rounded-2xl border border-border"
      >
        <table class="table min-w-full bg-white">
          <thead>
            <tr>
              <th>Column A</th>
              <th>Column B</th>
              <th>Value</th>
              <th>Strength</th>
            </tr>
          </thead>
          <tbody>
            <tr
              v-for="(item, index) in correlationDetails"
              :key="index"
              class="transition hover:bg-background"
            >
              <td>{{ item.a }}</td>
              <td>{{ item.b }}</td>
              <td>{{ item.value.toFixed(2) }}</td>
              <td>{{ item.strength }}</td>
            </tr>
          </tbody>
        </table>
      </div>

      <p v-else class="text-sm text-textSecondary">
        No correlation pairs available yet.
      </p>
    </div>
  </section>
</template>

<script setup>
import { computed } from 'vue'
import { useDashboardState } from '../composables/useDashboardState'

const { activeDatasetData } = useDashboardState()

const quantitativeColumns = computed(() =>
  (activeDatasetData.value?.columnSummary || [])
    .filter((col) => col.category === 'Quantitative')
    .map((col) => col.name)
)

const correlationLabels = computed(() => quantitativeColumns.value)

function getNumericSeries(columnName) {
  return (activeDatasetData.value?.previewRows || [])
    .map((row) => row[columnName])
    .map((value) => Number(value))
}

function pearsonCorrelation(x, y) {
  const paired = []

  for (let i = 0; i < x.length; i += 1) {
    const xv = x[i]
    const yv = y[i]

    if (!Number.isNaN(xv) && !Number.isNaN(yv)) {
      paired.push([xv, yv])
    }
  }

  if (paired.length < 2) return 0

  const xs = paired.map(([a]) => a)
  const ys = paired.map(([, b]) => b)

  const xMean = xs.reduce((sum, val) => sum + val, 0) / xs.length
  const yMean = ys.reduce((sum, val) => sum + val, 0) / ys.length

  let numerator = 0
  let xDenominator = 0
  let yDenominator = 0

  for (let i = 0; i < xs.length; i += 1) {
    const xDiff = xs[i] - xMean
    const yDiff = ys[i] - yMean

    numerator += xDiff * yDiff
    xDenominator += xDiff * xDiff
    yDenominator += yDiff * yDiff
  }

  const denominator = Math.sqrt(xDenominator * yDenominator)
  if (denominator === 0) return 0

  return numerator / denominator
}

const correlationMatrix = computed(() => {
  const labels = correlationLabels.value

  return labels.map((rowLabel) => {
    const xSeries = getNumericSeries(rowLabel)

    return labels.map((colLabel) => {
      const ySeries = getNumericSeries(colLabel)
      return pearsonCorrelation(xSeries, ySeries)
    })
  })
})

function strengthLabel(value) {
  const abs = Math.abs(value)

  if (abs >= 0.8) return value >= 0 ? 'Very Strong Positive' : 'Very Strong Negative'
  if (abs >= 0.6) return value >= 0 ? 'Strong Positive' : 'Strong Negative'
  if (abs >= 0.4) return value >= 0 ? 'Moderate Positive' : 'Moderate Negative'
  if (abs >= 0.2) return value >= 0 ? 'Weak Positive' : 'Weak Negative'
  return 'Very Weak / No Correlation'
}

const correlationDetails = computed(() => {
  const labels = correlationLabels.value
  const details = []

  for (let i = 0; i < labels.length; i += 1) {
    for (let j = i + 1; j < labels.length; j += 1) {
      const value = correlationMatrix.value[i][j]
      details.push({
        a: labels[i],
        b: labels[j],
        value,
        strength: strengthLabel(value),
      })
    }
  }

  return details.sort((a, b) => Math.abs(b.value) - Math.abs(a.value))
})

function heatmapStyle(value) {
  const intensity = Math.abs(value)

  if (value >= 0) {
    return {
      background: `rgba(8, 170, 199, ${0.15 + intensity * 0.85})`,
      color: intensity > 0.55 ? '#ffffff' : '#002455',
      border: '1px solid #D9D9D9',
    }
  }

  return {
    background: `rgba(236, 9, 40, ${0.15 + intensity * 0.85})`,
    color: intensity > 0.55 ? '#ffffff' : '#002455',
    border: '1px solid #D9D9D9',
  }
}
</script>