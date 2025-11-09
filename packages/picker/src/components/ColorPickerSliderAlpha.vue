<script setup lang="ts">
import { computed } from 'vue'
import type { SliderRootProps } from 'reka-ui'
import type { UiSliderSlots } from '../utils/styles'
import { SliderRoot, SliderThumb, SliderTrack } from 'reka-ui'
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
  ui?: Partial<UiSliderSlots>
}

const props = withDefaults(defineProps<SliderProps>(), {
  orientation: 'horizontal'
})

const trackStyle = computed(() => {
  const gradientDirection = props.orientation === 'vertical' ? 'to top' : 'to right'
  return {
    background: [
      `linear-gradient(${gradientDirection}, rgba(0, 0, 0, 0) 0%, ${rootContext.hex.value} 100%)`,
      'repeating-conic-gradient(#ddd 0% 25%, transparent 0% 50%) 50% / 8px 8px'
    ].join(',')
  }
})

const ui = rootContext.uiSlots('slider', 'shared')
</script>

<template>
  <SliderRoot
    v-model="alphaValue"
    :disabled="rootContext.disabled.value"
    :orientation="props.orientation"
    :class="ui.root(props.ui?.root, props.class)"
    @pointerup="rootContext.emitUpdateEnd()"
  >
    <SliderTrack
      :style="trackStyle"
      :class="ui.track(props.ui?.track)"
    />
    <SliderThumb
      :style="{ backgroundColor: rootContext.hexa.value }"
      :class="ui.thumb(props.ui?.thumb)"
      aria-label="Opacity"
    />
  </SliderRoot>
</template>
