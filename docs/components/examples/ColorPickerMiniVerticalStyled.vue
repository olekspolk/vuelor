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
    class="bg-transparent p-0 !shadow-none flex-row gap-3 w-auto"
    v-bind="forwarded"
  >
    <ColorPickerCanvas
      :ui="{
        area: 'rounded-none',
        thumb: 'border-2'
      }"
    />
    <ColorPickerSliderHue
      orientation="vertical"
      :ui="{
        track: 'rounded-none',
        thumb: 'w-6 h-2 border-4'
      }"
    />
    <ColorPickerSliderAlpha
      orientation="vertical"
      :ui="{
        track: 'rounded-none',
        thumb: 'w-6 h-2 border-4'
      }"
    />
  </ColorPickerRoot>
</template>
