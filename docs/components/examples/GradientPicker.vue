<script lang="ts" setup>
import { ref } from 'vue'
import {
  GradientPickerRoot,
  GradientPickerSlider,
  GradientPickerPreview,
  GradientPickerPositionInput,
  GradientPickerAngleInput,
  GradientPickerAddStop,
  GradientPickerRemoveStop,
  GradientPickerReverse,
  GradientPickerRotate
} from '@vuelor/gradient'
import { ColorPickerRoot, ColorPickerCanvas } from '@vuelor/picker'
import { ColorPickerSliderHue, ColorPickerSliderAlpha, ColorPickerInputHex } from '@vuelor/picker'

const value = ref('linear-gradient(90deg, #FF98C2FF 0%, #4DC1FFFF 50%, #FFFA7AFF 100%)')
</script>

<template>
  <!-- The panel surface is always light, so it declares its own text color —
       otherwise a dark host page bleeds light text into it via inheritance
       (and via Tailwind preflight's `button { color: inherit }`). -->
  <GradientPickerRoot
    v-slot="{ gradient, commitValue }"
    v-model="value"
    class="text-black"
  >
    <div class="flex items-center justify-between">
      <GradientPickerAngleInput />
      <div class="flex items-center gap-1">
        <GradientPickerReverse />
        <GradientPickerRotate />
        <GradientPickerRemoveStop />
        <GradientPickerAddStop />
      </div>
    </div>

    <div class="pt-4">
      <GradientPickerSlider />
    </div>

    <!-- The nested picker edits the selected stop through the selectedColor
         bridge and forwards its end-of-interaction signal to the gradient. -->
    <ColorPickerRoot
      v-model="gradient.selectedColor.value"
      class="w-auto rounded-none bg-transparent p-0 shadow-none"
      :ui="{ input: { label: 'hidden' } }"
      @value-commit="commitValue()"
    >
      <ColorPickerCanvas class="h-28" />
      <ColorPickerSliderHue />
      <ColorPickerSliderAlpha />
      <div class="flex items-center gap-2">
        <GradientPickerPositionInput />
        <ColorPickerInputHex class="flex-1" />
      </div>
    </ColorPickerRoot>

    <GradientPickerPreview />
  </GradientPickerRoot>
</template>
