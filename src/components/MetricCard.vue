
<template>
  <div class="metric-card">
    <p class="metric-label">{{ label }}</p>
    <h3 class="metric-value">{{ value }}</h3>
  </div>
</template>

<script setup>
defineProps({
  label: {
    type: String,
    required: true,
  },
  value: {
    type: [String, Number],
    required: true,
  },
})
</script>