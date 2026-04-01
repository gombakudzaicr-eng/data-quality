
<template>
  <section class="space-y-6">
    <div class="card">
      <div class="card-header">
        <h3 class="text-lg font-semibold text-primary">Correlation Heatmap</h3>
      </div>

      <div class="grid gap-3 md:grid-cols-3">
        <div
          v-for="(row, rowIndex) in correlationMatrix"
          :key="rowIndex"
          class="contents"
        >
          <div
            v-for="(value, colIndex) in row"
            :key="`${rowIndex}-${colIndex}`"
            class="rounded-2xl p-4"
            :style="heatmapStyle(value)"
          >
            <div class="text-sm opacity-90">
              {{ correlationLabels[rowIndex] }} / {{ correlationLabels[colIndex] }}
            </div>
            <div class="mt-3 text-xl font-bold">
              {{ value.toFixed(2) }}
            </div>
          </div>
        </div>
      </div>
    </div>

    <div class="card">
      <div class="card-header">
        <h3 class="text-lg font-semibold text-primary">Correlation Details</h3>
      </div>

      <div class="overflow-x-auto rounded-2xl border border-border">
        <table class="table min-w-full bg-white">
          <thead>
            <tr>
              <th>Column A</th>
              <th>Column B</th>
              <th>Value</th>
              <th>Strength</th>
            </tr>
          </thead>
          <tbody>
            <tr
              v-for="(item, index) in correlationDetails"
              :key="index"
              class="transition hover:bg-background"
            >
              <td>{{ item.a }}</td>
              <td>{{ item.b }}</td>
              <td>{{ item.value }}</td>
              <td>{{ item.strength }}</td>
            </tr>
          </tbody>
        </table>
      </div>
    </div>
  </section>
</template>

<script setup>
import {
  correlationMatrix,
  correlationLabels,
  correlationDetails,
} from '../data/mockData'

const heatmapStyle = (value) => {
  const intensity = Math.abs(value)
  return {
    background: `rgba(8, 170, 199, ${0.15 + intensity * 0.85})`,
    color: intensity > 0.55 ? '#ffffff' : '#002455',
    border: '1px solid #D9D9D9',
  }
}
</script>