
<template>
  <section class="space-y-6">
    <div class="card">
      <div class="card-header">
        <div>
          <h3 class="text-lg font-semibold text-primary">Existing Key Detection</h3>
          <p class="mt-1 text-sm text-textSecondary">
            Detecting likely primary key candidates from the active dataset preview
          </p>
        </div>
      </div>

      <div
        v-if="keyCandidates.length"
        class="overflow-x-auto rounded-2xl border border-border"
      >
        <table class="table min-w-full bg-white">
          <thead>
            <tr>
              <th>Column</th>
              <th>Unique?</th>
              <th>Nulls</th>
              <th>Suitable as Key?</th>
            </tr>
          </thead>
          <tbody>
            <tr
              v-for="item in keyCandidates"
              :key="item.column"
              class="transition hover:bg-background"
            >
              <td>{{ item.column }}</td>
              <td>{{ item.unique ? 'Yes' : 'No' }}</td>
              <td>{{ item.nulls }}</td>
              <td>
                <span
                  class="rounded-full px-3 py-1 text-xs font-semibold"
                  :class="item.suitable ? 'bg-accent text-white' : 'bg-warning text-white'"
                >
                  {{ item.suitable ? 'Yes' : 'No' }}
                </span>
              </td>
            </tr>
          </tbody>
        </table>
      </div>

      <p v-else class="text-sm text-textSecondary">
        No columns available yet. Upload a dataset first.
      </p>
    </div>

    <div class="grid-2">
      <div class="card">
        <div class="card-header">
          <h3 class="text-lg font-semibold text-primary">Generate Primary Key</h3>
        </div>

        <div class="space-y-4">
          <div>
            <label class="mb-2 block text-sm font-medium text-textSecondary">Method</label>
            <select v-model="method" class="input">
              <option>Use Existing Column</option>
              <option>Combine Columns</option>
              <option>Auto-Generate Sequential ID</option>
            </select>
          </div>

          <div v-if="method === 'Use Existing Column'">
            <label class="mb-2 block text-sm font-medium text-textSecondary">Select Key Column</label>
            <select v-model="selectedColumn" class="input">
              <option v-for="col in activeDatasetData.previewColumns" :key="col" :value="col">
                {{ col }}
              </option>
            </select>
          </div>

          <div v-if="method === 'Combine Columns'">
            <label class="mb-2 block text-sm font-medium text-textSecondary">Combine Columns</label>
            <div class="grid gap-2">
              <label
                v-for="col in activeDatasetData.previewColumns"
                :key="col"
                class="flex items-center gap-2 rounded-xl border border-border bg-background px-3 py-2 text-sm"
              >
                <input
                  type="checkbox"
                  :value="col"
                  v-model="selectedColumns"
                />
                <span>{{ col }}</span>
              </label>
            </div>
          </div>

          <div>
            <label class="mb-2 block text-sm font-medium text-textSecondary">Key Name</label>
            <input v-model="keyName" type="text" class="input" />
          </div>

          <button class="btn btn-primary" @click="generateKey">
            Generate Key
          </button>
        </div>
      </div>

      <div class="card">
        <div class="card-header">
          <h3 class="text-lg font-semibold text-primary">Validation Result</h3>
        </div>

        <div class="space-y-4">
          <div class="rounded-2xl border border-border bg-background p-4">
            <p class="text-sm text-textSecondary">Status</p>
            <p class="mt-1 text-lg font-semibold text-primary">{{ validation.status }}</p>
          </div>

          <div class="grid grid-cols-1 gap-4 md:grid-cols-3">
            <div class="rounded-2xl border border-border bg-background p-4">
              <p class="text-sm text-textSecondary">Uniqueness Rate</p>
              <p class="mt-1 text-xl font-bold text-primary">{{ validation.uniqueness }}</p>
            </div>

            <div class="rounded-2xl border border-border bg-background p-4">
              <p class="text-sm text-textSecondary">Duplicate Count</p>
              <p class="mt-1 text-xl font-bold text-primary">{{ validation.duplicates }}</p>
            </div>

            <div class="rounded-2xl border border-border bg-background p-4">
              <p class="text-sm text-textSecondary">Null Count</p>
              <p class="mt-1 text-xl font-bold text-primary">{{ validation.nulls }}</p>
            </div>
          </div>

          <div v-if="validation.preview.length" class="rounded-2xl border border-border bg-background p-4">
            <p class="mb-2 text-sm text-textSecondary">Generated Key Preview</p>
            <div class="flex flex-wrap gap-2">
              <span
                v-for="(item, index) in validation.preview"
                :key="index"
                class="badge badge-primary"
              >
                {{ item }}
              </span>
            </div>
          </div>
        </div>
      </div>
    </div>
  </section>
</template>

<script setup>
import { computed, ref, watch } from 'vue'
import { useDashboardState } from '../composables/useDashboardState'

const { activeDatasetData } = useDashboardState()

const method = ref('Use Existing Column')
const selectedColumn = ref('')
const selectedColumns = ref([])
const keyName = ref('Primary_Key')

const validation = ref({
  status: 'Not yet generated',
  uniqueness: '0%',
  duplicates: 0,
  nulls: 0,
  preview: [],
})

watch(
  () => activeDatasetData.value?.previewColumns,
  (cols) => {
    if (cols?.length) {
      selectedColumn.value = cols[0]
    }
  },
  { immediate: true }
)

const keyCandidates = computed(() => {
  const rows = activeDatasetData.value?.previewRows || []
  const columns = activeDatasetData.value?.previewColumns || []

  return columns.map((column) => {
    const values = rows.map((row) => row[column])
    const nulls = values.filter(
      (value) => value === '' || value === null || value === undefined
    ).length

    const normalized = values
      .filter((value) => value !== '' && value !== null && value !== undefined)
      .map((value) => String(value))

    const uniqueCount = new Set(normalized).size
    const unique = normalized.length > 0 && uniqueCount === normalized.length
    const suitable = unique && nulls === 0

    return {
      column,
      unique,
      nulls,
      suitable,
    }
  })
})

function generateExistingColumnKey(column) {
  const values = (activeDatasetData.value?.previewRows || []).map((row) => row[column])
  return values.map((value) =>
    value === '' || value === null || value === undefined ? null : String(value)
  )
}

function generateCombinedKey(columns) {
  const rows = activeDatasetData.value?.previewRows || []

  return rows.map((row) => {
    const parts = columns.map((col) => row[col])

    if (parts.some((value) => value === '' || value === null || value === undefined)) {
      return null
    }

    return parts.map((value) => String(value)).join('_')
  })
}

function generateSequentialKey() {
  const rows = activeDatasetData.value?.previewRows || []
  return rows.map((_, index) => `${keyName.value}_${index + 1}`)
}

function validateGeneratedValues(values) {
  const nulls = values.filter((value) => value === null).length
  const validValues = values.filter((value) => value !== null)
  const uniqueCount = new Set(validValues).size
  const duplicates = validValues.length - uniqueCount
  const uniquenessRate =
    validValues.length === 0 ? 0 : Math.round((uniqueCount / validValues.length) * 100)

  return {
    nulls,
    duplicates,
    uniqueness: `${uniquenessRate}%`,
    preview: values.slice(0, 8).map((value) => value ?? 'NULL'),
  }
}

function generateKey() {
  let generatedValues = []

  if (method.value === 'Use Existing Column') {
    generatedValues = generateExistingColumnKey(selectedColumn.value)
  } else if (method.value === 'Combine Columns') {
    generatedValues = generateCombinedKey(selectedColumns.value)
  } else {
    generatedValues = generateSequentialKey()
  }

  const result = validateGeneratedValues(generatedValues)

  let status = `${keyName.value} generated`
  if (result.nulls > 0) {
    status = `${keyName.value} generated with null values`
  } else if (result.duplicates > 0) {
    status = `${keyName.value} generated but is not fully unique`
  } else {
    status = `${keyName.value} is a strong primary key candidate`
  }

  validation.value = {
    status,
    uniqueness: result.uniqueness,
    duplicates: result.duplicates,
    nulls: result.nulls,
    preview: result.preview,
  }
}
</script>