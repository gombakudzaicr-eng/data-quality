
<template>
  <section class="space-y-6">
    <div class="grid-2">
      <div class="card">
        <div class="card-header">
          <h3 class="text-lg font-semibold text-primary">Export Options</h3>
        </div>

        <div class="grid gap-4">
          <button class="btn btn-primary">Download Cleaned CSV</button>
          <button class="btn btn-secondary">Download Merged CSV</button>
          <button class="btn btn-accent">Download EDA Report</button>
          <button class="btn btn-warning">Download Correlation Report</button>
        </div>
      </div>

      <div class="card">
        <div class="card-header">
          <h3 class="text-lg font-semibold text-primary">Generated Report</h3>
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
import { reportText } from '../data/mockData'
</script>