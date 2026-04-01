
<template>
  <section class="space-y-6">
    <div class="card">
      <div class="card-header">
        <h3 class="text-lg font-semibold text-primary">Existing Key Detection</h3>
      </div>

      <div class="overflow-x-auto rounded-2xl border border-border">
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
              <td>{{ item.unique }}</td>
              <td>{{ item.nulls }}</td>
              <td>
                <span
                  class="rounded-full px-3 py-1 text-xs font-semibold"
                  :class="item.suitable === 'Yes' ? 'bg-accent text-white' : 'bg-warning text-white'"
                >
                  {{ item.suitable }}
                </span>
              </td>
            </tr>
          </tbody>
        </table>
      </div>
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
              <option>Client_ID</option>
              <option>Name</option>
              <option>Age</option>
            </select>
          </div>

          <div v-if="method === 'Combine Columns'">
            <label class="mb-2 block text-sm font-medium text-textSecondary">Combine Columns</label>
            <select class="input" multiple>
              <option>Client_ID</option>
              <option>Name</option>
              <option>Location</option>
            </select>
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
        </div>
      </div>
    </div>
  </section>
</template>

<script setup>
import { ref } from 'vue'
import { keyCandidates } from '../data/mockData'

const method = ref('Use Existing Column')
const selectedColumn = ref('Client_ID')
const keyName = ref('Primary_Key')

const validation = ref({
  status: 'Not yet generated',
  uniqueness: '0%',
  duplicates: 0,
  nulls: 0,
})

const generateKey = () => {
  validation.value = {
    status: `${keyName.value} generated successfully`,
    uniqueness: '100%',
    duplicates: 0,
    nulls: 0,
  }
}
</script>[]