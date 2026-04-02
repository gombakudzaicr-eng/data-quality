
<template>
  <section class="space-y-6">
    <div class="grid-2">
      <div class="card">
        <div class="card-header">
          <div>
            <h3 class="text-lg font-semibold text-primary">Merge Controls</h3>
            <p class="mt-1 text-sm text-textSecondary">
              Combine Dataset 1 and Dataset 2 using selected key columns
            </p>
          </div>
        </div>

        <div class="space-y-4">
          <div>
            <label class="mb-2 block text-sm font-medium text-textSecondary">Merge Type</label>
            <select v-model="mergeType" class="input">
              <option>Inner Join</option>
              <option>Left Join</option>
              <option>Right Join</option>
              <option>Outer Join</option>
            </select>
          </div>

          <div>
            <label class="mb-2 block text-sm font-medium text-textSecondary">Dataset 1 Key</label>
            <select v-model="dataset1Key" class="input">
              <option v-for="col in dataset1.previewColumns" :key="col" :value="col">
                {{ col }}
              </option>
            </select>
          </div>

          <div>
            <label class="mb-2 block text-sm font-medium text-textSecondary">Dataset 2 Key</label>
            <select v-model="dataset2Key" class="input">
              <option v-for="col in dataset2.previewColumns" :key="col" :value="col">
                {{ col }}
              </option>
            </select>
          </div>

          <button class="btn btn-primary" @click="runMerge">
            Run Merge
          </button>
        </div>
      </div>

      <div class="card">
        <div class="card-header">
          <h3 class="text-lg font-semibold text-primary">Merge Summary</h3>
        </div>

        <div class="space-y-4">
          <div class="rounded-2xl border border-border bg-background p-4">
            <p class="text-sm text-textSecondary">Status</p>
            <p class="mt-1 text-lg font-semibold text-primary">{{ mergeSummary.status }}</p>
          </div>

          <div class="grid grid-cols-1 gap-4 md:grid-cols-3">
            <div class="rounded-2xl border border-border bg-background p-4">
              <p class="text-sm text-textSecondary">Type</p>
              <p class="mt-1 font-semibold text-primary">{{ mergeSummary.type }}</p>
            </div>

            <div class="rounded-2xl border border-border bg-background p-4">
              <p class="text-sm text-textSecondary">Matched Rows</p>
              <p class="mt-1 font-semibold text-primary">{{ mergeSummary.matched }}</p>
            </div>

            <div class="rounded-2xl border border-border bg-background p-4">
              <p class="text-sm text-textSecondary">Output Rows</p>
              <p class="mt-1 font-semibold text-primary">{{ mergeSummary.output }}</p>
            </div>
          </div>
        </div>
      </div>
    </div>

    <div class="card">
      <div class="card-header">
        <div>
          <h3 class="text-lg font-semibold text-primary">Merged Dataset Preview</h3>
          <p class="mt-1 text-sm text-textSecondary">
            Preview of the merged rows generated from the selected join
          </p>
        </div>
      </div>

      <DataTable
        v-if="mergedColumns.length && mergedRows.length"
        :columns="mergedColumns"
        :rows="mergedRows"
      />

      <p v-else class="text-sm text-textSecondary">
        Run a merge to preview the merged dataset.
      </p>
    </div>
  </section>
</template>

<script setup>
import { computed, ref, watch } from 'vue'
import DataTable from '../components/DataTable.vue'
import { useDashboardState } from '../composables/useDashboardState'

const { state } = useDashboardState()

const mergeType = ref('Inner Join')
const dataset1Key = ref('')
const dataset2Key = ref('')

const mergeSummary = ref({
  status: 'No merge has been run yet',
  type: '-',
  matched: 0,
  output: 0,
})

const dataset1 = computed(() => state.datasets.dataset1)
const dataset2 = computed(() => state.datasets.dataset2)

watch(
  () => dataset1.value.previewColumns,
  (cols) => {
    if (cols?.length && !dataset1Key.value) {
      dataset1Key.value = cols[0]
    }
  },
  { immediate: true }
)

watch(
  () => dataset2.value.previewColumns,
  (cols) => {
    if (cols?.length && !dataset2Key.value) {
      dataset2Key.value = cols[0]
    }
  },
  { immediate: true }
)

function normalizeKey(value) {
  if (value === '' || value === null || value === undefined) return null
  return String(value)
}

function buildLookup(rows, key) {
  const map = new Map()

  rows.forEach((row) => {
    const value = normalizeKey(row[key])
    if (value === null) return

    if (!map.has(value)) {
      map.set(value, [])
    }

    map.get(value).push(row)
  })

  return map
}

function mergeRowObjects(leftRow, rightRow) {
  return {
    ...leftRow,
    ...rightRow,
  }
}

function emptyObjectFromColumns(columns) {
  const obj = {}
  columns.forEach((col) => {
    obj[col] = null
  })
  return obj
}

const mergedRows = ref([])
const mergedColumns = ref([])

function runMerge() {
  const rows1 = dataset1.value.previewRows || []
  const rows2 = dataset2.value.previewRows || []

  if (!rows1.length || !rows2.length) {
    mergeSummary.value = {
      status: 'Both datasets need preview rows before merging',
      type: mergeType.value,
      matched: 0,
      output: 0,
    }
    mergedRows.value = []
    mergedColumns.value = []
    return
  }

  const lookup2 = buildLookup(rows2, dataset2Key.value)
  const output = []
  let matched = 0

  const rightEmpty = emptyObjectFromColumns(dataset2.value.previewColumns)
  const leftEmpty = emptyObjectFromColumns(dataset1.value.previewColumns)

  if (mergeType.value === 'Inner Join' || mergeType.value === 'Left Join') {
    rows1.forEach((leftRow) => {
      const leftKeyValue = normalizeKey(leftRow[dataset1Key.value])
      const matches = leftKeyValue ? lookup2.get(leftKeyValue) || [] : []

      if (matches.length) {
        matched += matches.length
        matches.forEach((rightRow) => {
          output.push(mergeRowObjects(leftRow, rightRow))
        })
      } else if (mergeType.value === 'Left Join') {
        output.push(mergeRowObjects(leftRow, rightEmpty))
      }
    })
  }

  if (mergeType.value === 'Right Join') {
    const lookup1 = buildLookup(rows1, dataset1Key.value)

    rows2.forEach((rightRow) => {
      const rightKeyValue = normalizeKey(rightRow[dataset2Key.value])
      const matches = rightKeyValue ? lookup1.get(rightKeyValue) || [] : []

      if (matches.length) {
        matched += matches.length
        matches.forEach((leftRow) => {
          output.push(mergeRowObjects(leftRow, rightRow))
        })
      } else {
        output.push(mergeRowObjects(leftEmpty, rightRow))
      }
    })
  }

  if (mergeType.value === 'Outer Join') {
    const lookup1 = buildLookup(rows1, dataset1Key.value)
    const matchedKeys = new Set()

    rows1.forEach((leftRow) => {
      const leftKeyValue = normalizeKey(leftRow[dataset1Key.value])
      const matches = leftKeyValue ? lookup2.get(leftKeyValue) || [] : []

      if (matches.length) {
        matched += matches.length
        matchedKeys.add(leftKeyValue)
        matches.forEach((rightRow) => {
          output.push(mergeRowObjects(leftRow, rightRow))
        })
      } else {
        output.push(mergeRowObjects(leftRow, rightEmpty))
      }
    })

    rows2.forEach((rightRow) => {
      const rightKeyValue = normalizeKey(rightRow[dataset2Key.value])
      if (!matchedKeys.has(rightKeyValue)) {
        output.push(mergeRowObjects(leftEmpty, rightRow))
      }
    })
  }

  mergedRows.value = output
  mergedColumns.value = output.length
    ? Object.keys(output[0])
    : [...dataset1.value.previewColumns, ...dataset2.value.previewColumns]

  state.datasets.mergedDataset = {
    ...state.datasets.mergedDataset,
    name: 'merged_dataset_preview',
    rows: output.length,
    columns: mergedColumns.value.length,
    previewColumns: mergedColumns.value,
    previewRows: output,
  }

  mergeSummary.value = {
    status: `Merge completed using ${dataset1Key.value} and ${dataset2Key.value}`,
    type: mergeType.value,
    matched,
    output: output.length,
  }
}
</script>