<script setup lang="ts">
import { computed } from 'vue'
import { tv } from 'tailwind-variants'
import { SliderRoot, SliderThumb, SliderTrack } from 'reka-ui'
import { slider } from '../theme'
import { injectColorPickerContext } from './ColorPickerRoot.vue'

const rootContext = injectColorPickerContext()

const alphaValue = computed({
  get: () => [rootContext.alpha.value],
  set: ([value]: number[]) => {
    rootContext.alpha.value = value as number
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
    v-model="alphaValue"
    :style="{ '--color': rootContext.hex.value }"
    :max="100"
    :step="1"
    :class="ui.root({ class: [props.ui?.root, props.class] })"
  >
    <SliderTrack
      data-color-picker-alpha-track
      :class="ui.track({ class: props.ui?.track })"
    />
    <SliderThumb
      :style="{ backgroundColor: rootContext.hexa.value }"
      :class="ui.thumb({ class: props.ui?.thumb })"
      aria-label="Opacity"
    />
  </SliderRoot>
</template>

<style scoped>
[data-color-picker-alpha-track] {
  box-shadow: inset #0000001a 0 0 0 1px;
  background: linear-gradient(to right, rgba(0, 0, 0, 0) 0%, var(--color) 100%), repeating-conic-gradient(#ddd 0% 25%, transparent 0% 50%) 50% / 8px 8px;
}
</style>
