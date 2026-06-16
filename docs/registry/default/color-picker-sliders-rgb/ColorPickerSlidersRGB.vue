<script lang="ts" setup>
import { useForwardPropsEmits } from 'reka-ui'
import {
  ColorPickerRoot,
  ColorPickerInputRGB,
  ColorPickerSliderRed,
  ColorPickerSliderGreen,
  ColorPickerSliderBlue,
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
    class="p-3 pl-2"
    :ui="{ shared: { thumb: 'border-2' } }"
    v-bind="forwarded"
  >
    <div class="flex gap-2">
      <ColorPickerInputRGB
        :ui="{
          group: 'flex-col w-12',
          item: 'bg-transparent last:flex-row-reverse',
          label: 'w-5'
        }"
      />
      <div class="flex flex-col justify-around flex-1">
        <ColorPickerSliderRed />
        <ColorPickerSliderGreen />
        <ColorPickerSliderBlue />
        <ColorPickerSliderAlpha />
      </div>
    </div>
  </ColorPickerRoot>
</template>
