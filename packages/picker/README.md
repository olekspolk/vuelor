<br />
<p align="center">
  <a href="https://github.com/olekspolk/vuelor">
    <img src="https://vuelor.dev/poster.png?v=2" alt="Examples" width="615" />
  </a>
</p>
<h1 align="center">Vuelor</h1>

<p align="center">
Vuelor — a truly flexible, accessible, and Tailwind-ready color picker with developer experience in mind.
</p>

<p align="center">
 <a href="https://vuelor.dev">Documentation</a> | <a href="https://vuelor.dev/guide/getting-started.html">Getting Started</a> | <a href="https://vuelor.dev/examples/">Examples</a>
</p>

## Installation

```bash
npm install @vuelor/picker
```

```bash
pnpm add @vuelor/picker
```

```bash
yarn add @vuelor/picker
```

## Import the parts

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

## Update tailwind.config.js

```js
export default {
  theme: {
    extend: {
      boxShadow: {
        'vuelor-card': '0 2px 5px 0 #00000026, 0 10px 16px 0 #0000001f, 0 0 .5px 0 #0000001f',
        'vuelor-thumb': '0px 0px .5px #0000002e, 0px 3px 8px #0000001a, 0px 1px 3px #0000001a',
        'vuelor-inner': 'inset 0 0 0 1px #0000001a'
      }
    },
    dropShadow: {
      'vuelor-thumb': ['0px 0px .5px #00000054', '0px 1px 3px #00000026']
    }
  }
}
```

## Update CSS file to include external tailwind source

```css
@import "tailwindcss";
@source "../node_modules/@vuelor/picker";
```

## For non-tailwind projects

Import CSS styles and add `styling="vanillacss"` property.

```vue
<script setup>
import '@vuelor/picker/style.css'

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

## Available components

| Name                              |
| ----------------------------------|
| `ColorPickerRoot.vue`             |
| `ColorPickerCanvas.vue`           |
| `ColorPickerEyeDropper.vue`       |
| `ColorPickerInputHSB.vue`         |
| `ColorPickerInputHSL.vue`         |
| `ColorPickerInputRGB.vue`         |
| `ColorPickerSliderAlpha.vue`      |
| `ColorPickerSliderRed.vue`        |
| `ColorPickerSliderGreen.vue`      |
| `ColorPickerSliderBlue.vue`       |
| `ColorPickerSliderHue.vue`        |
| `ColorPickerSliderSaturation.vue` |
| `ColorPickerSliderLightness.vue`  |
| `ColorPickerSwatch.vue`           |
