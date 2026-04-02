import { reactive, computed } from 'vue'
import {
  datasetInfo,
  previewColumns,
  previewRows,
  mergedColumns,
  mergedRows,
} from '../data/mockData'

function inferColumnSummary(columns, rows) {
  return columns.map((col) => {
    const values = rows
      .map((row) => row[col])
      .filter((v) => v !== '' && v !== null && v !== undefined)

    const missing = rows.filter(
      (row) => row[col] === '' || row[col] === null || row[col] === undefined
    ).length

    let type = 'string'
    let category = 'Qualitative'

    if (values.length > 0) {
      const allNumbers = values.every((v) => !isNaN(Number(v)))
      if (allNumbers) {
        type = 'number'
        category = 'Quantitative'
      }
    }

    return {
      name: col,
      type,
      category,
      missing,
    }
  })
}

function countDuplicateRows(rows) {
  const seen = new Set()
  let duplicates = 0

  for (const row of rows) {
    const key = JSON.stringify(row)
    if (seen.has(key)) {
      duplicates += 1
    } else {
      seen.add(key)
    }
  }

  return duplicates
}

function buildDatasetStats(columns, rows) {
  const columnSummary = inferColumnSummary(columns, rows)

  const missingValues = columnSummary.reduce((sum, col) => sum + col.missing, 0)
  const qualitativeColumns = columnSummary.filter((col) => col.category === 'Qualitative').length
  const quantitativeColumns = columnSummary.filter((col) => col.category === 'Quantitative').length
  const duplicateRows = countDuplicateRows(rows)

  return {
    columnSummary,
    missingValues,
    duplicateRows,
    qualitativeColumns,
    quantitativeColumns,
  }
}

function median(values) {
  if (!values.length) return 0
  const sorted = [...values].sort((a, b) => a - b)
  const mid = Math.floor(sorted.length / 2)
  return sorted.length % 2 === 0
    ? (sorted[mid - 1] + sorted[mid]) / 2
    : sorted[mid]
}

function removeDuplicateRows(rows) {
  const seen = new Set()
  return rows.filter((row) => {
    const key = JSON.stringify(row)
    if (seen.has(key)) return false
    seen.add(key)
    return true
  })
}

function standardizeTextValue(value) {
  if (value === null || value === undefined) return value
  if (typeof value !== 'string') return value
  return value.trim().replace(/\s+/g, ' ')
}

function cleanRows(columns, rows, options) {
  let cleanedRows = [...rows]

  if (options.removeDuplicates) {
    cleanedRows = removeDuplicateRows(cleanedRows)
  }

  const summary = inferColumnSummary(columns, cleanedRows)
  const numericColumns = summary
    .filter((col) => col.category === 'Quantitative')
    .map((col) => col.name)

  const categoricalColumns = summary
    .filter((col) => col.category === 'Qualitative')
    .map((col) => col.name)

  const numericFillMap = {}
  numericColumns.forEach((col) => {
    const values = cleanedRows
      .map((row) => Number(row[col]))
      .filter((value) => !Number.isNaN(value))
    numericFillMap[col] = values.length ? median(values) : 0
  })

  const categoricalFillMap = {}
  categoricalColumns.forEach((col) => {
    const values = cleanedRows
      .map((row) => row[col])
      .filter((value) => value !== '' && value !== null && value !== undefined)
      .map((value) => String(value))

    const freq = {}
    values.forEach((value) => {
      freq[value] = (freq[value] || 0) + 1
    })

    let best = 'Unknown'
    let highest = 0

    Object.entries(freq).forEach(([key, count]) => {
      if (count > highest) {
        best = key
        highest = count
      }
    })

    categoricalFillMap[col] = best
  })

  cleanedRows = cleanedRows.map((row) => {
    const updatedRow = { ...row }

    columns.forEach((col) => {
      const currentValue = updatedRow[col]
      const isMissing =
        currentValue === '' || currentValue === null || currentValue === undefined

      if (options.fillNumeric && numericColumns.includes(col) && isMissing) {
        updatedRow[col] = numericFillMap[col]
      }

      if (options.fillCategorical && categoricalColumns.includes(col) && isMissing) {
        updatedRow[col] = categoricalFillMap[col]
      }

      if (options.standardizeText && typeof updatedRow[col] === 'string') {
        updatedRow[col] = standardizeTextValue(updatedRow[col])
      }
    })

    return updatedRow
  })

  return cleanedRows
}

const dataset2Columns = [
  'Client_ID',
  'Transaction_Date',
  'Transaction_Amount',
  'Portfolio_Value',
]

const dataset2Rows = [
  {
    Client_ID: 'C001',
    Transaction_Date: '2026-03-01',
    Transaction_Amount: 320,
    Portfolio_Value: 5400,
  },
  {
    Client_ID: 'C002',
    Transaction_Date: '2026-03-02',
    Transaction_Amount: 700,
    Portfolio_Value: 6100,
  },
]

const dataset1Stats = buildDatasetStats(previewColumns, previewRows)
const dataset2Stats = buildDatasetStats(dataset2Columns, dataset2Rows)
const cleanedStats = buildDatasetStats(previewColumns, previewRows)
const mergedStats = buildDatasetStats(mergedColumns, mergedRows)

const initialState = {
  activeDataset: 'dataset1',
  datasets: {
    dataset1: {
      id: 'dataset1',
      label: 'Dataset 1',
      name: datasetInfo.name,
      rows: datasetInfo.rows,
      columns: datasetInfo.columns,
      previewColumns,
      previewRows,
      ...dataset1Stats,
    },
    dataset2: {
      id: 'dataset2',
      label: 'Dataset 2',
      name: 'transactions.csv',
      rows: 120,
      columns: 4,
      previewColumns: dataset2Columns,
      previewRows: dataset2Rows,
      ...dataset2Stats,
    },
    cleanedDataset: {
      id: 'cleanedDataset',
      label: 'Cleaned Dataset',
      name: 'cleaned_clients.csv',
      rows: 118,
      columns: 6,
      previewColumns,
      previewRows,
      ...cleanedStats,
    },
    mergedDataset: {
      id: 'mergedDataset',
      label: 'Merged Dataset',
      name: 'merged_dataset.csv',
      rows: 118,
      columns: 9,
      previewColumns: mergedColumns,
      previewRows: mergedRows,
      ...mergedStats,
    },
  },

  selectedX: 'Age',
  selectedY: 'Income',
  selectedGraphType: 'Scatter Plot',
  selectedStemLeaf: 'Age',

  cleaningOptions: {
    removeDuplicates: true,
    fillNumeric: true,
    fillCategorical: true,
    standardizeText: false,
  },

    uploadStatus: {
    loading: false,
    error: '',
    success: '',
  },

  edaStatus: {
    hasRun: false,
    lastRunDataset: '',
  },
}

const state = reactive(JSON.parse(JSON.stringify(initialState)))

const activeDatasetData = computed(() => state.datasets[state.activeDataset])

const datasetOptions = computed(() =>
  Object.values(state.datasets).map((dataset) => ({
    label: dataset.label,
    value: dataset.id,
  }))
)

const activeColumns = computed(() => activeDatasetData.value?.previewColumns || [])

function setDatasetFromUpload(datasetKey, payload) {
  const stats = buildDatasetStats(payload.column_names || [], payload.preview || [])

  state.datasets[datasetKey] = {
    ...state.datasets[datasetKey],
    id: datasetKey,
    label: state.datasets[datasetKey].label,
    name: payload.filename,
    rows: payload.rows,
    columns: payload.columns,
    previewColumns: payload.column_names || [],
    previewRows: payload.preview || [],
    ...stats,
  }

  if (state.activeDataset === datasetKey) {
    const cols = payload.column_names || []
    state.selectedX = cols[0] || ''
    state.selectedY = cols[1] || cols[0] || ''
    state.selectedStemLeaf = cols[0] || ''
  }
}

function cleanActiveDataset() {
  const dataset = activeDatasetData.value
  const columns = dataset.previewColumns || []
  const rows = dataset.previewRows || []

  const cleanedRows = cleanRows(columns, rows, state.cleaningOptions)
  const stats = buildDatasetStats(columns, cleanedRows)

  state.datasets.cleanedDataset = {
    ...state.datasets.cleanedDataset,
    name: `cleaned_${dataset.name || 'dataset'}`,
    rows: cleanedRows.length,
    columns: columns.length,
    previewColumns: columns,
    previewRows: cleanedRows,
    ...stats,
  }

  state.activeDataset = 'cleanedDataset'

  const cols = columns || []
  state.selectedX = cols[0] || ''
  state.selectedY = cols[1] || cols[0] || ''
  state.selectedStemLeaf = cols[0] || ''

  state.uploadStatus.success = 'Data cleaned successfully'
  state.uploadStatus.error = ''
}

function resetDashboardState() {
  state.activeDataset = initialState.activeDataset
  state.datasets = JSON.parse(JSON.stringify(initialState.datasets))
  state.selectedX = initialState.selectedX
  state.selectedY = initialState.selectedY
  state.selectedGraphType = initialState.selectedGraphType
  state.selectedStemLeaf = initialState.selectedStemLeaf
  state.cleaningOptions = JSON.parse(JSON.stringify(initialState.cleaningOptions))
  state.uploadStatus = {
    loading: false,
    error: '',
    success: 'Dashboard reset successfully',
  }
}
function runEdaOnActiveDataset() {
  const dataset = activeDatasetData.value

  state.edaStatus = {
    hasRun: true,
    lastRunDataset: dataset.name || 'Unknown dataset',
  }

  state.uploadStatus.success = `EDA generated for ${dataset.name || 'active dataset'}`
  state.uploadStatus.error = ''
}

export function useDashboardState() {
  return {
    state,
    datasetOptions,
    activeDatasetData,
    activeColumns,
    setDatasetFromUpload,
    cleanActiveDataset,
    resetDashboardState,
    runEdaOnActiveDataset,
  }
}