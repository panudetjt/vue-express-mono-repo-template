<!-- eslint-disable vue/multi-word-component-names -->
<script setup lang="ts">
import LineChart from "@/components/LineChart.vue";

const chartData = {
  labels: ["January", "February", "March", "April", "May", "June", "July"],
  datasets: [
    {
      label: "Data One",
      backgroundColor: "#f87979",
      data: [40, 39, 10, 40, 39, 80, 40],
    },
  ],
};
</script>
<template>
  <LineChart :chart-data="chartData" /><LineChart :chart-data="chartData" />
</template>
