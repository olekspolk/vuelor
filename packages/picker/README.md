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

This isn't a **"drop-in"** color picker. Instead, it's a collection of building blocks that let you craft exactly what you want.

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

## For TailwindCSS 4

Update the `index.css` file:

```css
@import "tailwindcss";
@source "../../node_modules/@vuelor/picker";

@theme {
  --color-vuelor-primary: #0d99ff;
  --color-vuelor-surface: #ffffff;
  --color-vuelor-border: #e6e6e6;
  --color-vuelor-input: #f5f5f5;

  --shadow-vuelor-card: 0 2px 5px 0 #00000026, 0 10px 16px 0 #0000001f, 0 0 .5px 0 #0000001f;
  --shadow-vuelor-thumb: 0px 0px .5px #0000002e, 0px 3px 8px #0000001a, 0px 1px 3px #0000001a;
  --shadow-vuelor-inner: inset 0 0 0 1px #0000001a;
}
```

## For TailwindCSS 3

Update the `tailwind.config.js` file:

```js
export default {
  content: [
    './src/**/*.{vue,js,ts}',
    './node_modules/@vuelor/picker/dist/index.js'
  ],
  theme: {
    extend: {
      colors: {
        'vuelor-primary': '#0d99ff',
        'vuelor-surface': '#ffffff',
        'vuelor-border': '#e6e6e6',
        'vuelor-input': '#f5f5f5',
      },
      boxShadow: {
        'vuelor-card': '0 2px 5px 0 #00000026, 0 10px 16px 0 #0000001f, 0 0 .5px 0 #0000001f',
        'vuelor-thumb': '0px 0px .5px #0000002e, 0px 3px 8px #0000001a, 0px 1px 3px #0000001a',
        'vuelor-inner': 'inset 0 0 0 1px #0000001a'
      }
    },
  }
}
```

## For non-tailwind projects

Import the CSS bundle and set `styling="vanillacss"` on the root component.

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

Set `styling="unstyled"` instead to strip all built-in classes and start from a blank slate.

## Available components

| Name                              | Description                                                              |
| --------------------------------- | ------------------------------------------------------------------------ |
| `ColorPickerRoot`                 | Root wrapper that manages color state and provides context to all children. |
| `ColorPickerCanvas`               | 2D gradient area for picking saturation and brightness/lightness.        |
| `ColorPickerEyeDropper`           | Button that opens the native browser eye dropper (Chrome/Edge only).     |
| `ColorPickerInputHex`             | Text input for editing the color as a hex string, with optional opacity. |
| `ColorPickerInputHSB`             | Text inputs for Hue, Saturation, and Brightness channels.                |
| `ColorPickerInputHSL`             | Text inputs for Hue, Saturation, and Lightness channels.                 |
| `ColorPickerInputRGB`             | Text inputs for Red, Green, and Blue channels (0–255).                   |
| `ColorPickerSliderAlpha`          | Slider for controlling the opacity of the current color.                 |
| `ColorPickerSliderRed`            | Slider for controlling the Red channel (0–255).                          |
| `ColorPickerSliderGreen`          | Slider for controlling the Green channel (0–255).                        |
| `ColorPickerSliderBlue`           | Slider for controlling the Blue channel (0–255).                         |
| `ColorPickerSliderHue`            | Slider for selecting the hue across the full color spectrum (0–360°).    |
| `ColorPickerSliderSaturation`     | Slider for controlling the HSL saturation.                               |
| `ColorPickerSliderLightness`      | Slider for controlling the HSL lightness.                                |
| `ColorPickerSwatch`               | Color chip that displays a preset — clicking it automatically applies the color. |
