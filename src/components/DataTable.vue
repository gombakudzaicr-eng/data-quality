
<template>
  <div class="overflow-x-auto rounded-2xl border border-border">
    <table class="table min-w-full bg-white">
      <thead>
        <tr>
          <th v-for="column in columns" :key="column">
            {{ column }}
          </th>
        </tr>
      </thead>

      <tbody>
        <tr
          v-for="(row, index) in rows"
          :key="index"
          class="transition hover:bg-background"
        >
          <td v-for="column in columns" :key="column">
            {{ row[column] }}
          </td>
        </tr>
      </tbody>
    </table>
  </div>
</template>

<script setup>
defineProps({
  columns: {
    type: Array,
    required: true,
  },
  rows: {
    type: Array,
    required: true,
  },
})
</script>