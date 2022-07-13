<script setup lang="ts">
import { buyTicket } from "@/api";
import { usePromise } from "@/composables/use-promise";
import type { Ticket, TicketBuyed } from "backend/types";
import { ref, watch, type PropType } from "vue";
import Base from "./Base.vue";
const props = defineProps({
  ticket: {
    type: Object as PropType<Ticket>,
    required: true,
  },
});
const emit = defineEmits(["buyTicket"]);
const amount = ref<string>(props.ticket.minimumPerOrder.toString());

watch(amount, () => {
  if (amount.value === "") {
    amount.value = "0";
    return;
  }
  amount.value = parseInt(amount.value).toString();
});

const { result, createPromise } = usePromise<TicketBuyed>(
  (id: string, amount: string) => {
    return buyTicket(id, amount);
  }
);

watch(result, () => {
  if (!result.value) return;
  emit("buyTicket", result.value);
});

const onBuyClick = () => {
  createPromise(props.ticket.id, amount.value);
};
</script>
<template>
  <Base :id="props.ticket.id">
    <template v-slot:status>
      <span
        class="absolute block bg-green-500 py-1 px-2 rounded-2xl mt-2 ml-2 text-xs text-neutral-900"
        >{{ props.ticket.status }}</span
      >
    </template>
    <template v-slot:details>
      <h3>Type: {{ props.ticket.type }}</h3>
      <h3>Price: {{ props.ticket.price }}</h3>
      <label for="amount">Amount: </label>
      <input
        type="number"
        id="amount"
        class="w-12 pl-2"
        :min="props.ticket.minimumPerOrder"
        :max="props.ticket.remaining"
        v-model.number="amount"
      />
    </template>
    <template v-slot:action>
      <button class="px-4 h-full rounded text-neutral-900" @click="onBuyClick">
        Buy
      </button>
    </template>
  </Base>
</template>
