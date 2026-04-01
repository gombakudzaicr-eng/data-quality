import { reactive, computed } from 'vue'
import {
  datasetInfo,
  previewColumns,
  previewRows,
  mergedColumns,
  mergedRows,
} from '../data/mockData'

const state = reactive({
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
    },
    dataset2: {
      id: 'dataset2',
      label: 'Dataset 2',
      name: 'transactions.csv',
      rows: 120,
      columns: 4,
      previewColumns: ['Client_ID', 'Transaction_Date', 'Transaction_Amount', 'Portfolio_Value'],
      previewRows: [
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
      ],
    },
    cleanedDataset: {
      id: 'cleanedDataset',
      label: 'Cleaned Dataset',
      name: 'cleaned_clients.csv',
      rows: 118,
      columns: 6,
      previewColumns,
      previewRows,
    },
    mergedDataset: {
      id: 'mergedDataset',
      label: 'Merged Dataset',
      name: 'merged_dataset.csv',
      rows: 118,
      columns: 9,
      previewColumns: mergedColumns,
      previewRows: mergedRows,
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
})

const activeDatasetData = computed(() => state.datasets[state.activeDataset])

const datasetOptions = computed(() =>
  Object.values(state.datasets).map((dataset) => ({
    label: dataset.label,
    value: dataset.id,
  }))
)

const activeColumns = computed(() => activeDatasetData.value?.previewColumns || [])

function setDatasetFromUpload(datasetKey, payload) {
  state.datasets[datasetKey] = {
    ...state.datasets[datasetKey],
    id: datasetKey,
    label: state.datasets[datasetKey].label,
    name: payload.filename,
    rows: payload.rows,
    columns: payload.columns,
    previewColumns: payload.column_names || [],
    previewRows: payload.preview || [],
  }

  if (state.activeDataset === datasetKey) {
    const cols = payload.column_names || []
    state.selectedX = cols[0] || ''
    state.selectedY = cols[1] || cols[0] || ''
    state.selectedStemLeaf = cols[0] || ''
  }
}

export function useDashboardState() {
  return {
    state,
    datasetOptions,
    activeDatasetData,
    activeColumns,
    setDatasetFromUpload,
  }
}