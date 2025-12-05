<script lang="ts">
import type { SliderRootProps } from 'reka-ui'
import type { UiSliderSlots } from '../utils/styles'

export interface SliderProps {
  class?: string,
  inverted?: boolean,
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

const hueValue = computed({
  get: () => [rootContext.hsv.value.h],
  set: ([value]: number[]) => {
    rootContext.hsv.value = {
      ...rootContext.hsv.value,
      h: value as number
    }
  },
})

const trackBackground = computed(() => {
  const direction = props.orientation === 'vertical' ? 'to top' : 'to right'
  return `linear-gradient(${direction}, red, yellow, lime, cyan, blue, magenta, red)`
})

const ui = rootContext.uiSlots('slider', 'shared')
</script>

<template>
  <SliderRoot
    v-model="hueValue"
    :disabled="rootContext.disabled.value"
    :max="360"
    :inverted="props.inverted"
    :orientation="props.orientation"
    :class="ui.root(props.ui?.root, props.class)"
    @value-commit="rootContext.commitValue()"
  >
    <SliderTrack
      :style="{ background: trackBackground }"
      :class="ui.track(props.ui?.track)"
    />
    <SliderThumb
      aria-label="Hue"
      :style="{ background: `hsl(${rootContext.hsv.value.h},100%,50%)` }"
      :class="ui.thumb(props.ui?.thumb)"
    />
  </SliderRoot>
</template>
