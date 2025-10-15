<script setup lang="ts">
import { computed } from 'vue'
import { SliderRoot, SliderThumb, SliderTrack } from 'reka-ui'
import { injectColorPickerContext } from './ColorPickerRoot.vue'

const rootContext = injectColorPickerContext()

const alphaValue = computed({
  get: () => [rootContext.alpha.value],
  set: ([value]: number[]) => {
    rootContext.alpha.value = value as number
  },
})
</script>

<template>
  <SliderRoot :style="{ '--color': rootContext.hex.value }" v-model="alphaValue"
    class="relative flex items-center select-none touch-none h-5" :max="100" :step="1">
    <SliderTrack data-color-picker-alpha-track class="relative grow rounded-full h-4" />
    <SliderThumb :style="{ backgroundColor: rootContext.hexa.value }"
      class="block w-4 h-4 rounded-full border-2 border-white shadow-[var(--elevation-thumb)] focus:outline-1 outline-[#0d99ff]"
      aria-label="Opacity" />
  </SliderRoot>
</template>

<style scoped>
[data-color-picker-alpha-track] {
    box-shadow: inset #0000001a 0 0 0 1px;
  background: linear-gradient(to right, rgba(0, 0, 0, 0) 0%, var(--color) 100%), repeating-conic-gradient(#ddd 0% 25%, transparent 0% 50%) 50% / 8px 8px;
}
</style>
