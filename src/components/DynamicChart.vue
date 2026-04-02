<template>
  <div class="h-[360px] w-full">
    <Bar v-if="chartKind === 'bar'" :data="dataConfig" :options="optionsConfig" />
    <Pie v-else-if="chartKind === 'pie'" :data="dataConfig" :options="optionsConfig" />
    <Scatter v-else-if="chartKind === 'scatter'" :data="dataConfig" :options="optionsConfig" />
    <Bar v-else :data="dataConfig" :options="optionsConfig" />
  </div>
</template>

<script setup>
import { computed } from 'vue'
import { Bar, Pie, Scatter } from 'vue-chartjs'
import 'chart.js/auto'

const props = defineProps({
  chartType: {
    type: String,
    default: 'Bar Chart',
  },
  xKey: {
    type: String,
    default: '',
  },
  yKey: {
    type: String,
    default: '',
  },
  rows: {
    type: Array,
    default: () => [],
  },
  columnSummary: {
    type: Array,
    default: () => [],
  },
})

const chartKind = computed(() => {
  if (props.chartType === 'Pie Chart') return 'pie'
  if (props.chartType === 'Scatter Plot') return 'scatter'
  return 'bar'
})

function getColumnMeta(name) {
  return (props.columnSummary || []).find((col) => col.name === name)
}

function isQuantitative(name) {
  return getColumnMeta(name)?.category === 'Quantitative'
}

const dataConfig = computed(() => {
  const rows = props.rows || []
  const xKey = props.xKey
  const yKey = props.yKey

  if (!rows.length || !xKey) {
    return {
      labels: [],
      datasets: [],
    }
  }

  if (chartKind.value === 'scatter') {
    const points = rows
      .map((row) => ({
        x: Number(row[xKey]),
        y: Number(row[yKey]),
      }))
      .filter((point) => !Number.isNaN(point.x) && !Number.isNaN(point.y))

    return {
      datasets: [
        {
          label: `${xKey} vs ${yKey}`,
          data: points,
        },
      ],
    }
  }

  const counts = {}

  if (yKey && isQuantitative(yKey) && !isQuantitative(xKey)) {
    rows.forEach((row) => {
      const category = row[xKey]
      const value = Number(row[yKey])

      if (category === '' || category === null || category === undefined) return
      if (Number.isNaN(value)) return

      const key = String(category)
      counts[key] = (counts[key] || 0) + value
    })
  } else {
    rows.forEach((row) => {
      const category = row[xKey]
      if (category === '' || category === null || category === undefined) return

      const key = String(category)
      counts[key] = (counts[key] || 0) + 1
    })
  }

  const labels = Object.keys(counts)

  return {
    labels,
    datasets: [
      {
        label: yKey ? `${yKey} by ${xKey}` : `${xKey} distribution`,
        data: labels.map((label) => counts[label]),
      },
    ],
  }
})

const optionsConfig = computed(() => {
  const base = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: {
        display: true,
      },
    },
  }

  if (chartKind.value === 'scatter') {
    return {
      ...base,
      scales: {
        x: {
          title: {
            display: true,
            text: props.xKey,
          },
        },
        y: {
          title: {
            display: true,
            text: props.yKey,
          },
        },
      },
    }
  }

  return {
    ...base,
    scales: {
      y: {
        beginAtZero: true,
      },
    },
  }
})
</script>