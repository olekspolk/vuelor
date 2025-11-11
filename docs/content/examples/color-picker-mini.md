# ColorPicker Mini

```vue
<script setup>
import { ref } from 'vue'
import {
  ColorPickerRoot,
  ColorPickerCanvas,
  ColorPickerSliderHue
} from '@vuelor/picker'

const color =  ref(null)
</script>

<template>
  <ColorPickerRoot v-model="color">
    <ColorPickerCanvas />
    <ColorPickerSliderHue />
  </ColorPickerRoot>
</template>
```

## With vertical sliders

```vue
<script setup>
import { ref } from 'vue'
import {
  ColorPickerRoot,
  ColorPickerCanvas,
  ColorPickerSliderHue,
  ColorPickerSliderAlpha
} from '@vuelor/picker'

const color = ref(null)
</script>

<template>
  <ColorPickerRoot
    v-model="color"
    class="flex-row gap-3 w-auto"
  >
    <ColorPickerCanvas />
    <ColorPickerSliderHue orientation="vertical" />
    <ColorPickerSliderAlpha orientation="vertical" />
  </ColorPickerRoot>
</template>
```
