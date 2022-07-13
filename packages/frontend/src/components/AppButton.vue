<script setup lang="ts">
const emit = defineEmits(["increaseBy"]);
const onClick = () => {
  emit("increaseBy", 1);
};
</script>
<template>
  <!-- <button
    class="inline-block p-2 bg-teal-300 rounded drop-shadow"
    v-bind="$attrs"
  >
    <slot></slot>
  </button> -->
  <button @click="onClick">Increase by 1</button>
</template>
