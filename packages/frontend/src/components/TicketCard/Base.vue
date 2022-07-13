<script setup lang="ts">
const props = defineProps({
  id: {
    type: String,
    required: true,
  },
});
</script>
<template>
  <div class="drop-shadow-md mb-4">
    <article class="w-52 rounded-xl bg-white overflow-hidden">
      <section class="relative">
        <slot name="status"></slot>
        <slot name="image">
          <img
            :src="`https://placeimg.com/208/208/any?${props.id}`"
            class="w-52 h-52"
            loading="lazy"
          />
        </slot>
      </section>
      <section class="pl-4 py-4">
        <div class="flex divide-x">
          <div class="flex-1">
            <slot name="details"> </slot>
          </div>
          <div class="flex items-center">
            <slot name="action"> </slot>
          </div>
        </div>
      </section>
    </article>
  </div>
</template>

<style scoped>
input[type="number"]::-webkit-inner-spin-button,
input[type="number"]::-webkit-outer-spin-button {
  opacity: 1;
}
</style>
