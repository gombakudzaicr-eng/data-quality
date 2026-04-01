
<template>
  <section class="space-y-6">
    <div class="grid-2">
      <div class="card">
        <div class="card-header">
          <h3 class="text-lg font-semibold text-primary">Numerical Summary</h3>
        </div>

        <div class="overflow-x-auto rounded-2xl border border-border">
          <table class="table min-w-full bg-white">
            <thead>
              <tr>
                <th>Column</th>
                <th>Mean</th>
                <th>Median</th>
                <th>Min</th>
                <th>Max</th>
              </tr>
            </thead>
            <tbody>
              <tr
                v-for="item in numericalSummary"
                :key="item.column"
                class="transition hover:bg-background"
              >
                <td>{{ item.column }}</td>
                <td>{{ item.mean }}</td>
                <td>{{ item.median }}</td>
                <td>{{ item.min }}</td>
                <td>{{ item.max }}</td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>

      <div class="card">
        <div class="card-header">
          <h3 class="text-lg font-semibold text-primary">Categorical Summary</h3>
        </div>

        <div class="overflow-x-auto rounded-2xl border border-border">
          <table class="table min-w-full bg-white">
            <thead>
              <tr>
                <th>Column</th>
                <th>Unique Values</th>
                <th>Most Frequent</th>
                <th>Missing</th>
              </tr>
            </thead>
            <tbody>
              <tr
                v-for="item in categoricalSummary"
                :key="item.column"
                class="transition hover:bg-background"
              >
                <td>{{ item.column }}</td>
                <td>{{ item.unique }}</td>
                <td>{{ item.frequent }}</td>
                <td>{{ item.missing }}</td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>
    </div>

    <div class="card">
      <div class="card-header">
        <h3 class="text-lg font-semibold text-primary">Auto-Generated Insights</h3>
      </div>
      <ul class="insight-list">
        <li v-for="(item, index) in quickInsights" :key="index">
          {{ item }}
        </li>
      </ul>
    </div>

    <div class="card">
      <div class="card-header">
        <h3 class="text-lg font-semibold text-primary">Stem-and-Leaf Diagram</h3>
      </div>
      <pre class="code-block">{{ stemLeaf }}</pre>
    </div>
  </section>
</template>

<script setup>
import {
  numericalSummary,
  categoricalSummary,
  quickInsights,
  stemLeaf,
} from '../data/mockData'
</script>