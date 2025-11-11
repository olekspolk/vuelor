# ColorPicker Sliders

```vue
<script setup>
import { ref } from 'vue'
import {
  ColorPickerRoot,
  ColorPickerInputRGB,
  ColorPickerSliderRed,
  ColorPickerSliderGreen,
  ColorPickerSliderBlue,
  ColorPickerSliderAlpha
} from '@vuelor/picker'

const color = ref(null)
</script>

<template>
  <ColorPickerRoot v-model="color">
    <ColorPickerInputRGB />
    <ColorPickerSliderRed />
    <ColorPickerSliderGreen />
    <ColorPickerSliderBlue />
    <ColorPickerSliderAlpha />
  </ColorPickerRoot>
</template>
```
