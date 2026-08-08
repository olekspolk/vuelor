<script setup lang="ts">
import { computed } from 'vue'
import type { SliderRootProps } from 'reka-ui'
import type { UiSliderSlots } from '../utils/styles.ts'
import { SliderRoot, SliderThumb, SliderTrack } from 'reka-ui'
import { injectColorPickerContext } from './ColorPickerRoot.vue'

const rootContext = injectColorPickerContext()

// The slider works in whole percents (reka's default 0–100 range); the stored
// alpha is a 0–1 float. Rounding only happens here on read, so a bound alpha
// keeps full precision until the user actually drags the thumb.
const alphaValue = computed({
  get: () => [Math.round(rootContext.alpha.value * 100)],
  set: ([value]: number[]) => {
    rootContext.alpha.value = (value as number) / 100
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
    @value-commit="rootContext.commitValue()"
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
