
<template>
  <section class="space-y-6">
    <div class="grid-2">
      <div class="card">
        <div class="card-header">
          <div>
            <h3 class="text-lg font-semibold text-primary">Export Options</h3>
            <p class="mt-1 text-sm text-textSecondary">
              Download preview data and generated summaries from the dashboard
            </p>
          </div>
        </div>

        <div class="grid gap-4">
          <button class="btn btn-primary" @click="downloadActiveDatasetCsv">
            Download Active Dataset CSV
          </button>

          <button class="btn btn-secondary" @click="downloadMergedDatasetCsv">
            Download Merged Dataset CSV
          </button>

          <button class="btn btn-accent" @click="downloadSummaryReport">
            Download Summary Report
          </button>

          <button class="btn btn-warning" @click="copyReportToClipboard">
            Copy Report Text
          </button>
        </div>

        <div v-if="actionMessage" class="mt-4 rounded-2xl border border-border bg-background p-3 text-sm text-primary">
          {{ actionMessage }}
        </div>
      </div>

      <div class="card">
        <div class="card-header">
          <div>
            <h3 class="text-lg font-semibold text-primary">Generated Report</h3>
            <p class="mt-1 text-sm text-textSecondary">
              Auto-generated summary based on the active dataset
            </p>
          </div>
        </div>

        <textarea
          class="h-80 w-full rounded-2xl border border-border bg-background p-4 text-sm text-primary outline-none"
          readonly
          :value="reportText"
        />
      </div>
    </div>
  </section>
</template>

<script setup>
import { computed, ref } from 'vue'
import { useDashboardState } from '../composables/useDashboardState'

const { state, activeDatasetData } = useDashboardState()
const actionMessage = ref('')

function escapeCsvValue(value) {
  if (value === null || value === undefined) return ''
  const stringValue = String(value)

  if (
    stringValue.includes(',') ||
    stringValue.includes('"') ||
    stringValue.includes('\n')
  ) {
    return `"${stringValue.replace(/"/g, '""')}"`
  }

  return stringValue
}

function convertRowsToCsv(columns, rows) {
  const header = columns.join(',')
  const body = rows.map((row) =>
    columns.map((column) => escapeCsvValue(row[column])).join(',')
  )

  return [header, ...body].join('\n')
}

function downloadFile(filename, content, type = 'text/plain;charset=utf-8;') {
  const blob = new Blob([content], { type })
  const url = URL.createObjectURL(blob)

  const link = document.createElement('a')
  link.href = url
  link.download = filename
  document.body.appendChild(link)
  link.click()
  document.body.removeChild(link)

  URL.revokeObjectURL(url)
}

const reportText = computed(() => {
  const dataset = activeDatasetData.value
  const merged = state.datasets.mergedDataset
  const columnSummary = dataset.columnSummary || []

  const qualitativeColumns = dataset.qualitativeColumns || 0
  const quantitativeColumns = dataset.quantitativeColumns || 0
  const missingValues = dataset.missingValues || 0
  const duplicateRows = dataset.duplicateRows || 0

  const summaryLines = columnSummary.length
    ? columnSummary.map(
        (item) =>
          `- ${item.name}: ${item.type}, ${item.category}, missing=${item.missing}`
      )
    : ['- No column summary available']

  return `Dura Capital - Data Quality Report

Active Dataset: ${dataset.name}
Rows: ${dataset.rows}
Columns: ${dataset.columns}

Data Quality Snapshot:
- Missing Values: ${missingValues}
- Duplicate Rows: ${duplicateRows}
- Qualitative Columns: ${qualitativeColumns}
- Quantitative Columns: ${quantitativeColumns}

Column Summary:
${summaryLines.join('\n')}

Merge Snapshot:
- Merged Dataset Name: ${merged.name}
- Merged Rows: ${merged.rows}
- Merged Columns: ${merged.columns}

Selected Visualization Settings:
- X Variable: ${state.selectedX || 'Not selected'}
- Y Variable: ${state.selectedY || 'Not selected'}
- Graph Type: ${state.selectedGraphType || 'Not selected'}
- Stem-and-Leaf Column: ${state.selectedStemLeaf || 'Not selected'}
`
})

function downloadActiveDatasetCsv() {
  const dataset = activeDatasetData.value
  const columns = dataset.previewColumns || []
  const rows = dataset.previewRows || []

  if (!columns.length || !rows.length) {
    actionMessage.value = 'No active dataset preview available to export.'
    return
  }

  const csv = convertRowsToCsv(columns, rows)
  const filename = `${dataset.name || 'active_dataset'}_preview.csv`
  downloadFile(filename, csv, 'text/csv;charset=utf-8;')
  actionMessage.value = `Downloaded ${filename}`
}

function downloadMergedDatasetCsv() {
  const dataset = state.datasets.mergedDataset
  const columns = dataset.previewColumns || []
  const rows = dataset.previewRows || []

  if (!columns.length || !rows.length) {
    actionMessage.value = 'No merged dataset preview available to export.'
    return
  }

  const csv = convertRowsToCsv(columns, rows)
  const filename = `${dataset.name || 'merged_dataset'}_preview.csv`
  downloadFile(filename, csv, 'text/csv;charset=utf-8;')
  actionMessage.value = `Downloaded ${filename}`
}

function downloadSummaryReport() {
  const safeName = (activeDatasetData.value.name || 'dataset').replace(/\.[^/.]+$/, '')
  const filename = `${safeName}_summary_report.txt`
  downloadFile(filename, reportText.value)
  actionMessage.value = `Downloaded ${filename}`
}

async function copyReportToClipboard() {
  try {
    await navigator.clipboard.writeText(reportText.value)
    actionMessage.value = 'Report copied to clipboard.'
  } catch (error) {
    actionMessage.value = 'Could not copy report automatically.'
  }
}
</script>