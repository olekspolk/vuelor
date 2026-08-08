# Gradient

`@vuelor/gradient` extends Vuelor with a composable **gradient editor**. Like the picker, it isn't a drop-in widget — it's a set of building blocks: a framework-agnostic core that parses and serializes CSS gradient strings, a `useGradient()` composable that owns the stop-list state, and headless `GradientPicker` components you assemble into exactly the editor your design needs.

::: demo GradientPicker.vue
:::

## Installation

`@vuelor/picker` is a required peer — the gradient package builds on its color engine and theming system.

```bash
npm i @vuelor/gradient @vuelor/picker
```

::: tip Prefer a ready-made editor?
Copy a complete, editable editor straight into your project with the shadcn-vue CLI — `@vuelor/gradient-picker` for the standalone editor above, or `@vuelor/color-picker-gradient` for the full solid-color + gradient panel from the [ColorPicker Ultra](/examples/color-picker-ultra) example. See the [shadcn-vue CLI](/guide/cli) guide.
:::

## The model

`v-model` on `GradientPickerRoot` is a **CSS gradient string**. The supported grammar is exactly what the serializer emits, so values always round-trip:

| Type   | Grammar                                        | Example                                          |
| ------ | ---------------------------------------------- | ------------------------------------------------ |
| Linear | `linear-gradient(<angle>deg, <stops>)`         | `linear-gradient(90deg, #FF0000FF 0%, #0000FFFF 100%)` |
| Radial | `radial-gradient(circle at center, <stops>)`   | `radial-gradient(circle at center, #FF0000FF 0%, #0000FFFF 100%)` |
| Conic  | `conic-gradient(from <angle>deg, <stops>)`     | `conic-gradient(from 45deg, #FF0000FF 0%, #0000FFFF 100%)` |

Stops are `#hex [position%]` segments: 3/4/6/8-digit hex in any case, decimal positions rounded to integers, and omitted positions interpolated with CSS defaulting rules (first stop at 0%, last at 100%, gaps spread evenly). Parsing is all-or-nothing — one bad segment rejects the whole value, warns in dev, and leaves the editor state untouched, so a bad write can never silently drop stops.

Values are **canonicalized on write**: bind `#f00`-style shorthands and the emitted model comes back as `#FF0000FF 0%` form one tick later, matching `ColorPickerRoot`'s behavior.

## Compose an editor

```vue
<script setup>
import { ref } from 'vue'
import {
  GradientPickerRoot,
  GradientPickerSlider,
  GradientPickerAngleInput,
  GradientPickerAddStop,
  GradientPickerRemoveStop
} from '@vuelor/gradient'

const value = ref('linear-gradient(90deg, #FF98C2FF 0%, #FFFA7AFF 100%)')
</script>

<template>
  <GradientPickerRoot v-model="value">
    <GradientPickerAngleInput />
    <div class="pt-4">
      <GradientPickerSlider />
    </div>
    <div class="flex gap-1">
      <GradientPickerAddStop />
      <GradientPickerRemoveStop />
    </div>
  </GradientPickerRoot>
</template>
```

`GradientPickerRoot` owns the editor state — sorted stops, an id-tracked selection that survives reorders, the gradient type and angle — and provides it to every child. The state is also exposed to your own template through the default slot:

```html
<GradientPickerRoot v-model="value" v-slot="{ gradient, commitValue }">
  <!-- gradient is the full useGradient() instance -->
  <div v-for="stop in gradient.stops.value" :key="stop.id">
    {{ stop.position }}% — {{ stop.color }}
  </div>
</GradientPickerRoot>
```

## Editing stop colors

The composable exposes `selectedColor` — a writable ref bridging the selected stop to any color picker. Nest a `ColorPickerRoot` and bind it directly; forward the picker's `valueCommit` so color edits end with a gradient commit too:

```html
<GradientPickerRoot v-model="value" v-slot="{ gradient, commitValue }">
  <GradientPickerSlider />

  <ColorPickerRoot
    v-model="gradient.selectedColor.value"
    class="w-auto rounded-none bg-transparent p-0 shadow-none"
    @value-commit="commitValue()"
  >
    <ColorPickerCanvas />
    <ColorPickerSliderHue />
    <ColorPickerSliderAlpha />
    <ColorPickerInputHex />
  </ColorPickerRoot>
</GradientPickerRoot>
```

Selecting a stop (clicking its slider thumb) flips the nested picker to that stop's color; edits flow back into the gradient instantly.

## `update:modelValue` vs `valueCommit`

`update:modelValue` fires on **every** change — each slider tick while dragging. `valueCommit` fires once a user interaction **finishes** (pointer up, input blur, a button click) and deduplicates identical values, so use it to persist without flooding your store. All built-in components commit for you; when you mutate the engine from your own slot UI, call the slot's `commitValue` to signal the end of the interaction.

## Using the parts without components

Everything the components are built from is exported. Parse and serialize as plain functions — or drive `useGradient()` from a fully custom UI:

```ts
import { parseGradient, serializeGradient, useGradient, isGradient } from '@vuelor/gradient'

parseGradient('linear-gradient(90deg, #FF98C2 0%, #FFFA7A 100%)')
// { type: 'linear', angle: 90, stops: [{ color: '#FF98C2FF', position: 0 }, ...] }

const gradient = useGradient({ angle: 45 })
gradient.addStop()        // splits the selected segment at its color midpoint
gradient.reverse()        // mirrors positions, colors stay attached
gradient.css.value        // 'linear-gradient(45deg, ...)'
```

`isGradient(value)` is the dispatch helper for models that can hold either a plain color or a gradient — exactly how the [ColorPicker Ultra](/examples/color-picker-ultra) example switches between its solid and gradient tabs.

See the [API Reference](/gradient/api-reference) for the full component, composable and core-function surface.

## Styling

The gradient package uses the same theming system as the picker — Tailwind classes by default, with `styling="vanillacss"` and `styling="unstyled"` modes on `GradientPickerRoot`.

### TailwindCSS v4

Register the package alongside the picker so its classes survive purging, and add the thumb shadow token:

```css
@import "tailwindcss";

@source "../../node_modules/@vuelor/picker";
@source "../../node_modules/@vuelor/gradient";

@theme {
  /* ...the vuelor tokens from Getting Started... */

  /* Used by the gradient slider thumbs */
  --drop-shadow-vuelor-thumb: 0px 0px .5px #00000054, 0px 1px 3px #00000026;
}
```

### TailwindCSS v3

```js
export default {
  content: [
    './src/**/*.{vue,js,ts}',
    './node_modules/@vuelor/picker/dist/index.js',
    './node_modules/@vuelor/gradient/dist/index.js'
  ],
  theme: {
    dropShadow: {
      'vuelor-thumb': ['0px 0px .5px #00000054', '0px 1px 3px #00000026']
    }
  }
}
```

Installs through the [shadcn-vue CLI](/guide/cli) get the tokens added automatically.

### Non-Tailwind projects

Import the stylesheet and switch the styling mode:

```vue
<script setup>
import '@vuelor/gradient/style.css'
</script>

<template>
  <GradientPickerRoot v-model="value" styling="vanillacss">
    ...
  </GradientPickerRoot>
</template>
```

The design tokens (`--color-vuelor-primary`, shadows, and friends) are single-sourced in `@vuelor/picker` and compiled into both packages' stylesheets, declared on `:where(.vuelor-picker-root, .vuelor-gradient-root)` — override them on those selectors to theme every Vuelor panel at once. Set `styling="unstyled"` instead for a completely blank slate.
