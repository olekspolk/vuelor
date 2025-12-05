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
  const fromColor = `hsl(${Math.floor(rootContext.hsl.value.h)}, 0%, ${Math.floor(rootContext.hsl.value.l * 100)}%)`
  const toColor = `hsl(${Math.floor(rootContext.hsl.value.h)}, 100%, ${Math.floor(rootContext.hsl.value.l * 100)}%)`
  return `linear-gradient(${direction}, ${fromColor}, ${toColor})`
})

const ui = rootContext.uiSlots('slider', 'shared')
</script>

<template>
  <SliderRoot
    v-model="saturationValue"
    :max="1"
    :step="0.01"
    :disabled="rootContext.disabled.value"
    :orientation="props.orientation"
    :class="ui.root(props.ui?.root, props.class)"
    @value-commit="rootContext.commitValue()"
  >
    <SliderTrack
      :style="{ background: trackBackground }"
      :class="ui.track(props.ui?.track)"
    />
    <SliderThumb
      aria-label="Saturation"
      :style="{ background: rootContext.hex.value }"
      :class="ui.thumb(props.ui?.thumb)"
    />
  </SliderRoot>
</template>
