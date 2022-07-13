<script setup lang="ts">
import { usePromise } from "@/composables/use-promise";
import type { TicketBuyed } from "backend/types";
import { watch, type PropType } from "vue";
import Base from "./Base.vue";
import { useTicket } from "@/api";

const props = defineProps({
  ticket: {
    type: Object as PropType<TicketBuyed>,
    required: true,
  },
});
const emit = defineEmits(["useTicket"]);

const { result, createPromise } = usePromise<TicketBuyed>((id: string) => {
  return useTicket(id);
});

watch(result, () => {
  if (!result.value) return;
  emit("useTicket", result.value);
});
const onUseTicket = () => {
  createPromise(props.ticket.id);
};
</script>
<template>
  <Base :id="props.ticket.detail.id">
    <template v-slot:status>
      <span
        class="absolute block bg-green-500 py-1 px-2 rounded-2xl mt-2 ml-2 text-xs text-neutral-900"
        >{{ props.ticket.status }}</span
      >
    </template>
    <template v-slot:details>
      <h3>Type: {{ props.ticket.detail.type }}</h3>
      <h3>Price: {{ props.ticket.detail.price }}</h3>
      <!-- <label for="amount">Amount: </label>
      <span id="amount">{{ amount }}</span> -->
    </template>
    <template v-slot:action>
      <button class="px-4 h-full rounded text-neutral-900" @click="onUseTicket">
        Use
      </button>
    </template>
  </Base>
</template>
