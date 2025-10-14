<script setup lang="ts">
import { computed } from 'vue'
import { SliderRoot, SliderThumb, SliderTrack } from 'reka-ui'
import { injectColorPickerContext } from './ColorPickerRoot.vue'

const rootContext = injectColorPickerContext()

const thumbColor = computed(() => `hsl(${rootContext.hsva.value.h},100%,50%)`);

const hueValue = computed({
  get: () => [rootContext.hsva.value.h],
  set: ([value]: number[]) => {
    rootContext.hsva.value = {
      ...rootContext.hsva.value,
      h: value as number
    }
  },
})
</script>

<template>
  <SliderRoot v-model="hueValue" class="relative flex items-center select-none touch-none h-5" :max="360" :step="1">
    <SliderTrack data-color-picker-hue-track class="relative grow rounded-full h-4" />
    <SliderThumb :style="{ background: thumbColor }"
      class="block w-4 h-4 rounded-full border-2 border-white shadow-[var(--elevation-thumb)] focus:outline-1 outline-[#0d99ff]"
      aria-label="Hue" />
  </SliderRoot>
</template>

<style scoped>
[data-color-picker-hue-track] {
  box-shadow: inset #0000001a 0 0 0 1px;
  background: linear-gradient(to right, red, yellow, lime, cyan, blue, magenta, red);
}
</style>
