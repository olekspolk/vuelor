# Composing `@vuelor/picker`

Vuelor is **not** a drop-in widget — it's a set of parts you arrange inside `ColorPickerRoot`. All
parts are exported from `@vuelor/picker`.

## The parts

| Component | Purpose |
| --------- | ------- |
| `ColorPickerRoot` | Required wrapper. Holds color state, provides it via context, renders a `<div>`. |
| `ColorPickerCanvas` | 2D saturation/brightness area. Prop `type: 'HSL' \| 'HSV'`. |
| `ColorPickerEyeDropper` | Native eyedropper button (Chromium browsers). Use its default slot for the icon. |
| `ColorPickerInputHex` / `ColorPickerInputRGB` / `ColorPickerInputHSL` / `ColorPickerInputHSB` | Text inputs for a color model. |
| `ColorPickerSliderHue` / `…SliderAlpha` | Hue and opacity sliders. |
| `ColorPickerSliderRed` / `…Green` / `…Blue` | RGB channel sliders. |
| `ColorPickerSliderSaturation` / `…Lightness` | HSL channel sliders. |
| `ColorPickerSwatch` | A preset chip; clicking applies its `value`. |

Sliders accept Reka UI orientation via `orientation="vertical"`.

Utilities also exported: `HexaToRGBA`, `RGBAtoHexa`, `useVModel`, `injectColorPickerContext`.

## `ColorPickerRoot` props

```ts
interface ColorPickerRootProps {
  modelValue: string | ColorObject | null   // v-model
  format?: 'hex'|'hexa'|'rgb'|'rgba'|'hsl'|'hsla'|'hsv'|'hsva'|'object'  // default 'hexa'
  styling?: 'tailwindcss' | 'vanillacss' | 'unstyled'                    // default 'tailwindcss'
  ui?: ThemeSlots          // per-slot class overrides — see rules/styling.md
  class?: string
  disabled?: boolean
  defaultValue?: string    // default '#B63DDAFF'
}
// emits: update:modelValue, valueCommit
```

The output value type follows `format`: a string for `hexa`/`rgb`/… or a full object for `object`.
Alpha controls are active when `format` is one of `hexa`, `rgba`, `hsva`, `object`.

## Minimal example

```vue
<script setup>
import { ref } from 'vue'
import { ColorPickerRoot, ColorPickerCanvas, ColorPickerSliderHue, ColorPickerSliderAlpha, ColorPickerInputHex } from '@vuelor/picker'
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

## Building a reusable wrapper (the pattern the examples use)

To wrap the picker as your own component that forwards all root props/emits, use Reka UI's
`useForwardPropsEmits` and re-export the root's prop/emit types:

```vue
<script lang="ts" setup>
import { useForwardPropsEmits } from 'reka-ui'
import { ColorPickerRoot, ColorPickerCanvas, ColorPickerSliderHue,
  type ColorPickerRootProps, type ColorPickerRootEmits } from '@vuelor/picker'

const props = defineProps<Omit<ColorPickerRootProps, 'styling' | 'ui'>>()
const emits = defineEmits<ColorPickerRootEmits>()
const forwarded = useForwardPropsEmits(props, emits)
</script>

<template>
  <ColorPickerRoot v-bind="forwarded">
    <ColorPickerCanvas />
    <ColorPickerSliderHue />
  </ColorPickerRoot>
</template>
```

## Reading state in a custom child part

A custom part rendered inside the root can read live color state and the `ui` slot helpers from
context — this is how the gradient editor's percentage input works:

```ts
import { injectColorPickerContext } from '@vuelor/picker'
const ctx = injectColorPickerContext()
// ctx.hexa, ctx.rgba, ctx.hsl, ctx.alpha, ctx.disabled, ctx.isAlphaEnabled, ctx.uiSlots('input'), ctx.commitValue()
```

To read the current color from a parent via a template ref, `ColorPickerRoot` exposes `color`:
`colorPickerRef.value?.color.hexa.value`.
