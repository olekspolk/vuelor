# Getting started

This guide walks you through setting up **Vuelor** in a project that uses **TailwindCSS**.
If your project doesn’t include **Tailwind**, simply complete **Step 1** and then jump to the **"For non-Tailwind projects"** section at the end of this page.

## 1. Install the library

Install the component from your command line.

```bash
npm i @vuelor/picker
```

## 2. Import the parts

This isn’t a **"drop-in"** color picker. Instead, it’s a collection of building blocks that let you craft exactly what you want.

```vue
<script setup>
import { ref } from 'vue'
import {
  ColorPickerRoot,
  ColorPickerCanvas,
  ColorPickerSliderHue,
  ColorPickerSliderAlpha,
  ColorPickerInputHex
} from '@vuelor/picker'

const color = ref(null)
</script>

<template>
  <ColorPickerRoot v-model="color">
    <ColorPickerCanvas />
    <ColorPickerSliderHue />
    <ColorPickerSliderAlpha />
    <ColorPickerInputHex />
  </ColorPickerRoot>
</template>
```

## 3. Update tailwind.config.js

```js
export default {
  theme: {
    extend: {
      boxShadow: {
        'vuelor-card': '0 2px 5px 0 #00000026, 0 10px 16px 0 #0000001f, 0 0 .5px 0 #0000001f',
        'vuelor-thumb': '0px 0px .5px #0000002e, 0px 3px 8px #0000001a, 0px 1px 3px #0000001a'
      }
    },
  }
}
```

## For non-tailwind projects

Import CSS styles and add `styling="vanillacss"` property.

```vue
<script setup>
import '@vuelor/picker/styles.css'

import { ref } from 'vue'
import {
  ColorPickerRoot,
  ColorPickerCanvas,
  ColorPickerSliderHue,
  ColorPickerSliderAlpha,
  ColorPickerInputHex
} from '@vuelor/picker'

const color = ref(null)
</script>

<template>
  <ColorPickerRoot
    v-model="color"
    styling="vanillacss"
  >
    <ColorPickerCanvas />
    <ColorPickerSliderHue />
    <ColorPickerSliderAlpha />
    <ColorPickerInputHex />
  </ColorPickerRoot>
</template>
```
