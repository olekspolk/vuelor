# API Reference

## Components

| Name                              | Description                                                                                          |
| --------------------------------- | ---------------------------------------------------------------------------------------------------- |
| `ColorPickerRoot.vue`             | Root wrapper that manages color state and provides context to all child components.                  |
| `ColorPickerCanvas.vue`           | A 2D gradient area for picking saturation and brightness/lightness by dragging a thumb. Supports HSV and HSL color models. |
| `ColorPickerEyeDropper.vue`       | A button that opens the native browser eye dropper to sample any color from the screen. Only rendered when the EyeDropper API is available. |
| `ColorPickerInputHex.vue`         | A text input group for editing the color in hexadecimal format, with an optional opacity field.      |
| `ColorPickerInputHSB.vue`         | A text input group for editing Hue (0–360), Saturation (0–100), and Brightness (0–100) channels.    |
| `ColorPickerInputHSL.vue`         | A text input group for editing Hue (0–360), Saturation (0–100), and Lightness (0–100) channels.     |
| `ColorPickerInputRGB.vue`         | A text input group for editing the Red, Green, and Blue channels individually (0–255).               |
| `ColorPickerSliderAlpha.vue`      | A slider for controlling the opacity (alpha) of the current color.                                   |
| `ColorPickerSliderRed.vue`        | A slider for controlling the Red channel of the current color (0–255).                              |
| `ColorPickerSliderGreen.vue`      | A slider for controlling the Green channel of the current color (0–255).                            |
| `ColorPickerSliderBlue.vue`       | A slider for controlling the Blue channel of the current color (0–255).                             |
| `ColorPickerSliderHue.vue`        | A slider for selecting the hue angle across the full color spectrum (0–360°).                        |
| `ColorPickerSliderSaturation.vue` | A slider for controlling the HSL saturation of the current color.                                    |
| `ColorPickerSliderLightness.vue`  | A slider for controlling the HSL lightness of the current color.                                     |
| `ColorPickerSwatch.vue`           | A small color chip that displays a preset color. Clicking it can be used to apply that color.        |


## ColorPickerRoot.vue

The root component. Must wrap all other Vuelor components. It owns the color state and broadcasts it via Vue's provide/inject.

| Prop         | Default       | Description                                                                          |
| ------------ | ------------- | ------------------------------------------------------------------------------------ |
| modelValue   | `-`           | Current color value. Accepts `null`, a formatted string, or a `ColorObject`.        |
| defaultValue | `#B63DDAFF`   | Initial color used when `modelValue` is `null`.                                      |
| format       | `hexa`        | Controls the shape of `modelValue` and both emitted events. See the [Format](#format) table below. |
| styling      | `tailwindcss` | `tailwindcss` — uses built-in Tailwind classes. `vanillacss` — uses plain CSS class names. `unstyled` — strips all base styles. |
| disabled     | `false`       | Disables all interaction across every child component.                               |
| class        | `-`           | Extra classes applied to the root `<div>`.                                           |
| ui           | `-`           | Override styles for any slot across all child components. See [ThemeSlots](#themeslots). |

| Emit              | Description                                                                                     |
| ----------------- | ----------------------------------------------------------------------------------------------- |
| update:modelValue | Fires on every color change. The value shape matches the active `format`.                       |
| valueCommit       | Fires once the user **finishes** an interaction (pointer up, input blur). Use this to save the value without flooding your store. |

### Format

The `format` prop determines the string representation emitted by `update:modelValue` and `valueCommit`. Formats that include alpha (`hexa`, `rgba`, `hsla`, `hsva`, `object`) also enable the **opacity field** in input components.

| Value    | Example output                                                   | Alpha |
| -------- | ---------------------------------------------------------------- | ----- |
| `hex`    | `#B63DDA`                                                        | No    |
| `hexa`   | `#B63DDAFF`                                                      | Yes   |
| `rgb`    | `rgb(182, 61, 218)`                                              | No    |
| `rgba`   | `rgba(182, 61, 218, 1.00)`                                       | Yes   |
| `hsl`    | `hsl(287, 63.8%, 54.7%)`                                         | No    |
| `hsla`   | `hsla(287, 63.8%, 54.7%, 1.00)`                                  | Yes   |
| `hsv`    | `hsv(287, 72.0%, 85.5%)`                                         | No    |
| `hsva`   | `hsva(287, 72.0%, 85.5%, 1.00)`                                  | Yes   |
| `object` | `{ rgb, rgba, hsl, hsla, hsv, hsva, hex, hexa }` — see [ColorObject](#colorobject) | Yes |

### Exposed: `color`

Access the live color state directly via a template ref. This is useful for reading values, setting colors programmatically, or building custom controls.

```vue
<script setup>
import { useTemplateRef } from 'vue'
import { ColorPickerRoot } from '@vuelor/picker'

const picker = useTemplateRef('picker')

// Set color directly, bypassing v-model
function applyPreset(hexa) {
  picker.value.color.hexa.value = hexa
}
</script>

<template>
  <ColorPickerRoot ref="picker" v-model="color">
    ...
  </ColorPickerRoot>
</template>
```

| Property         | Type              | Description                                          |
| ---------------- | ----------------- | ---------------------------------------------------- |
| `color.hex`      | `Ref<string>`     | Hex string without alpha (e.g. `#B63DDA`). Settable. |
| `color.hexa`     | `Ref<string>`     | Hex string with alpha (e.g. `#B63DDAFF`). Settable.  |
| `color.rgb`      | `Ref<RGB>`        | RGB object `{ r, g, b }`. Settable.                  |
| `color.rgba`     | `Ref<RGBA>`       | RGBA object `{ r, g, b, a }`. Settable.              |
| `color.hsl`      | `Ref<HSL>`        | HSL object `{ h, s, l }`. Settable.                  |
| `color.hsla`     | `Ref<HSLA>`       | HSLA object `{ h, s, l, a }`. Settable.              |
| `color.hsv`      | `Ref<HSV>`        | HSV object `{ h, s, v }`. Settable.                  |
| `color.hsva`     | `Ref<HSVA>`       | HSVA object `{ h, s, v, a }`. Settable.              |
| `color.alpha`    | `Ref<number>`     | Alpha as an integer percentage, 0–100. Settable.     |

### ColorObject

The shape of `modelValue` when `format="object"`.

```ts
type ColorObject = {
  rgb:  { r: number, g: number, b: number }
  rgba: { r: number, g: number, b: number, a: number }
  hsl:  { h: number, s: number, l: number }
  hsla: { h: number, s: number, l: number, a: number }
  hsv:  { h: number, s: number, v: number }
  hsva: { h: number, s: number, v: number, a: number }
  hex:  string   // e.g. "#B63DDA"
  hexa: string   // e.g. "#B63DDAFF"
}
```

### ThemeSlots

Passed to the `ui` prop of `ColorPickerRoot` to override styles globally across all child components. Any slot can also be overridden locally on the child component's own `ui` prop.

```ts
type ThemeSlots = {
  picker: {
    root: string        // The root <div> of ColorPickerRoot
  },
  dropper: {
    root: string        // The EyeDropper button
  },
  shared: {
    thumb: string       // Applied to thumbs in both Canvas and all Sliders
  },
  canvas: {
    root: string        // The Canvas gradient area
  },
  slider: {
    root: string        // The Slider wrapper
    track: string       // The Slider track (coloured bar)
  },
  input: {
    group: string       // The outer wrapper of any Input component
    item: string        // Each individual channel cell
    label: string       // The channel label (R, G, B, H, etc.)
    field: string       // The <input> element
  },
  swatch: {
    root: string        // The Swatch button
    alpha: string       // The alpha overlay strip inside the Swatch
  }
}
```


## ColorPickerEyeDropper.vue

Opens the browser's native [EyeDropper API](https://developer.mozilla.org/en-US/docs/Web/API/EyeDropper). The component is **not rendered at all** when the API is unavailable (e.g. Firefox, Safari), so you don't need to add a `v-if` yourself — but you should plan your layout accordingly.

| Prop    | Default  | Description                                                                             |
| ------- | -------- | --------------------------------------------------------------------------------------- |
| as      | `button` | The HTML element or component to render as.                                             |
| asChild | `false`  | When `true`, merges all props and event listeners onto the first child element instead of rendering a wrapper. |
| class   | `-`      | Extra classes applied to the element.                                                   |

**Slots:** Default slot — place any icon or label inside the button.


## ColorPickerCanvas.vue

A 2-dimensional picking area. Dragging the thumb changes **saturation** on the X axis and **brightness** (HSV) or **lightness** (HSL) on the Y axis.

| Prop  | Default | Description                                                                                       |
| ----- | ------- | ------------------------------------------------------------------------------------------------- |
| type  | `HSV`   | Color model for the gradient. `HSV` renders a white→hue + top→black gradient. `HSL` renders a white→hue→black gradient matching the HSL lightness axis. Match this to your active input component: use `HSL` alongside `ColorPickerInputHSL`, and `HSV` alongside `ColorPickerInputHSB`. |
| wheel | `true`  | When `true`, scrolling the mouse wheel over the canvas adjusts the **hue**.                       |
| class | `-`     | Extra classes applied to the root element.                                                        |
| ui    | `-`     | `{ root?: string, thumb?: string }`                                                               |

### Keyboard interaction

When the canvas element is focused, the following keyboard shortcuts are active:

| Key                          | Action                           |
| ---------------------------- | -------------------------------- |
| `←` / `→`                    | Decrease / increase saturation by 1% |
| `↑` / `↓`                    | Increase / decrease brightness or lightness by 1% |
| `Shift` + any arrow key      | Same as above but in 10% steps  |


## ColorPickerInputHex.vue

An input group that exposes the color as a **hex string** (`#RRGGBB`) with an optional opacity field (when the active `format` includes alpha).

By default the component is uncontrolled — it reads from and writes to the picker context automatically. Pass `v-model` to take control of the value yourself (e.g. to render multiple independent pickers using the same input component).

| Prop         | Default | Description                                                                                     |
| ------------ | ------- | ----------------------------------------------------------------------------------------------- |
| modelValue   | `-`     | Optional. When provided, the component operates in **controlled mode** and emits `update:modelValue` instead of writing to the picker context. |
| class        | `-`     | Extra classes applied to the input group wrapper.                                               |
| ui           | `-`     | `Partial<{ group, item, label, field }>` — overrides individual input slots.                    |

| Emit              | Description                                               |
| ----------------- | --------------------------------------------------------- |
| update:modelValue | Emitted only in controlled mode, with the new hexa value. |

**Slots:**

| Name     | Description                                                                               |
| -------- | ----------------------------------------------------------------------------------------- |
| `before` | Rendered before the hex `#` label inside the first cell. Useful for embedding a `ColorPickerSwatch` as a preview chip. |

```vue
<ColorPickerInputHex>
  <template #before>
    <ColorPickerSwatch :value="color" />
  </template>
</ColorPickerInputHex>
```


## ColorPickerInput*.vue

Shared props for `ColorPickerInputHSB`, `ColorPickerInputHSL`, and `ColorPickerInputRGB`.

All input components update only on **blur** (not on every keystroke). Invalid values are silently discarded and the field resets to its last valid state.

The **opacity field** is rendered automatically when the active `format` includes alpha (`rgba`, `hsla`, `hsva`, `object`). There is no prop to control this; change the `format` on `ColorPickerRoot` instead.

| Prop  | Default | Description                                                              |
| ----- | ------- | ------------------------------------------------------------------------ |
| class | `-`     | Extra classes applied to the input group wrapper.                        |
| ui    | `-`     | `Partial<{ group, item, label, field }>` — overrides individual input slots. |


## ColorPickerSlider*.vue

Shared props for `ColorPickerSliderAlpha`, `ColorPickerSliderRed`, `ColorPickerSliderGreen`, `ColorPickerSliderBlue`, `ColorPickerSliderSaturation`, and `ColorPickerSliderLightness`.

| Prop        | Default      | Description                                                |
| ----------- | ------------ | ---------------------------------------------------------- |
| orientation | `horizontal` | `horizontal` or `vertical`. When vertical, the track grows upward. |
| class       | `-`          | Extra classes applied to the slider root.                  |
| ui          | `-`          | `Partial<{ root, track, thumb }>` — overrides slider slots. |


## ColorPickerSliderHue.vue

Same props as `ColorPickerSlider*.vue`, plus:

| Prop        | Default      | Description                                                                              |
| ----------- | ------------ | ---------------------------------------------------------------------------------------- |
| inverted    | `false`      | Reverses the slider direction. Useful when rendering a vertical slider where you want 0° at the top. |
| orientation | `horizontal` | `horizontal` or `vertical`.                                                              |
| class       | `-`          | Extra classes applied to the slider root.                                                |
| ui          | `-`          | `Partial<{ root, track, thumb }>`                                                        |


## ColorPickerSwatch.vue

A compact color chip. The right half of the chip shows the **transparency level** — fully transparent colors display a checkerboard pattern there.

Clicking a swatch **automatically applies** its `value` to the picker and emits `valueCommit`. No manual wiring required.

| Prop  | Default  | Description                                                                           |
| ----- | -------- | ------------------------------------------------------------------------------------- |
| value | `-`      | The hex or hexa color string this swatch represents (e.g. `#FF6900` or `#FF690080`). |
| as    | `button` | The HTML element or component to render as.                                           |
| class | `-`      | Extra classes applied to the swatch.                                                  |
| ui    | `-`      | `Partial<{ root, alpha }>` — `root` targets the chip itself; `alpha` targets the transparency overlay. |

| Emit     | Description                                              |
| -------- | -------------------------------------------------------- |
| `select` | Emitted after the color is applied, with the `value` string. Use this to run additional logic (e.g. saving recently used colors). |

```vue
<!-- Minimal — just works, no wiring needed -->
<ColorPickerSwatch value="#FF6900FF" />

<!-- With @select hook for side effects -->
<ColorPickerSwatch
  v-for="color in swatches"
  :value="color"
  @select="saveToRecents"
/>
```


## Types

All types are exported from `@vuelor/picker` and can be imported directly.

```ts
import type {
  Format,
  ColorObject,
  HSV, HSVA,
  HSL, HSLA,
  RGB, RGBA,
  Hex, Hexa,
  ColorPickerRootProps,
  ColorPickerRootEmits
} from '@vuelor/picker'
```

| Type                  | Definition                                      |
| --------------------- | ----------------------------------------------- |
| `HSV`                 | `{ h: number, s: number, v: number }`           |
| `HSVA`                | `HSV & { a: number }`                           |
| `HSL`                 | `{ h: number, s: number, l: number }`           |
| `HSLA`                | `HSL & { a: number }`                           |
| `RGB`                 | `{ r: number, g: number, b: number }`           |
| `RGBA`                | `RGB & { a: number }`                           |
| `Hex`                 | `string` — e.g. `#B63DDA`                       |
| `Hexa`                | `string` — e.g. `#B63DDAFF`                     |
| `Format`              | `'hex' \| 'hexa' \| 'rgb' \| 'rgba' \| 'hsl' \| 'hsla' \| 'hsv' \| 'hsva' \| 'object'` |
| `ColorObject`         | See [ColorObject](#colorobject) above           |
| `ColorPickerRootProps`  | Props interface for `ColorPickerRoot`         |
| `ColorPickerRootEmits`  | Emits interface for `ColorPickerRoot`         |
