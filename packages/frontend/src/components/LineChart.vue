<script setup lang="ts">
import { computed, type PropType } from "vue";
import { randomIndex } from "backend/utils/random";

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

const bgColor = ["#f87171", "#a3e635", "#38bdf8", "#c084fc"];

const chartData = computed(() => {
  return {
    labels: props.chartData.labels,
    datasets: (props.chartData.datasets || []).map((x, i) => {
      const color = bgColor[i % bgColor.length];
      return {
        ...x,
        borderColor: color,
        backgroundColor: color,
      };
    }),
  };
});
</script>

<template>
  <Line
    :chart-options="chartOptions"
    :chart-data="chartData"
    :chart-id="chartId"
    :dataset-id-key="datasetIdKey"
    :plugins="props.plugins"
    :css-classes="cssClasses"
    :styles="styles"
    :width="width"
    :height="height"
  />
</template>
