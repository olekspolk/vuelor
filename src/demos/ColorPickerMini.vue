<script lang="ts" setup>
import { inject } from 'vue'
import { ColorPickerRoot, ColorPickerCanvas, ColorPickerSliderHue } from '../core'

const color = inject('color') as string
</script>

<template>
  <div class="flex items-center gap-4">
    <ColorPickerRoot v-model="color">
      <ColorPickerCanvas />
      <ColorPickerSliderHue />
    </ColorPickerRoot>
    <ColorPickerRoot
      v-model="color"
      class="flex-row"
    >
      <ColorPickerCanvas />
      <ColorPickerSliderHue orientation="vertical" />
    </ColorPickerRoot>
  </div>
</template>
