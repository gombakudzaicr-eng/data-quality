<template>
  <section class="space-y-6">
    <div class="grid-2">
      <div class="card">
        <div class="card-header">
          <h3 class="text-lg font-semibold text-primary">Numerical Summary</h3>
        </div>

        <div
          v-if="numericalSummary.length"
          class="overflow-x-auto rounded-2xl border border-border"
        >
          <table class="table min-w-full bg-white">
            <thead>
              <tr>
                <th>Column</th>
                <th>Mean</th>
                <th>Median</th>
                <th>Min</th>
                <th>Max</th>
              </tr>
            </thead>
            <tbody>
              <tr
                v-for="item in numericalSummary"
                :key="item.column"
                class="transition hover:bg-background"
              >
                <td>{{ item.column }}</td>
                <td>{{ item.mean }}</td>
                <td>{{ item.median }}</td>
                <td>{{ item.min }}</td>
                <td>{{ item.max }}</td>
              </tr>
            </tbody>
          </table>
        </div>

        <p v-else class="text-sm text-textSecondary">
          No quantitative columns available in the current dataset preview.
        </p>
      </div>

      <div class="card">
        <div class="card-header">
          <h3 class="text-lg font-semibold text-primary">Categorical Summary</h3>
        </div>

        <div
          v-if="categoricalSummary.length"
          class="overflow-x-auto rounded-2xl border border-border"
        >
          <table class="table min-w-full bg-white">
            <thead>
              <tr>
                <th>Column</th>
                <th>Unique Values</th>
                <th>Most Frequent</th>
                <th>Missing</th>
              </tr>
            </thead>
            <tbody>
              <tr
                v-for="item in categoricalSummary"
                :key="item.column"
                class="transition hover:bg-background"
              >
                <td>{{ item.column }}</td>
                <td>{{ item.unique }}</td>
                <td>{{ item.frequent }}</td>
                <td>{{ item.missing }}</td>
              </tr>
            </tbody>
          </table>
        </div>

        <p v-else class="text-sm text-textSecondary">
          No qualitative columns available in the current dataset preview.
        </p>
      </div>
    </div>

    <div class="card">
      <div class="card-header">
        <h3 class="text-lg font-semibold text-primary">Auto-Generated Insights</h3>
      </div>

      <ul class="insight-list">
        <li v-for="(item, index) in generatedInsights" :key="index">
          {{ item }}
        </li>
      </ul>
    </div>

    <div class="card">
      <div class="card-header">
        <h3 class="text-lg font-semibold text-primary">Stem-and-Leaf Diagram</h3>
      </div>

      <div v-if="stemLeafText">
        <p class="mb-3 text-sm text-textSecondary">
          Column used: <span class="font-semibold text-primary">{{ stemLeafColumn }}</span>
        </p>
        <pre class="code-block">{{ stemLeafText }}</pre>
      </div>

      <p v-else class="text-sm text-textSecondary">
        No suitable quantitative column available for stem-and-leaf preview.
      </p>
    </div>
  </section>
</template>

<script setup>
import { computed } from 'vue'
import { useDashboardState } from '../composables/useDashboardState'

const { activeDatasetData } = useDashboardState()

function getNumericValues(column) {
  return (activeDatasetData.value?.previewRows || [])
    .map((row) => row[column])
    .filter((value) => value !== '' && value !== null && value !== undefined)
    .map((value) => Number(value))
    .filter((value) => !Number.isNaN(value))
}

function median(values) {
  if (!values.length) return 0
  const sorted = [...values].sort((a, b) => a - b)
  const mid = Math.floor(sorted.length / 2)
  return sorted.length % 2 === 0
    ? Number(((sorted[mid - 1] + sorted[mid]) / 2).toFixed(2))
    : sorted[mid]
}

const numericalSummary = computed(() => {
  const cols = activeDatasetData.value?.columnSummary || []

  return cols
    .filter((col) => col.category === 'Quantitative')
    .map((col) => {
      const values = getNumericValues(col.name)
      if (!values.length) {
        return {
          column: col.name,
          mean: 0,
          median: 0,
          min: 0,
          max: 0,
        }
      }

      const mean =
        values.reduce((sum, value) => sum + value, 0) / values.length

      return {
        column: col.name,
        mean: Number(mean.toFixed(2)),
        median: median(values),
        min: Math.min(...values),
        max: Math.max(...values),
      }
    })
})

const categoricalSummary = computed(() => {
  const cols = activeDatasetData.value?.columnSummary || []
  const rows = activeDatasetData.value?.previewRows || []

  return cols
    .filter((col) => col.category === 'Qualitative')
    .map((col) => {
      const values = rows
        .map((row) => row[col.name])
        .filter((value) => value !== '' && value !== null && value !== undefined)

      const frequencyMap = {}
      values.forEach((value) => {
        const key = String(value)
        frequencyMap[key] = (frequencyMap[key] || 0) + 1
      })

      let frequent = 'N/A'
      let highest = 0

      Object.entries(frequencyMap).forEach(([key, count]) => {
        if (count > highest) {
          highest = count
          frequent = key
        }
      })

      return {
        column: col.name,
        unique: new Set(values.map(String)).size,
        frequent,
        missing: col.missing,
      }
    })
})

const generatedInsights = computed(() => {
  const insights = []
  const dataset = activeDatasetData.value

  if (!dataset) return []

  insights.push(`Current dataset in focus is ${dataset.name}.`)
  insights.push(
    `The preview contains ${dataset.rows} rows and ${dataset.columns} columns.`
  )
  insights.push(
    `${dataset.qualitativeColumns || 0} columns are qualitative and ${dataset.quantitativeColumns || 0} are quantitative.`
  )

  if ((dataset.missingValues || 0) > 0) {
    insights.push(
      `The preview indicates ${dataset.missingValues} missing values that may need cleaning.`
    )
  } else {
    insights.push('No missing values were detected in the current preview sample.')
  }

  if (numericalSummary.value.length) {
    const widestRange = numericalSummary.value.reduce((best, current) => {
      const currentRange = current.max - current.min
      const bestRange = best.max - best.min
      return currentRange > bestRange ? current : best
    })

    insights.push(
      `${widestRange.column} shows the widest numeric spread in the preview sample.`
    )
  }

  if (categoricalSummary.value.length) {
    const richestCategory = categoricalSummary.value.reduce((best, current) =>
      current.unique > best.unique ? current : best
    )

    insights.push(
      `${richestCategory.column} has the highest variety among qualitative columns.`
    )
  }

  return insights
})

const stemLeafColumn = computed(() => {
  const firstNumeric = (activeDatasetData.value?.columnSummary || []).find(
    (col) => col.category === 'Quantitative'
  )
  return firstNumeric?.name || ''
})

const stemLeafText = computed(() => {
  if (!stemLeafColumn.value) return ''

  const values = getNumericValues(stemLeafColumn.value)
    .map((value) => Math.round(value))
    .sort((a, b) => a - b)

  if (!values.length) return ''

  const stems = {}

  values.forEach((value) => {
    const stem = Math.floor(value / 10)
    const leaf = Math.abs(value % 10)
    if (!stems[stem]) stems[stem] = []
    stems[stem].push(leaf)
  })

  return Object.entries(stems)
    .map(([stem, leaves]) => `${stem} | ${leaves.join(' ')}`)
    .join('\n')
})
</script>