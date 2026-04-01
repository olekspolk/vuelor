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

## 3. Registering Vuelor Utilities

To ensure Tailwind CSS correctly processes the styles used within `@vuelor/picker`, you must explicitly include the package in your project's configuration. This prevents Tailwind from purging essential classes during the build process.

### TailwindCSS v4 (CSS-first)

Add the `@source` directive and your theme variables to your main CSS entry point (e.g., `src/assets/index.css`).

```css
@import "tailwindcss";

/* 1. Tell Tailwind to scan the package for used classes */
@source "../../node_modules/@vuelor/picker";

/* 2. Define the Vuelor Design System tokens */
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

### TailwindCSS v3 (JavaScript Configuration)

Update your `tailwind.config.js` to include the package path in the `content` array and extend the theme with Vuelor tokens.

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

## Choosing a color format

By default `modelValue` is emitted as a `hexa` string (e.g. `#B63DDAFF`). Use the `format` prop to change the shape:

```vue
<!-- Emit an RGB CSS string: "rgb(182, 61, 218)" -->
<ColorPickerRoot v-model="color" format="rgb">
...
</ColorPickerRoot>

<!-- Emit a plain object with all formats at once -->
<ColorPickerRoot v-model="color" format="object">
...
</ColorPickerRoot>
```

Formats that include alpha (`hexa`, `rgba`, `hsla`, `hsva`, `object`) automatically show the **opacity field** inside input components. See the [Format table](/guide/api-reference#format) in the API reference for the full list.

## Adding color presets

Use `ColorPickerSwatch` to add preset chips — clicking one **automatically applies** that color with no extra wiring:

```vue
<script setup>
import { ColorPickerRoot, ColorPickerCanvas, ColorPickerSliderHue, ColorPickerSwatch } from '@vuelor/picker'

const presets = ['#FF6900FF', '#0693E3FF', '#00D084FF']
</script>

<template>
  <ColorPickerRoot v-model="color">
    <ColorPickerCanvas />
    <ColorPickerSliderHue />
    <div class="flex gap-1">
      <ColorPickerSwatch v-for="preset in presets" :key="preset" :value="preset" />
    </div>
  </ColorPickerRoot>
</template>
```

Use `@select` if you need a side-effect hook (e.g. saving to a recent-colors list):

```vue
<ColorPickerSwatch :value="preset" @select="addToRecents" />
```

## Accessing the color state directly

`ColorPickerRoot` exposes its internal `color` object via a template ref. This is useful for reading the current value in any format or setting a color imperatively from outside the picker:

```vue
<script setup>
import { useTemplateRef } from 'vue'
import { ColorPickerRoot, ColorPickerCanvas, ColorPickerSliderHue } from '@vuelor/picker'

const picker = useTemplateRef('picker')
</script>

<template>
  <ColorPickerRoot ref="picker" v-model="color">
    <ColorPickerCanvas />
    <ColorPickerSliderHue />
  </ColorPickerRoot>

  <button @click="picker.color.hexa.value = '#FF6900FF'">Reset</button>
</template>
```

## Usage Without Tailwind CSS

If your project does not use Tailwind CSS, you can use the built-in "Vanilla CSS" mode. This ensures all components are styled correctly using pre-compiled CSS.

::: tip EyeDropper browser support
`ColorPickerEyeDropper` relies on the [EyeDropper API](https://developer.mozilla.org/en-US/docs/Web/API/EyeDropper), which is currently supported in Chrome and Edge but **not** in Firefox or Safari. The component is automatically hidden when the API is unavailable — no `v-if` needed — but make sure your layout doesn't leave an awkward gap in unsupported browsers.
:::

### Enable Vanilla Styling

To use the standalone styles, import the CSS bundle and set the `styling` prop to `"vanillacss"` on the root component.

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
