<script setup lang="ts">
const props = defineProps({
  isShowSpinner: {
    type: Boolean,
    default: false,
  },
});
</script>
<template>
  <article>
    <slot name="header"></slot>

    <div class="flex justify-center items-center flex-col">
      <slot name="spinner">
        <EclipseSpinner v-if="props.isShowSpinner" />
      </slot>
      <div
        class="flex w-full overflow-x-auto gap-4 px-4"
        v-if="!props.isShowSpinner"
      >
        <slot name="content"></slot>
      </div>
    </div>
  </article>
</template>
