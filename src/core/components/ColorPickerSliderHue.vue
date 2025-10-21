<script lang="ts">
import type { SliderRootProps } from 'reka-ui'

export interface HueSliderProps {
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

const props = withDefaults(defineProps<HueSliderProps>(), {
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

const ui = computed(() => tv({
  extend: slider,
  variants: {
    orientation: {
      horizontal: {
        track: 'bg-[linear-gradient(to_right,red,yellow,lime,cyan,blue,magenta,red)]'
      },
      vertical: {
        track: 'bg-[linear-gradient(to_bottom,red,yellow,lime,cyan,blue,magenta,red)]'
      }
    }
  }
})({
  orientation: props.orientation
}))
</script>

<template>
  <SliderRoot
    v-model="hueValue"
    :disabled="rootContext.disabled.value"
    :max="359"
    :inverted="props.orientation === 'vertical'"
    :orientation="props.orientation"
    :class="ui.root({ class: [props.ui?.root, props.class] })"
    @pointerup="rootContext.emitUpdateEnd()"
  >
    <SliderTrack :class="ui.track({ class: props.ui?.track })" />
    <SliderThumb
      aria-label="Hue"
      :style="{ background: `hsl(${rootContext.hsv.value.h},100%,50%)` }"
      :class="ui.thumb({ class: props.ui?.thumb })"
    />
  </SliderRoot>
</template>
