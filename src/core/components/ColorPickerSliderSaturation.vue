<script lang="ts">
import type { SliderRootProps } from 'reka-ui'

export interface SliderProps {
  class?: string,
  orientation?: SliderRootProps['orientation'],
  ui?: Partial<typeof slider.slots>
}
</script>

<script setup lang="ts">
import { computed } from 'vue'
import { tv } from 'tailwind-variants'
import { SliderRoot, SliderThumb, SliderTrack } from 'reka-ui'
import { slider } from '../theme'
import { injectColorPickerContext } from './ColorPickerRoot.vue'

const props = withDefaults(defineProps<SliderProps>(), {
  orientation: 'horizontal'
})

const rootContext = injectColorPickerContext()

const saturationValue = computed({
  get: () => [rootContext.hsl.value.s],
  set: ([value]: number[]) => {
    rootContext.hsl.value = {
      ...rootContext.hsl.value,
      s: value as number
    }
  },
})

const trackBackground = computed(() => {
  const direction = props.orientation === 'vertical' ? 'to top' : 'to right'
  const fromColor = `hsl(${rootContext.hsl.value.h} 0 ${rootContext.hsl.value.l * 100}%)`
  const toColor = `hsl(${rootContext.hsl.value.h} 100% ${rootContext.hsl.value.l * 100}%)`
  return `linear-gradient(${direction}, ${fromColor}, ${toColor})`
})

const ui = computed(() => tv(slider)({
  orientation: props.orientation
}))
</script>

<template>
  <SliderRoot
    v-model="saturationValue"
    :max="1"
    :step="0.01"
    :disabled="rootContext.disabled.value"
    :orientation="props.orientation"
    :class="ui.root({ class: [props.ui?.root, props.class] })"
    @pointerup="rootContext.emitUpdateEnd()"
  >
    <SliderTrack
      :style="{ background: trackBackground }"
      :class="ui.track({ class: props.ui?.track })"
    />
    <SliderThumb
      aria-label="Saturation"
      :style="{ background: rootContext.hex.value }"
      :class="ui.thumb({ class: props.ui?.thumb })"
    />
  </SliderRoot>
</template>
