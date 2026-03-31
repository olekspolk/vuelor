# Customization

If you've worked with **Nuxt UI** before, much of what you'll find here will feel instantly familiar.
Every **Vuelor** component comes with two styling entry points — the `class` and `ui` props — giving you full control over how your color picker looks.

The `class` prop applies styles directly to the **root element** of the component.
This is perfect for quick adjustments like sizing, layout, or borders using your own Tailwind classes or custom CSS.

The `ui` prop provides **fine-grained customization** through named slots — similar to the approach used in **tailwind-variants**.
Each slot represents a specific part of the component (for example, `canvas`, `slider`, or `thumb`), allowing you to override or extend styles for just that piece without touching the rest.

## Using TailwindCSS

The library uses `tailwind-merge` under the hood, so you don't need to worry about conflicting class names. Style priority is straightforward:

1. **Vuelor's internal styles** are the base.
2. Overridden by styles passed to the `ui` prop of `ColorPickerRoot` (applies globally to all children).
3. Further overridden by the `ui` prop of any individual **child component** (applies locally).

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

const theme = {
  slider: {
    track: 'h-3'        // Applied to all sliders' tracks
  },
  shared: {
    thumb: 'border-1'   // Applied to both canvas and sliders' thumbs
  },
  input: {
    group: 'rounded-lg'
  }
}
</script>

<template>
  <ColorPickerRoot v-model="color" :ui="theme">
    <!-- class targets the root element; ui.thumb overrides only this canvas's thumb -->
    <ColorPickerCanvas
      class="rounded-lg"
      :ui="{ thumb: 'h-6 w-6' }"
    />
    <ColorPickerSliderHue />
    <ColorPickerSliderAlpha />
    <ColorPickerInputHex />
  </ColorPickerRoot>
</template>
```

### Available slots and their defaults

These are all the slots you can target via the `ui` prop, along with the default Tailwind classes applied by the built-in theme:

```js
{
  picker: {
    root: 'w-60 bg-vuelor-surface shadow-vuelor-card rounded-[13px] p-4 flex flex-col gap-2'
  },
  dropper: {
    base: 'enabled:hover:bg-black/5 disabled:opacity-50 rounded-[5px] focus-within:outline-1 focus-within:outline-vuelor-primary p-1'
  },
  shared: {
    // Applied to the thumb in both ColorPickerCanvas and all slider components
    thumb: 'block w-4 h-4 rounded-full border-4 border-white shadow-vuelor-thumb focus:outline-1 outline-vuelor-primary'
  },
  canvas: {
    root: 'relative w-full h-52 touch-none rounded-[5px] outline-1 outline-solid -outline-offset-1 outline-black/10 data-[disabled]:pointer-events-none data-[disabled]:opacity-50'
  },
  slider: {
    root: 'relative h-4 w-full flex items-center select-none touch-none data-[orientation=vertical]:h-auto data-[orientation=vertical]:w-4 data-[orientation=vertical]:flex-col data-[disabled]:pointer-events-none data-[disabled]:opacity-50',
    track: 'relative h-4 w-full shadow-vuelor-inner grow rounded-full data-[orientation=vertical]:h-full data-[orientation=vertical]:w-4'
  },
  input: {
    group: 'w-full flex gap-[1px] rounded-[5px] hover:outline-1 outline-vuelor-border focus-within:outline-1 focus-within:outline-vuelor-primary data-[disabled]:pointer-events-none data-[disabled]:opacity-50 data-[disabled]:outline-none',
    item: 'flex flex-1 data-[before]:grow-0 data-[alpha-input]:grow-0 items-center px-1 gap-1 bg-vuelor-input first:rounded-l-[5px] last:rounded-r-[5px]',
    label: 'select-none text-black text-[11px] opacity-40 data-[alpha-label]:block',
    field: 'w-full min-w-5 h-6 text-[11px] focus:outline-none'
  },
  swatch: {
    base: 'relative grow-0 h-4 w-4 rounded-[20%] overflow-hidden focus-within:outline-1 focus-within:outline-vuelor-primary disabled:opacity-50',
    alpha: 'absolute top-0 right-0 h-full w-1/2'
  }
}
```

### Data attributes

Components add data attributes that you can target in your custom classes:

| Attribute                  | Element                          | Present when                          |
| -------------------------- | -------------------------------- | ------------------------------------- |
| `data-disabled`            | Canvas, Slider root, Input group | The picker is disabled                |
| `data-orientation="vertical"` | Slider root and track         | `orientation="vertical"` is set       |
| `data-alpha-input`         | Input item cell                  | The cell contains the opacity field   |
| `data-alpha-label`         | Input label span                 | The label belongs to the opacity field |

## Removing all styles (unstyled mode)

Set `styling="unstyled"` to strip every built-in class. This gives you a completely blank slate — no layout, no colours, no sizing — so you can apply your own design system from scratch.

```vue
<ColorPickerRoot v-model="color" styling="unstyled">
  <ColorPickerCanvas class="relative w-full h-64 rounded-xl" />
  <ColorPickerSliderHue class="h-4 w-full mt-2" />
</ColorPickerRoot>
```

## Using custom CSS

If you prefer to style components using **plain CSS** instead of Tailwind, set `styling="vanillacss"` on the root component and override the following class names in your stylesheet.

```html
<ColorPickerRoot v-model="color" styling="vanillacss">
  ...
</ColorPickerRoot>
```

```js
// Class names applied per slot in vanillacss mode
{
  picker:  { root:  'vuelor-picker-root' },
  dropper: { base:  'vuelor-picker-eye-dropper' },
  shared:  { thumb: 'vuelor-picker-shared-thumb' },
  canvas:  { root:  'vuelor-picker-canvas-root' },
  slider:  { root:  'vuelor-picker-slider-root', track: 'vuelor-picker-slider-track' },
  input: {
    group: 'vuelor-picker-input-group',
    item:  'vuelor-picker-input-item',
    label: 'vuelor-picker-input-label',
    field: 'vuelor-picker-input-field'
  },
  swatch:  { base: 'vuelor-picker-swatch-base', alpha: 'vuelor-picker-swatch-alpha' }
}
```

::: info
The default CSS file is available at `@vuelor/picker/style.css` — import it and override whichever classes you need. You can view the source at [@vuelor/picker/style.css](https://github.com/olekspolk/vuelor/blob/main/packages/picker/src/style/index.css).
:::
