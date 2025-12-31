<script lang="ts" setup>
import { useForwardPropsEmits } from 'reka-ui'
import {
  ColorPickerRoot,
  ColorPickerCanvas,
  ColorPickerSliderHue,
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
    class="bg-transparent p-0 !shadow-none gap-3 w-auto"
    v-bind="forwarded"
  >
    <ColorPickerCanvas
      :ui="{
        area: 'rounded-lg',
        thumb: 'h-6 w-6 border'
      }"
    />
    <ColorPickerSliderHue :ui="{ thumb: 'border' }" />
  </ColorPickerRoot>
</template>
