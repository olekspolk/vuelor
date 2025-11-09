<script lang="ts">
import type { SliderRootProps } from 'reka-ui'
import type { UiSliderSlots } from '../utils/styles'

export interface SliderProps {
  class?: string,
  orientation?: SliderRootProps['orientation'],
  ui?: Partial<UiSliderSlots>
}
</script>

<script setup lang="ts">
import { computed } from 'vue'
import { SliderRoot, SliderThumb, SliderTrack } from 'reka-ui'
import { injectColorPickerContext } from './ColorPickerRoot.vue'

const props = withDefaults(defineProps<SliderProps>(), {
  orientation: 'horizontal'
})

const rootContext = injectColorPickerContext()

const value = computed({
  get: () => [rootContext.hsl.value.l],
  set: ([value]: number[]) => {
    rootContext.hsl.value = {
      ...rootContext.hsl.value,
      l: value as number
    }
  },
})

const trackBackground = computed(() => {
  const direction = props.orientation === 'vertical' ? 'to top' : 'to right'
  const color = `hsl(${Math.floor(rootContext.hsl.value.h)}, ${Math.floor(rootContext.hsl.value.s * 100)}%, 50%)`
  return `linear-gradient(${direction}, hsl(0, 0%, 0%), ${color}, hsl(0, 0%, 100%))`
})

const ui = rootContext.uiSlots('slider', 'shared')
</script>

<template>
  <SliderRoot
    v-model="value"
    :max="1"
    :step="0.01"
    :disabled="rootContext.disabled.value"
    :orientation="props.orientation"
    :class="ui.root(props.ui?.root, props.class)"
    @pointerup="rootContext.emitUpdateEnd()"
  >
    <SliderTrack
      :style="{ background: trackBackground }"
      :class="ui.track(props.ui?.track)"
    />
    <SliderThumb
      aria-label="Lightness"
      :style="{ background: rootContext.hex.value }"
      :class="ui.thumb(props.ui?.thumb)"
    />
  </SliderRoot>
</template>
