<!-- eslint-disable vue/multi-word-component-names -->
<script setup lang="ts">
import { formatISO } from "date-fns";
import LineChart from "@/components/LineChart.vue";
import { computed, onMounted, ref } from "vue";
import { getReport } from "@/api";
import type { TicketReport } from "backend/types";
import type { ChartDataset } from "chart.js";

// const chartData = {
//   labels: ["January", "February", "March", "April", "May", "June", "July"],
//   datasets: [
//     {
//       label: "Data One",
//       backgroundColor: "#f87979",
//       data: [40, 39, 10, 40, 39, 80, 40],
//     },
//   ],
// };

const labels = ref<string[] | null>(null);
const datasets = ref<TicketReport[] | null>(null);
const formatLabels = (labels: string[]): string[] => {
  return labels.map((x) => formatISO(new Date(x), { representation: "date" }));
};

const formatDatasets = (datasets: TicketReport[]): ChartDataset<"line">[] => {
  return datasets;
};

const chartData = computed(() => {
  return {
    labels: formatLabels(labels.value || []),
    datasets: formatDatasets(datasets.value || []),
  };
});

onMounted(() => {
  getReport().then((data) => {
    labels.value = data.labels;
    datasets.value = data.datasets;
  });
});
</script>
<template>
  <article>
    <h2 class="text-xl m-2">Ticket sale/day</h2>
    <LineChart :chart-data="chartData" />
  </article>
</template>
