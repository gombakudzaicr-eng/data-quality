<template>
  <section class="space-y-6">
    <div class="card">
      <div class="card-header">
        <h3 class="text-lg font-semibold text-primary">Data Quality Score</h3>
        <span class="badge badge-secondary">
          {{ activeDatasetData.quality?.quality_score ?? 0 }}%
        </span>
      </div>

      <div class="flex flex-col gap-4">
        <div class="progress-track">
          <div
            class="progress-fill"
            :style="{ width: `${activeDatasetData.quality?.quality_score ?? 0}%` }"
          ></div>
        </div>

        <div class="grid grid-cols-1 gap-4 md:grid-cols-2 xl:grid-cols-4">
          <div class="rounded-2xl border border-border bg-background p-4">
            <div class="text-sm text-textSecondary">Completeness</div>
            <div class="mt-1 text-2xl font-bold text-primary">
              {{ activeDatasetData.quality?.completeness ?? 0 }}%
            </div>
          </div>

          <div class="rounded-2xl border border-border bg-background p-4">
            <div class="text-sm text-textSecondary">Uniqueness</div>
            <div class="mt-1 text-2xl font-bold text-primary">
              {{ activeDatasetData.quality?.uniqueness ?? 0 }}%
            </div>
          </div>

          <div class="rounded-2xl border border-border bg-background p-4">
            <div class="text-sm text-textSecondary">Consistency</div>
            <div class="mt-1 text-2xl font-bold text-primary">
              {{ activeDatasetData.quality?.consistency ?? 0 }}%
            </div>
          </div>

          <div class="rounded-2xl border border-border bg-background p-4">
            <div class="text-sm text-textSecondary">Validity</div>
            <div class="mt-1 text-2xl font-bold text-primary">
              {{ activeDatasetData.quality?.validity ?? 0 }}%
            </div>
          </div>
        </div>
      </div>
    </div>

    <div class="card">
      <div class="card-header">
        <h3 class="text-lg font-semibold text-primary">Detected Issues</h3>
      </div>

      <div
        v-if="activeDatasetData.quality?.issues?.length"
        class="overflow-x-auto rounded-2xl border border-border"
      >
        <table class="table min-w-full bg-white">
          <thead>
            <tr>
              <th>Column</th>
              <th>Issue Type</th>
              <th>Severity</th>
              <th>Recommendation</th>
            </tr>
          </thead>
          <tbody>
            <tr
              v-for="(item, index) in activeDatasetData.quality.issues"
              :key="index"
              class="transition hover:bg-background"
            >
              <td>{{ item.column }}</td>
              <td>{{ item.issue_type }}</td>
              <td>
                <span
                  class="rounded-full px-3 py-1 text-xs font-semibold"
                  :class="severityClass(item.severity)"
                >
                  {{ item.severity }}
                </span>
              </td>
              <td>{{ item.recommendation }}</td>
            </tr>
          </tbody>
        </table>
      </div>

      <p v-else class="text-sm text-textSecondary">
        No quality issues available yet. Upload a dataset first.
      </p>
    </div>
  </section>
</template>

<script setup>
import { useDashboardState } from '../composables/useDashboardState'

const { activeDatasetData } = useDashboardState()

const severityClass = (severity) => {
  if (severity === 'High') return 'bg-danger text-white'
  if (severity === 'Medium') return 'bg-warning text-white'
  return 'bg-accent text-white'
}
</script>