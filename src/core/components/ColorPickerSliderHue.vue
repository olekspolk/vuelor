<script setup lang="ts">
import { computed } from 'vue'
import { twMerge } from 'tailwind-merge'
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
  <SliderRoot
    v-model="hueValue"
    :max="360"
    :step="1"
    class="relative flex items-center select-none touch-none h-5"
  >
    <SliderTrack
      data-color-picker-hue-track
      class="relative grow rounded-full h-4"
    />
    <SliderThumb
      :style="{ background: thumbColor }"
      :class="twMerge(rootContext.ui.slider.thumb)"
      aria-label="Hue"
    />
  </SliderRoot>
</template>

<style scoped>
[data-color-picker-hue-track] {
  box-shadow: inset #0000001a 0 0 0 1px;
  background: linear-gradient(to right, red, yellow, lime, cyan, blue, magenta, red);
}
</style>
