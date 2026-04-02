<template>
  <aside class="sidebar hidden min-h-screen w-64 border-r border-white/10 lg:flex lg:flex-col">
    <div class="border-b border-white/10 px-5 py-5">
      <h1 class="text-xl font-bold tracking-tight">Dura Capital</h1>
      <p class="mt-1 text-xs text-white/80">Data Quality Control Dashboard</p>
    </div>

    <div class="flex-1 space-y-4 overflow-y-auto px-3 py-4">
      <section class="rounded-2xl border border-white/10 bg-white/5 p-3">
        <h3 class="mb-3 text-xs font-semibold uppercase tracking-wide text-white/90">
          Upload Data
        </h3>

        <label class="mb-2 block rounded-xl border border-dashed border-white/20 bg-white/5 p-3 text-xs">
          <span class="mb-2 block font-medium">Upload Dataset 1</span>
          <input
            type="file"
            accept=".csv,.xlsx,.xls"
            @change="handleUpload($event, 'dataset1')"
            class="block w-full text-[11px] text-white/80 file:mr-2 file:rounded-lg file:border-0 file:bg-secondary file:px-3 file:py-1.5 file:text-[11px] file:font-medium file:text-white"
          />
        </label>

        <label class="block rounded-xl border border-dashed border-white/20 bg-white/5 p-3 text-xs">
          <span class="mb-2 block font-medium">Upload Dataset 2</span>
          <input
            type="file"
            accept=".csv,.xlsx,.xls"
            @change="handleUpload($event, 'dataset2')"
            class="block w-full text-[11px] text-white/80 file:mr-2 file:rounded-lg file:border-0 file:bg-secondary file:px-3 file:py-1.5 file:text-[11px] file:font-medium file:text-white"
          />
        </label>

        <div v-if="state.uploadStatus.loading" class="mt-2 text-[11px] text-white/80">
          Uploading...
        </div>

        <div v-if="state.uploadStatus.success" class="mt-2 text-[11px] text-green-300">
          {{ state.uploadStatus.success }}
        </div>

        <div v-if="state.uploadStatus.error" class="mt-2 text-[11px] text-red-300">
          {{ state.uploadStatus.error }}
        </div>
      </section>

      <section class="rounded-2xl border border-white/10 bg-white/5 p-3">
        <h3 class="mb-3 text-xs font-semibold uppercase tracking-wide text-white/90">
          Dataset Settings
        </h3>

        <label class="mb-1 block text-xs text-white/80">Active Dataset</label>
        <select v-model="state.activeDataset" class="input bg-white text-primary">
          <option
            v-for="option in datasetOptions"
            :key="option.value"
            :value="option.value"
          >
            {{ option.label }}
          </option>
        </select>

        <div class="mt-3 space-y-1.5 text-xs text-white/80">
          <div><span class="font-semibold text-white">Rows:</span> {{ activeDatasetData?.rows ?? 0 }}</div>
          <div><span class="font-semibold text-white">Columns:</span> {{ activeDatasetData?.columns ?? 0 }}</div>
          <div><span class="font-semibold text-white">Name:</span> {{ activeDatasetData?.name ?? 'No dataset' }}</div>
        </div>
      </section>

      <section class="rounded-2xl border border-white/10 bg-white/5 p-3">
        <h3 class="mb-3 text-xs font-semibold uppercase tracking-wide text-white/90">
          Analysis Controls
        </h3>

        <label class="mb-1 block text-xs text-white/80">X Variable</label>
        <select v-model="state.selectedX" class="input mb-3 bg-white text-primary">
          <option v-for="col in activeColumns" :key="col" :value="col">
            {{ col }}
          </option>
        </select>

        <label class="mb-1 block text-xs text-white/80">Y Variable</label>
        <select v-model="state.selectedY" class="input mb-3 bg-white text-primary">
          <option v-for="col in activeColumns" :key="col" :value="col">
            {{ col }}
          </option>
        </select>

        <label class="mb-1 block text-xs text-white/80">Graph Type</label>
        <select v-model="state.selectedGraphType" class="input mb-3 bg-white text-primary">
          <option>Scatter Plot</option>
          <option>Bar Chart</option>
          <option>Line Chart</option>
          <option>Histogram</option>
          <option>Box Plot</option>
          <option>Pie Chart</option>
        </select>

        <label class="mb-1 block text-xs text-white/80">Stem-and-Leaf Column</label>
        <select v-model="state.selectedStemLeaf" class="input bg-white text-primary">
          <option v-for="col in activeColumns" :key="col" :value="col">
            {{ col }}
          </option>
        </select>
      </section>

      <section class="rounded-2xl border border-white/10 bg-white/5 p-3">
        <h3 class="mb-3 text-xs font-semibold uppercase tracking-wide text-white/90">
          Cleaning Options
        </h3>

        <div class="space-y-2 text-xs text-white/85">
          <label class="flex items-center gap-2.5">
            <input v-model="state.cleaningOptions.removeDuplicates" type="checkbox" class="h-3.5 w-3.5 rounded" />
            <span>Remove duplicates</span>
          </label>
          <label class="flex items-center gap-2.5">
            <input v-model="state.cleaningOptions.fillNumeric" type="checkbox" class="h-3.5 w-3.5 rounded" />
            <span>Fill missing numeric values</span>
          </label>
          <label class="flex items-center gap-2.5">
            <input v-model="state.cleaningOptions.fillCategorical" type="checkbox" class="h-3.5 w-3.5 rounded" />
            <span>Fill missing categorical values</span>
          </label>
          <label class="flex items-center gap-2.5">
            <input v-model="state.cleaningOptions.standardizeText" type="checkbox" class="h-3.5 w-3.5 rounded" />
            <span>Standardize text</span>
          </label>
        </div>
      </section>
    </div>

    <div class="border-t border-white/10 px-3 py-3">
      <div class="grid gap-2">
       <button class="btn btn-primary" @click="handleCleanData">Clean Data</button>
<button class="btn btn-secondary">Run EDA</button>
<button class="btn btn-danger" @click="handleReset">Reset</button>
      </div>
    </div>
  </aside>
</template>

<script setup>
import { useDashboardState } from '../composables/useDashboardState'
import { uploadDataset } from '../services/uploadService'

const {
  state,
  datasetOptions,
  activeDatasetData,
  activeColumns,
  setDatasetFromUpload,
  cleanActiveDataset,
  resetDashboardState,
} = useDashboardState()

async function handleUpload(event, datasetKey) {
  const file = event.target.files?.[0]
  if (!file) return

  state.uploadStatus.loading = true
  state.uploadStatus.error = ''
  state.uploadStatus.success = ''

  try {
    const data = await uploadDataset(file)

    state.activeDataset = datasetKey
    setDatasetFromUpload(datasetKey, data)
    state.uploadStatus.success = `${data.filename} uploaded successfully`
  } catch (err) {
    console.error('UPLOAD ERROR:', err)
    state.uploadStatus.error =
      err.response?.data?.detail || err.message || 'Upload failed'
  } finally {
    state.uploadStatus.loading = false
  }
}

function handleCleanData() {
  cleanActiveDataset()
}

function handleReset() {
  resetDashboardState()
}
</script>