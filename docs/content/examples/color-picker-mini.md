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
    format="object"
    class="flex-row gap-3 w-auto"
  >
    <ColorPickerCanvas />
    <ColorPickerSliderHue
      orientation="vertical"
      :ui="{
        track: 'rounded-sm',
        thumb: 'w-6 h-2 border-4'
      }"
    />
    <ColorPickerSliderAlpha
      orientation="vertical"
      :ui="{
        track: 'rounded-sm',
        thumb: 'w-6 h-2 border-4'
      }"
    />
  </ColorPickerRoot>
</template>
```
