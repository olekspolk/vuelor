<h1 align="center">@vuelor/gradient</h1>

<p align="center">
Composable Vue gradient editor — CSS gradient parsing, a <code>useGradient</code> composable and headless <code>GradientPicker</code> components, built with Reka UI and Tailwind CSS on top of <a href="https://www.npmjs.com/package/@vuelor/picker">@vuelor/picker</a>.
</p>

<p align="center">
 <a href="https://vuelor.dev">Documentation</a> | <a href="https://vuelor.dev/examples/">Examples</a>
</p>

## Installation

```bash
pnpm add @vuelor/gradient @vuelor/picker
```

## Compose an editor

```vue
<script setup>
import { ref } from 'vue'
import {
  GradientPickerRoot,
  GradientPickerSlider,
  GradientPickerAngleInput,
  GradientPickerAddStop,
  GradientPickerRemoveStop,
  GradientPickerReverse,
  GradientPickerRotate
} from '@vuelor/gradient'
import { ColorPickerRoot, ColorPickerCanvas, ColorPickerSliderHue, ColorPickerSliderAlpha, ColorPickerInputHex } from '@vuelor/picker'

const value = ref('linear-gradient(90deg, #FF98C2FF 0%, #FFFA7AFF 100%)')
</script>

<template>
  <GradientPickerRoot v-model="value" v-slot="{ gradient }">
    <div class="flex items-center justify-between">
      <GradientPickerAngleInput />
      <div class="flex items-center gap-1">
        <GradientPickerReverse />
        <GradientPickerRotate />
        <GradientPickerAddStop />
        <GradientPickerRemoveStop />
      </div>
    </div>

    <div class="pt-4">
      <GradientPickerSlider />
    </div>

    <ColorPickerRoot v-model="gradient.selectedColor.value" class="shadow-none p-0 w-auto">
      <ColorPickerCanvas />
      <ColorPickerSliderHue />
      <ColorPickerSliderAlpha />
      <ColorPickerInputHex />
    </ColorPickerRoot>
  </GradientPickerRoot>
</template>
```

`v-model` is a CSS gradient string. Supported grammar (what the serializer emits, so values round-trip):

- `linear-gradient(<angle>deg, <stops>)`
- `radial-gradient(circle at center, <stops>)`
- `conic-gradient(from <angle>deg, <stops>)`

with stops as `#hex [position%]` (3/4/6/8-digit hex, missing positions interpolated like CSS).

## Use the parts without components

```ts
import { parseGradient, serializeGradient, useGradient } from '@vuelor/gradient'

const parsed = parseGradient('linear-gradient(90deg, #FF98C2 0%, #FFFA7A 100%)')
// { type: 'linear', angle: 90, stops: [{ color: '#FF98C2FF', position: 0 }, …] }

const gradient = useGradient({ stops: parsed.stops })
gradient.addStop()          // splits the selected segment at its midpoint
gradient.css.value          // 'linear-gradient(90deg, …)'
```

## Styling

The components use the same theming system as `@vuelor/picker` — Tailwind classes by default, `styling="vanillacss"` with `import '@vuelor/gradient/style.css'` for non-Tailwind projects, or `styling="unstyled"` for a blank slate. Tailwind v4 users must add `@source "../../node_modules/@vuelor/gradient";` to their global CSS (alongside the same line for the picker), plus the `--drop-shadow-vuelor-thumb` token documented at [vuelor.dev](https://vuelor.dev).
