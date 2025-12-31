<script lang="ts" setup>
import { useForwardPropsEmits } from 'reka-ui'
import {
  ColorPickerRoot,
  ColorPickerCanvas,
  ColorPickerSliderHue,
  type ColorPickerRootProps,
  type ColorPickerRootEmits,
} from '@vuelor/picker'

type ColorPickerProps = Omit<ColorPickerRootProps, 'styling' | 'ui'>

const props = defineProps<ColorPickerProps>()
const emits = defineEmits<ColorPickerRootEmits>()

const forwarded = useForwardPropsEmits(props, emits)
</script>

<template>
  <ColorPickerRoot v-bind="forwarded">
    <ColorPickerCanvas />
    <ColorPickerSliderHue />
  </ColorPickerRoot>
</template>
