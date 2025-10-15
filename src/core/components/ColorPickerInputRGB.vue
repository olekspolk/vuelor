<script setup lang="ts">
import { twMerge } from 'tailwind-merge'
import { injectColorPickerContext } from './ColorPickerRoot.vue'

const rootContext = injectColorPickerContext()
</script>

<template>
  <div :class="twMerge(rootContext.ui.input.group)">
    <input
      :value="rootContext.rgba.value.r"
      type="text"
      :class="twMerge(rootContext.ui.input.field, 'px-1')"
      aria-label="Red"
    />
    <input
      :value="rootContext.rgba.value.g"
      type="text"
      :class="twMerge(rootContext.ui.input.field, 'px-1')"
      aria-label="Green"
    />
    <input
      :value="rootContext.rgba.value.b"
      type="text"
      :class="twMerge(rootContext.ui.input.field, 'px-1')"
      aria-label="Blue"
    />
    <input
      type="text"
      :value="rootContext.alpha.value"
      :class="twMerge(rootContext.ui.input.field, 'flex-0 w-12')"
      aria-label="Alpha"
    />
  </div>
</template>

<style scoped></style>
