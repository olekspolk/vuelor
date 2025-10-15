<script setup lang="ts">
import { twMerge } from 'tailwind-merge'
import { injectColorPickerContext } from './ColorPickerRoot.vue'

const rootContext = injectColorPickerContext()
</script>

<template>
  <div :class="twMerge(rootContext.ui.input.group)">
    <input
      v-model="rootContext.hsva.value.h"
      type="text"
      aria-label="Hue"
      :class="twMerge(rootContext.ui.input.field, 'px-1')"
    />
    <input
      type="text"
      :value="rootContext.hsva.value.s.toFixed(2)"
      :class="twMerge(rootContext.ui.input.field, 'px-1')"
      aria-label="Saturation"
    />
    <input
      type="text"
      :value="rootContext.hsva.value.v.toFixed(2)"
      :class="twMerge(rootContext.ui.input.field, 'px-1')"
      aria-label="Lightness"
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
