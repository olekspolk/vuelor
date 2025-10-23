<script lang="ts">
import type { SliderRootProps } from 'reka-ui'
import type { UiSliderSlots } from '../utils/styles'

export interface GreenSliderProps {
  class?: string,
  orientation?: SliderRootProps['orientation'],
  ui?: Partial<UiSliderSlots>
}
</script>

<script setup lang="ts">
import { computed } from 'vue'
import { SliderRoot, SliderThumb, SliderTrack } from 'reka-ui'
import { injectColorPickerContext } from './ColorPickerRoot.vue'

const props = withDefaults(defineProps<GreenSliderProps>(), {
  orientation: 'horizontal'
})

const rootContext = injectColorPickerContext()

const greenValue = computed({
  get: () => [rootContext.rgb.value.g],
  set: ([value]: number[]) => {
    rootContext.rgb.value = {
      ...rootContext.rgb.value,
      g: value as number
    }
  }
})

const trackBackground = computed(() => {
  const direction = props.orientation === 'vertical' ? 'to top' : 'to right'
  const fromColor = `rgb(${rootContext.rgb.value.r}, 0, ${rootContext.rgb.value.b})`
  const toColor = `rgb(${rootContext.rgb.value.r}, 255, ${rootContext.rgb.value.b})`
  return `linear-gradient(${direction}, ${fromColor}, ${toColor})`
})

const ui = rootContext.uiSlots('slider', 'shared')
</script>

<template>
  <SliderRoot
    v-model="greenValue"
    :disabled="rootContext.disabled.value"
    :max="255"
    :orientation="props.orientation"
    :class="ui.root(props.ui?.root, props.class)"
    @pointerup="rootContext.emitUpdateEnd()"
  >
    <SliderTrack
      :style="{ background: trackBackground }"
      :class="ui.track(props.ui?.track)"
    />
    <SliderThumb
      aria-label="Green"
      :style="{ background: rootContext.hex.value }"
      :class="ui.thumb(props.ui?.thumb)"
    />
  </SliderRoot>
</template>
