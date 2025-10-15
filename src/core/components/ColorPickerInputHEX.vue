<script setup lang="ts">
import { twMerge } from 'tailwind-merge'
import { injectColorPickerContext } from './ColorPickerRoot.vue'

const rootContext = injectColorPickerContext()
</script>

<template>
  <div :class="twMerge(rootContext.ui.input.group)">
    <input
      v-model="rootContext.hexa.value"
      type="text"
      :class="twMerge(rootContext.ui.input.field)"
      aria-label="Hex"
    />
    <input
      type="text"
      value="100%"
      :class="twMerge(rootContext.ui.input.field, 'flex-0 w-12')"
      aria-label="Opacity"
    />
  </div>
</template>

<style scoped></style>
