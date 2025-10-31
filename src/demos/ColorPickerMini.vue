<script lang="ts" setup>
import { inject } from 'vue'
import {
  ColorPickerRoot,
  ColorPickerCanvas,
  ColorPickerSliderHue,
  ColorPickerSliderAlpha
} from '../core'

const color = inject('color') as string
</script>

<template>
  <div class="flex items-center gap-4">
    <ColorPickerRoot format="object" v-model="color">
      <ColorPickerCanvas />
      <ColorPickerSliderHue />
    </ColorPickerRoot>
    <ColorPickerRoot
      format="object"
      v-model="color"
      class="flex-row"
    >
      <ColorPickerCanvas />
      <ColorPickerSliderHue orientation="vertical" />
      <ColorPickerSliderAlpha
        orientation="vertical"
        :ui="{
          track: 'rounded-sm',
          thumb: 'w-6 h-2 border-4'
        }"
      />
    </ColorPickerRoot>
  </div>
</template>
