<script lang="ts" setup>
import { inject } from 'vue'
import { ColorPickerRoot, ColorPickerCanvas, ColorPickerSliderHue, ColorPickerSliderAlpha, ColorPickerInputHEX } from '../core'

const color = inject('color') as string
</script>

<template>
  <ColorPickerRoot v-model="color">
    <ColorPickerCanvas />
    <ColorPickerSliderHue />
    <ColorPickerSliderAlpha />
    <ColorPickerInputHEX />
  </ColorPickerRoot>
</template>
