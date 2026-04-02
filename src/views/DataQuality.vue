<template>
  <section class="space-y-6">
    <div class="card">
      <div class="card-header">
        <div>
          <h3 class="text-lg font-semibold text-primary">Data Quality Score</h3>
          <p class="mt-1 text-sm text-textSecondary">
            Quality metrics based on the active dataset preview
          </p>
        </div>
        <span class="badge badge-secondary">{{ qualityScore }}%</span>
      </div>

      <div class="flex flex-col gap-4">
        <div class="progress-track">
          <div
            class="progress-fill"
            :style="{ width: `${qualityScore}%` }"
          ></div>
        </div>

        <div class="grid grid-cols-1 gap-4 md:grid-cols-2 xl:grid-cols-4">
          <div class="rounded-2xl border border-border bg-background p-4">
            <div class="text-sm text-textSecondary">Completeness</div>
            <div class="mt-1 text-2xl font-bold text-primary">
              {{ completenessScore }}%
            </div>
          </div>

          <div class="rounded-2xl border border-border bg-background p-4">
            <div class="text-sm text-textSecondary">Uniqueness</div>
            <div class="mt-1 text-2xl font-bold text-primary">
              {{ uniquenessScore }}%
            </div>
          </div>

          <div class="rounded-2xl border border-border bg-background p-4">
            <div class="text-sm text-textSecondary">Consistency</div>
            <div class="mt-1 text-2xl font-bold text-primary">
              {{ consistencyScore }}%
            </div>
          </div>

          <div class="rounded-2xl border border-border bg-background p-4">
            <div class="text-sm text-textSecondary">Validity</div>
            <div class="mt-1 text-2xl font-bold text-primary">
              {{ validityScore }}%
            </div>
          </div>
        </div>
      </div>
    </div>

    <div class="card">
      <div class="card-header">
        <div>
          <h3 class="text-lg font-semibold text-primary">Detected Issues</h3>
          <p class="mt-1 text-sm text-textSecondary">
            Generated from missing values, duplicates, and inferred data structure
          </p>
        </div>
      </div>

      <div
        v-if="issues.length"
        class="overflow-x-auto rounded-2xl border border-border"
      >
        <table class="table min-w-full bg-white">
          <thead>
            <tr>
              <th>Column</th>
              <th>Issue Type</th>
              <th>Severity</th>
              <th>Recommendation</th>
            </tr>
          </thead>
          <tbody>
            <tr
              v-for="(item, index) in issues"
              :key="index"
              class="transition hover:bg-background"
            >
              <td>{{ item.column }}</td>
              <td>{{ item.type }}</td>
              <td>
                <span
                  class="rounded-full px-3 py-1 text-xs font-semibold"
                  :class="severityClass(item.severity)"
                >
                  {{ item.severity }}
                </span>
              </td>
              <td>{{ item.recommendation }}</td>
            </tr>
          </tbody>
        </table>
      </div>

      <p v-else class="text-sm text-textSecondary">
        No quality issues detected in the current dataset preview.
      </p>
    </div>
  </section>
</template>

<script setup>
import { computed } from 'vue'
import { useDashboardState } from '../composables/useDashboardState'

const { activeDatasetData } = useDashboardState()

const totalCells = computed(() => {
  return (activeDatasetData.value.rows || 0) * (activeDatasetData.value.columns || 0)
})

const completenessScore = computed(() => {
  const cells = totalCells.value
  if (!cells) return 100

  const missing = activeDatasetData.value.missingValues || 0
  return Math.max(0, Math.round(((cells - missing) / cells) * 100))
})

const uniquenessScore = computed(() => {
  const rows = activeDatasetData.value.previewRows || []
  if (!rows.length) return 100

  const duplicateRows = activeDatasetData.value.duplicateRows || 0
  return Math.max(0, Math.round(((rows.length - duplicateRows) / rows.length) * 100))
})

const consistencyScore = computed(() => {
  const summary = activeDatasetData.value.columnSummary || []
  if (!summary.length) return 100

  const mixedLikeColumns = summary.filter(
    (col) => col.type !== 'number' && col.category === 'Quantitative'
  ).length

  const score = 100 - mixedLikeColumns * 10
  return Math.max(70, score)
})

const validityScore = computed(() => {
  const summary = activeDatasetData.value.columnSummary || []
  if (!summary.length) return 100

  const heavilyMissing = summary.filter((col) => col.missing > 0).length
  const score = 100 - heavilyMissing * 8
  return Math.max(70, score)
})

const qualityScore = computed(() => {
  return Math.round(
    (completenessScore.value +
      uniquenessScore.value +
      consistencyScore.value +
      validityScore.value) / 4
  )
})

const issues = computed(() => {
  const summary = activeDatasetData.value.columnSummary || []
  const items = []

  summary.forEach((col) => {
    if (col.missing > 0) {
      items.push({
        column: col.name,
        type: 'Missing values',
        severity: col.missing >= 3 ? 'High' : 'Medium',
        recommendation:
          col.category === 'Quantitative'
            ? 'Review and fill numeric values carefully'
            : 'Review and fill categorical values or standardize labels',
      })
    }
  })

  if ((activeDatasetData.value.duplicateRows || 0) > 0) {
    items.push({
      column: 'Row Level',
      type: 'Duplicate rows',
      severity: 'High',
      recommendation: 'Review duplicated records and remove redundant rows',
    })
  }

  const quantitativeCount = activeDatasetData.value.quantitativeColumns || 0
  if (quantitativeCount === 0) {
    items.push({
      column: 'Dataset Level',
      type: 'No quantitative columns detected',
      severity: 'Medium',
      recommendation: 'Add or verify numeric fields if statistical analysis is expected',
    })
  }

  return items
})

const severityClass = (severity) => {
  if (severity === 'High') return 'bg-danger text-white'
  if (severity === 'Medium') return 'bg-warning text-white'
  return 'bg-accent text-white'
}
</script>