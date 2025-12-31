<script lang="ts" setup>
import { useForwardPropsEmits } from 'reka-ui'
import {
  ColorPickerRoot,
  ColorPickerInputHSL,
  ColorPickerSliderHue,
  ColorPickerSliderSaturation,
  ColorPickerSliderLightness,
  ColorPickerSliderAlpha,
  type ColorPickerRootProps,
  type ColorPickerRootEmits
} from '@vuelor/picker'

type ColorPickerProps = Omit<ColorPickerRootProps, 'styling' | 'ui'>

const props = defineProps<ColorPickerProps>()
const emits = defineEmits<ColorPickerRootEmits>()

const forwarded = useForwardPropsEmits(props, emits)
</script>

<template>
  <ColorPickerRoot
    class="p-3"
    :ui="{ shared: { thumb: 'border-2' } }"
    v-bind="forwarded"
  >
    <ColorPickerSliderHue />
    <ColorPickerSliderSaturation />
    <ColorPickerSliderLightness />
    <ColorPickerSliderAlpha />
    <ColorPickerInputHSL :ui="{ item: 'bg-transparent' }" />
  </ColorPickerRoot>
</template>
