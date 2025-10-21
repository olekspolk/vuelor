<script lang="ts" setup>
import type { Ref } from 'vue'
import { inject } from 'vue'
import {
  ColorPickerRoot,
  ColorPickerCanvas,
  ColorPickerSliderHue,
  ColorPickerSliderAlpha,
  ColorPickerInputRGB,
  ColorPickerSliderRed,
  ColorPickerSliderGreen,
  ColorPickerSliderBlue,
} from '../core'

const color = inject('color') as Ref<string>
</script>

<template>
  <ColorPickerRoot v-model="color">
    <ColorPickerCanvas />
    <ColorPickerSliderHue />
    <ColorPickerSliderAlpha />
    <ColorPickerInputRGB />
    <ColorPickerSliderRed />
    <ColorPickerSliderGreen />
    <ColorPickerSliderBlue />
  </ColorPickerRoot>
</template>
