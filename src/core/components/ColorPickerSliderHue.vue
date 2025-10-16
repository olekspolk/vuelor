<script setup lang="ts">
import { computed } from 'vue'
import { tv } from 'tailwind-variants'
import { SliderRoot, SliderThumb, SliderTrack } from 'reka-ui'
import { slider } from '../theme'
import { injectColorPickerContext } from './ColorPickerRoot.vue'

const rootContext = injectColorPickerContext()

const thumbColor = computed(() => `hsl(${rootContext.hsva.value.h},100%,50%)`)

const hueValue = computed({
  get: () => [rootContext.hsva.value.h],
  set: ([value]: number[]) => {
    rootContext.hsva.value = {
      ...rootContext.hsva.value,
      h: value as number
    }
  },
})

const props = defineProps<{
  class?: string,
  ui?: Partial<typeof slider.slots>
}>()

const ui = tv(slider)()
</script>

<template>
  <SliderRoot
    v-model="hueValue"
    :max="360"
    :step="1"
    :class="ui.root({ class: [props.ui?.root, props.class] })"
  >
    <SliderTrack
      data-color-picker-hue-track
      :class="ui.track({ class: props.ui?.track })"
    />
    <SliderThumb
      :style="{ background: thumbColor }"
      :class="ui.thumb({ class: props.ui?.thumb })"
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
