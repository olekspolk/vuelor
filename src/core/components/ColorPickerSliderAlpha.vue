<script setup lang="ts">
import { computed } from 'vue'
import { tv } from 'tailwind-variants'
import type { SliderRootProps } from 'reka-ui'
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

interface SliderProps {
  class?: string,
  orientation?: SliderRootProps['orientation'],
  ui?: Partial<typeof slider.slots>
}

const props = withDefaults(defineProps<SliderProps>(), {
  orientation: 'horizontal'
})

const ui = tv(slider)({
  orientation: props.orientation
})

const trackStyle = computed(() => {
  const gradientDirection = props.orientation === 'horizontal' ? 'to right' : 'to top'
  return {
    background: [
      `linear-gradient(${gradientDirection}, rgba(0, 0, 0, 0) 0%, ${rootContext.hex.value} 100%)`,
      'repeating-conic-gradient(#ddd 0% 25%, transparent 0% 50%) 50% / 8px 8px'
    ].join(',')
  }
})
</script>

<template>
  <SliderRoot
    v-model="alphaValue"
    :orientation="props.orientation"
    :class="ui.root({ class: [props.ui?.root, props.class] })"
  >
    <SliderTrack
      :style="trackStyle"
      :class="ui.track({ class: props.ui?.track })"
    />
    <SliderThumb
      :style="{ backgroundColor: rootContext.hexa.value }"
      :class="ui.thumb({ class: props.ui?.thumb })"
      aria-label="Opacity"
    />
  </SliderRoot>
</template>
