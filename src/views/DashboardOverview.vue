<template>
  <section class="space-y-5">
    <div class="grid-6">
      <MetricCard label="Rows" :value="activeDatasetData.rows" />
      <MetricCard label="Columns" :value="activeDatasetData.columns" />
      <MetricCard label="Missing Values" :value="activeDatasetData.missingValues || 0" />
      <MetricCard label="Duplicate Rows" :value="activeDatasetData.duplicateRows || 0" />
      <MetricCard label="Qualitative Columns" :value="activeDatasetData.qualitativeColumns || 0" />
      <MetricCard label="Quantitative Columns" :value="activeDatasetData.quantitativeColumns || 0" />
    </div>

    <div class="grid-2">
      <div class="card">
        <div class="card-header">
          <div>
            <h3 class="text-base font-semibold text-primary">Dataset Preview</h3>
            <p class="mt-1 text-xs text-textSecondary">{{ activeDatasetData.name }}</p>
          </div>
        </div>

        <DataTable
          :columns="activeDatasetData.previewColumns"
          :rows="activeDatasetData.previewRows"
        />
      </div>

      <div class="card">
        <div class="card-header">
          <h3 class="text-base font-semibold text-primary">Column Type Summary</h3>
        </div>

        <div
          v-if="activeDatasetData.previewColumns.length"
          class="overflow-x-auto rounded-2xl border border-border"
        >
          <table class="table min-w-full bg-white">
            <thead>
              <tr>
                <th>Column</th>
                <th>Type</th>
                <th>Category</th>
                <th>Missing</th>
              </tr>
            </thead>
            <tbody>
              <tr
                v-for="item in activeDatasetData.columnSummary || []"
                :key="item.name"
                class="transition hover:bg-background"
              >
                <td>{{ item.name }}</td>
                <td>{{ item.type }}</td>
                <td>{{ item.category }}</td>
                <td>{{ item.missing }}</td>
              </tr>
            </tbody>
          </table>
        </div>

        <p v-else class="text-sm text-textSecondary">
          No dataset uploaded yet.
        </p>
      </div>
    </div>

    <div class="card">
      <div class="card-header">
        <h3 class="text-base font-semibold text-primary">Quick Insights</h3>
      </div>

      <ul class="insight-list">
        <li v-for="(item, index) in generatedInsights" :key="index">
          {{ item }}
        </li>
      </ul>
    </div>
  </section>
</template>

<script setup>
import { computed } from 'vue'
import MetricCard from '../components/MetricCard.vue'
import DataTable from '../components/DataTable.vue'
import { useDashboardState } from '../composables/useDashboardState'

const { activeDatasetData } = useDashboardState()

const generatedInsights = computed(() => {
  const dataset = activeDatasetData.value
  const insights = []

  if (!dataset) {
    return ['No dataset is currently active.']
  }

  insights.push(`Current dataset: ${dataset.name}.`)
  insights.push(`The dataset preview contains ${dataset.rows} rows and ${dataset.columns} columns.`)

  if ((dataset.missingValues || 0) > 0) {
    insights.push(`There are ${dataset.missingValues} missing values in the preview sample.`)
  } else {
    insights.push('No missing values were detected in the current preview sample.')
  }

  if ((dataset.duplicateRows || 0) > 0) {
    insights.push(`There are ${dataset.duplicateRows} duplicate rows in the preview sample.`)
  } else {
    insights.push('No duplicate rows were detected in the current preview sample.')
  }

  insights.push(
    `${dataset.qualitativeColumns || 0} columns are qualitative and ${dataset.quantitativeColumns || 0} are quantitative.`
  )

  const numericColumns = (dataset.columnSummary || []).filter(
    (col) => col.category === 'Quantitative'
  )
  if (numericColumns.length) {
    insights.push(
      `The dataset is ready for statistical analysis using ${numericColumns
        .map((col) => col.name)
        .join(', ')}.`
    )
  }

  const missingColumns = (dataset.columnSummary || []).filter((col) => col.missing > 0)
  if (missingColumns.length) {
    insights.push(
      `Columns needing attention for missing data include ${missingColumns
        .map((col) => col.name)
        .join(', ')}.`
    )
  }

  return insights
})
</script>