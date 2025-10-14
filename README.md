# vuelor/picker

ColorPicker component based on reka-ui and tailwindCSS.

```vue
<script lang="ts" setup>
import { ref } from 'vue'
import {
  ColorPickerRoot,
  ColorPickerCanvas,
  ColorPickerSliderHue,
  ColorPickerSliderAlpha,
  ColorPickerInputHEX
} from 'vuelor/picker'

const color = ref(null)
</script>

<template>
  <ColorPickerRoot v-model="color">
    <ColorPickerCanvas />
    <ColorPickerSliderHue />
    <ColorPickerSliderAlpha />
    <ColorPickerInputHEX />
  </ColorPickerRoot>
</template>
```
