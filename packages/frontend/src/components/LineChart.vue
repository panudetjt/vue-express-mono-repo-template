<script setup lang="ts">
import type { PropType } from "vue";

import { Line } from "vue-chartjs";

import {
  Chart as ChartJS,
  Title,
  Tooltip,
  Legend,
  CategoryScale,
  LinearScale,
  LineElement,
  PointElement,
  type Plugin,
  type ChartData,
} from "chart.js";

ChartJS.register(
  Title,
  Tooltip,
  Legend,
  LineElement,
  PointElement,
  CategoryScale,
  LinearScale
);
const props = defineProps({
  chartId: {
    type: String,
    default: "line-chart",
  },
  datasetIdKey: {
    type: String,
    default: "label",
  },
  width: {
    type: Number,
    default: 400,
  },
  height: {
    type: Number,
    default: 400,
  },
  cssClasses: {
    default: "",
    type: String,
  },
  styles: {
    type: Object as PropType<Partial<CSSStyleDeclaration>>,
    default: () => {
      return {};
    },
  },
  plugins: {
    type: Object as PropType<Plugin<"line">[]>,
    default: () => {
      return [];
    },
  },
  chartData: {
    type: Object as PropType<ChartData<"line">>,
    default: () => {
      return {};
    },
  },
});

const chartOptions = {
  responsive: true,
  maintainAspectRatio: false,
};
</script>

<template>
  <Line
    :chart-options="chartOptions"
    :chart-data="props.chartData"
    :chart-id="chartId"
    :dataset-id-key="datasetIdKey"
    :plugins="props.plugins"
    :css-classes="cssClasses"
    :styles="styles"
    :width="width"
    :height="height"
  />
</template>
