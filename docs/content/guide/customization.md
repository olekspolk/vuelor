# Customization

If you’ve worked with **Nuxt UI** before, much of what you’ll find here will feel instantly familiar.
Every **Vuelor** component comes with two styling entry points — the `class` and `ui` props — giving you full control over how your color picker looks.

The `class` prop applies styles directly to the **root element** of the component.
This is perfect for quick adjustments like sizing, layout, or borders using your own Tailwind classes or custom CSS.

The `ui` prop, on the other hand, provides **fine-grained customization** through named slots — similar to the approach used in **tailwind-variants**.
Each slot represents a specific part of the component (for example, `canvas`, `slider`, or `thumb`), allowing you to override or extend styles for just that piece without touching the rest.

## Using TailwindCSS

The library uses tailwind-merge under the hood, so you don’t need to worry about conflicting class names. Style priority is straightforward:
* **Vuelor’s internal styles** are the base.
* They can be overridden by the styles you pass to the `ui` prop of the `ColorPickerRoot`.
* Those, in turn, can be further overridden by the `ui` props of any **child components**.

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

const theme = {
  slider: {
    track: 'h-3' // Applyed to sliders' tracks
  },
  shared: {
    thumb: 'border-1' // Applyed to both canvas and sliders' thumbs
  },
  input: {
    group: 'rounded-lg',
    field: 'first:rounded-left-lg last:rounded-right-lg'
  }
}
</script>

<template>
  <ColorPickerRoot v-model="color" :ui="theme">
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

### The list of available slots

```js
export default {
  picker: {
    root: 'bg-white rounded-[13px] p-4 flex flex-col gap-2 shadow-[var(--elevation-card)]'
  },
  dropper: {
    base: 'hover:bg-[#0000000d] rounded-[5px] focus:outline-1 outline-[#0d99ff] p-1'
  },
  shared: {
    thumb: 'block w-4 h-4 rounded-full border-4 border-white shadow-[var(--elevation-thumb)] focus:outline-1 outline-[#0d99ff]'
  },
  canvas: {
    root: 'relative data-disabled:pointer-events-none data-disabled:opacity-50',
    area: 'rounded-[5px] outline-1 outline-solid -outline-offset-1 outline-[#0000001a]'
  },
  slider: {
    root: 'relative h-4 w-full data-[orientation=vertical]:h-auto data-[orientation=vertical]:w-4 flex items-center data-[orientation=vertical]:flex-col select-none touch-none data-disabled:pointer-events-none data-disabled:opacity-50',
    track: 'relative h-4 w-full data-[orientation=vertical]:h-full data-[orientation=vertical]:w-4 grow rounded-full shadow-[inset_0_0_0_1px_#0000001a]'
  },
  input: {
    group: 'w-full flex gap-[1px] rounded-[5px] hover:outline-1 outline-[#e6e6e6] focus-within:outline-1 focus-within:outline-[#0d99ff] data-[disabled]:pointer-events-none data-[disabled]:opacity-50',
    field: 'w-7 flex-1 bg-[#f5f5f5] first:rounded-l-[5px] last:rounded-r-[5px] px-2 h-6 focus:outline-none text-[11px]'
  }
}
```

## Using custom CSS

If you prefer to style components using **plain CSS** instead of Tailwind, you can easily switch modes.
Set the `styling` prop to `"vanillacss"` on your root component, and then override the following class names in your stylesheet.

```js
export default {
  picker: {
    root: 'vuelor-picker-root'
  },
  dropper: {
    base: 'vuelor-picker-eye-dropper'
  },
  shared: {
    thumb: 'vuelor-picker-shared-thumb'
  },
  canvas: {
    root: 'vuelor-picker-canvas-root',
    area: 'vuelor-picker-canvas-area'
  },
  slider: {
    root: 'vuelor-picker-slider-root',
    track: 'vuelor-picker-slider-track'
  },
  input: {
    group: 'vuelor-picker-input-group',
    field: 'vuelor-picker-input-field'
  }
}
```

::: info
You can view an example CSS file at [vuelor/picker/styles.css.](https://github.com/olekspolk/vuelor/packages/picker/src/styles/styles.css)
:::
