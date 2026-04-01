
<template>
  <section class="space-y-6">
    <div class="grid-2">
      <div class="card">
        <div class="card-header">
          <h3 class="text-lg font-semibold text-primary">Merge Controls</h3>
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
              <option>Client_ID</option>
              <option>Name</option>
            </select>
          </div>

          <div>
            <label class="mb-2 block text-sm font-medium text-textSecondary">Dataset 2 Key</label>
            <select v-model="dataset2Key" class="input">
              <option>Client_ID</option>
              <option>Transaction_ID</option>
            </select>
          </div>

          <button class="btn btn-primary" @click="runMerge">Run Merge</button>
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
              <p class="text-sm text-textSecondary">Unmatched Rows</p>
              <p class="mt-1 font-semibold text-primary">{{ mergeSummary.unmatched }}</p>
            </div>
          </div>
        </div>
      </div>
    </div>

    <div class="card">
      <div class="card-header">
        <h3 class="text-lg font-semibold text-primary">Merged Dataset Preview</h3>
      </div>

      <DataTable :columns="mergedColumns" :rows="mergedRows" />
    </div>
  </section>
</template>

<script setup>
import { ref } from 'vue'
import DataTable from '../components/DataTable.vue'
import { mergedColumns, mergedRows } from '../data/mockData'

const mergeType = ref('Inner Join')
const dataset1Key = ref('Client_ID')
const dataset2Key = ref('Client_ID')

const mergeSummary = ref({
  status: 'Merge ready',
  type: 'Inner Join',
  matched: 118,
  unmatched: 2,
})

const runMerge = () => {
  mergeSummary.value = {
    status: `Merged using ${dataset1Key.value} and ${dataset2Key.value}`,
    type: mergeType.value,
    matched: 118,
    unmatched: 2,
  }
}
</script>