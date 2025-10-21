<script lang="ts" setup>
import type { Ref } from 'vue'
import { inject } from 'vue'
import {
  ColorPickerRoot,
  ColorPickerCanvas,
  ColorPickerInputRGB,
  ColorPickerInputHSL,
  ColorPickerSliderHue,
  ColorPickerSliderSaturation,
  ColorPickerSliderLightness,
  ColorPickerSliderRed,
  ColorPickerSliderGreen,
  ColorPickerSliderBlue,
} from '../core'

const color = inject('color') as Ref<string>
</script>

<template>
  <ColorPickerRoot
    format="hex"
    v-model="color"
  >
    <ColorPickerCanvas />
    <ColorPickerInputHSL />
    <ColorPickerSliderHue />
    <ColorPickerSliderSaturation />
    <ColorPickerSliderLightness />
    <!-- RGB -->
    <ColorPickerInputRGB />
    <ColorPickerSliderRed />
    <ColorPickerSliderGreen />
    <ColorPickerSliderBlue />
  </ColorPickerRoot>
</template>
