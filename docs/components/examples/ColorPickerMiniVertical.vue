<script lang="ts" setup>
import { useForwardPropsEmits } from 'reka-ui'
import {
  ColorPickerRoot,
  ColorPickerCanvas,
  ColorPickerSliderHue,
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
    class="flex-row gap-3 w-auto"
    v-bind="forwarded"
  >
    <ColorPickerCanvas />
    <ColorPickerSliderHue orientation="vertical" />
    <ColorPickerSliderAlpha orientation="vertical" />
  </ColorPickerRoot>
</template>
