<script setup lang="ts">
import { ref } from 'vue'
import ColorPickerRoot from './components/ColorPickerRoot.vue'
import ColorPickerCanvas from './components/ColorPickerCanvas.vue'
import ColorPickerSliderHue from './components/ColorPickerSliderHue.vue'
import ColorPickerSliderAlpha from './components/ColorPickerSliderAlpha.vue'
import ColorPickerInputHEX from './components/ColorPickerInputHEX.vue'

const color = ref<string>('#ffffffff')
</script>

<template>
  <div :style="{ backgroundColor: color }" class="h-screen flex items-center justify-center">
    <ColorPickerRoot v-model="color">
      <ColorPickerCanvas />
      <ColorPickerSliderHue />
      <ColorPickerSliderAlpha />
      <ColorPickerInputHEX />
    </ColorPickerRoot>
  </div>
</template>
