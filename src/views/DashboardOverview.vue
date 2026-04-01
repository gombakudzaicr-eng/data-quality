<template>
  <section class="space-y-5">
    <div class="grid-6">
      <MetricCard label="Rows" :value="activeDatasetData.rows" />
      <MetricCard label="Columns" :value="activeDatasetData.columns" />
      <MetricCard label="Missing Values" :value="0" />
      <MetricCard label="Duplicate Rows" :value="0" />
      <MetricCard label="Qualitative Columns" :value="0" />
      <MetricCard label="Quantitative Columns" :value="0" />
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

        <div v-if="activeDatasetData.previewColumns.length" class="overflow-x-auto rounded-2xl border border-border">
          <table class="table min-w-full bg-white">
            <thead>
              <tr>
                <th>Column</th>
              </tr>
            </thead>
            <tbody>
              <tr
                v-for="column in activeDatasetData.previewColumns"
                :key="column"
                class="transition hover:bg-background"
              >
                <td>{{ column }}</td>
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
        <li>Current dataset: {{ activeDatasetData.name }}</li>
        <li>Rows: {{ activeDatasetData.rows }}</li>
        <li>Columns: {{ activeDatasetData.columns }}</li>
      </ul>
    </div>
  </section>
</template>

<script setup>
import MetricCard from '../components/MetricCard.vue'
import DataTable from '../components/DataTable.vue'
import { useDashboardState } from '../composables/useDashboardState'

const { activeDatasetData } = useDashboardState()
</script>