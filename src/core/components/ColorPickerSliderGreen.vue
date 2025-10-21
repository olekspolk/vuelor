<script lang="ts">
import type { SliderRootProps } from 'reka-ui'

export interface GreenSliderProps {
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

const ui = computed(() => tv(slider)({
  orientation: props.orientation
}))
</script>

<template>
  <SliderRoot
    v-model="greenValue"
    :disabled="rootContext.disabled.value"
    :max="255"
    :orientation="props.orientation"
    :class="ui.root({ class: [props.ui?.root, props.class] })"
    @pointerup="rootContext.emitUpdateEnd()"
  >
    <SliderTrack
      :style="{ background: trackBackground }"
      :class="ui.track({ class: props.ui?.track })"
    />
    <SliderThumb
      aria-label="Green"
      :style="{ background: rootContext.hex.value }"
      :class="ui.thumb({ class: props.ui?.thumb })"
    />
  </SliderRoot>
</template>
