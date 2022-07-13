<script setup lang="ts">
import { computed, onMounted } from "vue";
import { getTickets } from "@/api";
import type { Ticket, TicketBuyed } from "backend/types";
import { useLocalStorageJSON } from "@/composables/use-local-storage";
import { usePromise } from "@/composables/use-promise";
import SaleTicket from "../components/TicketCard/SaleTicket.vue";
import MyTicket from "../components/TicketCard/MyTicket.vue";

const ticketOnSales = usePromise<Ticket[]>(() => getTickets());

const { value: localStorageMyTicket, clear } =
  useLocalStorageJSON<TicketBuyed[]>("myTickets");

const myTickets = computed(() => {
  return [...(localStorageMyTicket.value ?? [])].reverse();
});

const onBuyTicket = (tickets: TicketBuyed[]) => {
  localStorageMyTicket.value = [
    ...(localStorageMyTicket.value ?? []),
    ...tickets,
  ];
};

const onUseTicket = (ticket: TicketBuyed) => {
  const local = localStorageMyTicket.value ?? [];
  const localTicketIndex = local.findIndex((t) => t.id === ticket.id);
  if (localTicketIndex === -1) return;
  local[localTicketIndex] = ticket;
  localStorageMyTicket.value = [...local];
};

onMounted(() => {
  ticketOnSales.createPromise();
});
</script>
<template>
  <div>
    <SectionBlock :is-show-spinner="!ticketOnSales.result">
      <template v-slot:header>
        <h2 class="m-4 text-4xl">Ticket on sale</h2>
      </template>
      <template v-slot:content v-if="ticketOnSales.result">
        <div
          class="flex flex-none"
          v-for="(ticket, index) in ticketOnSales.result.value"
          :key="index"
        >
          <SaleTicket :ticket="ticket" @buy-ticket="onBuyTicket" />
        </div>
      </template>
    </SectionBlock>
    <SectionBlock>
      <template v-slot:header>
        <div class="flex">
          <h2 class="m-4 text-4xl">Your ticket</h2>
          <button @click="clear">delete all</button>
        </div>
      </template>
      <template v-slot:content>
        <div v-if="myTickets.length === 0">
          <p class="m-4">You have no ticket</p>
        </div>
        <template v-else>
          <div
            class="flex flex-none"
            v-for="(ticket, index) in myTickets"
            :key="index"
          >
            <MyTicket :ticket="ticket" @use-ticket="onUseTicket" />
          </div>
        </template>
      </template>
    </SectionBlock>
  </div>
</template>
