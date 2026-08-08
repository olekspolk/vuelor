# Gradient API Reference

Everything on this page is exported from `@vuelor/gradient`. For the color-picker components used alongside it, see the [picker API Reference](/guide/api-reference).

## Components

| Name                              | Description                                                                                          |
| --------------------------------- | ---------------------------------------------------------------------------------------------------- |
| `GradientPickerRoot.vue`          | Root wrapper that owns the gradient state (stops, selection, type, angle) and provides context to all child components. |
| `GradientPickerSlider.vue`        | Multi-thumb stops slider with crossing-safe selection — dragging a stop past a neighbour keeps its color and selection attached. |
| `GradientPickerPositionInput.vue` | Text input editing a stop's position as a percentage.                                                |
| `GradientPickerAngleInput.vue`    | Text input editing the gradient angle in degrees. Disables itself for radial gradients.              |
| `GradientPickerAddStop.vue`       | Button that splits the selected segment at its position/color midpoint.                              |
| `GradientPickerRemoveStop.vue`    | Button that removes a stop and reselects its left neighbour.                                         |
| `GradientPickerReverse.vue`       | Button that mirrors the gradient — positions and colors reverse together.                            |
| `GradientPickerRotate.vue`        | Button that rotates the angle by a step (90° by default). Disables itself for radial gradients.      |
| `GradientPickerPreview.vue`       | Element whose background renders the current gradient (or the flat stop strip).                      |


## GradientPickerRoot.vue

The root component. Must wrap all other `GradientPicker` components. It creates the [`useGradient()`](#usegradient) engine and broadcasts it via Vue's provide/inject.

| Prop         | Default                                          | Description                                                                          |
| ------------ | ------------------------------------------------ | ------------------------------------------------------------------------------------ |
| modelValue   | `-`                                              | Current value as a CSS gradient string, or `null`. See [The model](/gradient/#the-model) for the grammar. |
| defaultValue | `linear-gradient(90deg, #FF98C2FF 0%, #FFFA7AFF 100%)` | Applied when `modelValue` is `null`. Warns in dev if it doesn't parse.        |
| styling      | `tailwindcss`                                    | `tailwindcss` — built-in Tailwind classes. `vanillacss` — plain `vuelor-gradient-*` class names. `unstyled` — strips all base styles. |
| disabled     | `false`                                          | Disables all interaction across every child component.                               |
| minStops     | `2`                                              | Read once at mount. Bounds the remove-stop interaction only; never below 2 (the CSS minimum). |
| maxStops     | `8`                                              | Read once at mount. Bounds the add-stop interaction only — a parsed `modelValue` keeps however many stops it declares. |
| class        | `-`                                              | Extra classes applied to the root `<div>`.                                           |
| ui           | `-`                                              | Override styles for any slot across all child components. See [GradientThemeSlots](#gradientthemeslots). |

| Emit              | Description                                                                                     |
| ----------------- | ----------------------------------------------------------------------------------------------- |
| update:modelValue | Fires on every gradient change — including each tick of a thumb drag.                           |
| valueCommit       | Fires once the user **finishes** an interaction (pointer up, input blur, button click). Identical re-commits are deduplicated; a parent write resets the baseline. |

An unsupported `modelValue` warns in dev and leaves the editor state untouched — a bad write can never wipe stops mid-edit. Writing `null` resets to `defaultValue`, mirroring `ColorPickerRoot`.

### Slot props

The default slot exposes the live engine, so custom controls need no extra wiring:

| Name          | Type                | Description                                                          |
| ------------- | ------------------- | -------------------------------------------------------------------- |
| `gradient`    | `UseGradientReturn` | The full [`useGradient()`](#usegradient) instance backing this root. |
| `commitValue` | `() => void`        | Signals the end of a custom interaction, emitting `valueCommit`.     |

Both are also available on a template ref (`defineExpose`), and child components can reach them with `injectGradientPickerContext()`.

### GradientThemeSlots

Passed to the `ui` prop of `GradientPickerRoot` to override styles globally. Any slot can also be overridden locally on the child component's own `ui` prop.

```ts
type GradientThemeSlots = {
  root: {
    root: string         // The root <div> of GradientPickerRoot
  },
  slider: {
    root: string         // The stops-slider wrapper
    track: string        // The slider track (renders the flat gradient strip)
    thumb: string        // Each stop thumb (selected state via [data-selected])
    thumbSwatch: string  // The color chip inside the default thumb
  },
  input: {
    group: string        // The outer wrapper of the position/angle inputs
    item: string         // The inner cell
    field: string        // The <input> element
  },
  button: {
    root: string         // Add / Remove / Reverse / Rotate buttons
  },
  preview: {
    root: string         // The Preview element
  }
}
```


## GradientPickerSlider.vue

The multi-thumb stops slider. Dragging or arrowing a thumb moves its stop; crossing a neighbour re-sorts the stops while colors and the selection stay attached to the moved stop. Clicking or Tab-focusing a thumb selects its stop. Keyboard: arrows move by 1, `PageUp`/`PageDown` by 10, `Home`/`End` to the ends.

| Prop  | Default | Description                                                        |
| ----- | ------- | ------------------------------------------------------------------ |
| class | `-`     | Extra classes applied to the slider root.                          |
| ui    | `-`     | `Partial<{ root, track, thumb, thumbSwatch }>` — overrides slider slots. |

**Slots:**

| Name    | Description                                                                                     |
| ------- | ----------------------------------------------------------------------------------------------- |
| `thumb` | Replaces the default swatch inside each thumb. Scoped props: `{ stop, index, selected }`.       |

```html
<GradientPickerSlider>
  <template #thumb="{ stop, selected }">
    <span :class="selected ? 'ring-2' : ''">{{ stop.position }}</span>
  </template>
</GradientPickerSlider>
```


## GradientPickerPositionInput.vue

Edits a stop's position as `NN%`. Accepts bare numbers or `%`-suffixed text, clamps to 0–100, and commits on blur or Enter — only when the value genuinely changed. Typing a position past a neighbour re-sorts the stops.

| Prop   | Default | Description                                                                                     |
| ------ | ------- | ----------------------------------------------------------------------------------------------- |
| stopId | `-`     | The stop to edit. Omitted, the input follows the **selected** stop. A provided id that no longer resolves renders the input inert (disabled and empty) instead of retargeting. |
| label  | `Stop position` | The `aria-label` of the field.                                                          |
| class  | `-`     | Extra classes applied to the input group.                                                       |
| ui     | `-`     | `Partial<{ group, item, field }>`                                                               |


## GradientPickerAngleInput.vue

Edits the gradient angle as `NN°`. Accepts bare numbers, `°` or `deg` suffixes, normalizes into 0–359, and commits on blur or Enter when changed. Disables itself while the type is `radial` (the radial serializer has no angle).

| Prop  | Default          | Description                               |
| ----- | ---------------- | ----------------------------------------- |
| label | `Gradient angle` | The `aria-label` of the field.            |
| class | `-`              | Extra classes applied to the input group. |
| ui    | `-`              | `Partial<{ group, item, field }>`         |


## Action buttons

`GradientPickerAddStop`, `GradientPickerRemoveStop`, `GradientPickerReverse`, and `GradientPickerRotate` share the same shape: a `<button>` wired to the engine with a built-in icon, aria-label, and disabled logic. Each accepts the default slot to replace the icon.

| Prop  | Default | Description                                    |
| ----- | ------- | ---------------------------------------------- |
| label | per component | Overrides the `aria-label`.              |
| class | `-`     | Extra classes applied to the button.           |
| ui    | `-`     | `Partial<{ root }>`                            |

Component specifics:

| Component                  | Extra props        | Behavior                                                                       |
| -------------------------- | ------------------ | ------------------------------------------------------------------------------ |
| `GradientPickerAddStop`    | `-`                | Splits the segment right of the selected stop (left when it's the last) at its position/color midpoint; selects the new stop. Disabled at `maxStops`. |
| `GradientPickerRemoveStop` | `stopId` (selected) | Removes the stop and reselects its left neighbour. Disabled at `minStops`.    |
| `GradientPickerReverse`    | `-`                | Mirrors positions and colors together — unevenly spaced stops reverse correctly. |
| `GradientPickerRotate`     | `degrees` (`90`)   | Adds `degrees` to the angle, wrapping into 0–359. Disabled for radial gradients. |


## GradientPickerPreview.vue

An element whose `background` is bound to the current gradient. Useful as a live preview or a trigger surface.

| Prop  | Default | Description                                                                     |
| ----- | ------- | ------------------------------------------------------------------------------- |
| as    | `div`   | The HTML element or component to render as.                                     |
| track | `false` | When `true`, renders the flat left-to-right stop strip (the slider-track view) instead of the real gradient. |
| class | `-`     | Extra classes applied to the element.                                           |
| ui    | `-`     | `Partial<{ root }>`                                                             |

**Slots:** Default slot — render any content on top of the gradient.


## useGradient()

The reactive engine behind `GradientPickerRoot` — usable standalone for fully custom UIs.

```ts
import { useGradient } from '@vuelor/gradient'

const gradient = useGradient({
  type: 'linear',
  angle: 90,
  stops: [
    { color: '#FF98C2FF', position: 0 },
    { color: '#FFFA7AFF', position: 100 }
  ]
})
```

### Options

All optional. Invalid initial `stops` (fewer than 2, or non-hex colors) warn in dev and fall back to the default pink→yellow pair.

| Option   | Default    | Description                                                                 |
| -------- | ---------- | --------------------------------------------------------------------------- |
| type     | `linear`   | `'linear' \| 'radial' \| 'conic'`                                           |
| angle    | `90`       | Degrees; normalized into 0–359.                                             |
| stops    | 2-stop default | Initial stops as `{ color, position }` — sorted and canonicalized on load. |
| minStops | `2`        | Interaction floor for `removeStop`; never below 2.                          |
| maxStops | `8`        | Interaction ceiling for `addStop`; `setFromCSS` may load more.              |

### State and derived values

| Property         | Type                             | Description                                                        |
| ---------------- | -------------------------------- | ------------------------------------------------------------------ |
| `type`           | `Ref<GradientType>`              | Gradient type. Settable.                                           |
| `angle`          | `Ref<number>`                    | Angle in degrees. Settable; used by linear and conic.              |
| `stops`          | `Ref<ManagedGradientStop[]>`     | The stops, always sorted by position. Each carries a stable `id`.  |
| `selectedStopId` | `Ref<number>`                    | Id of the selected stop.                                           |
| `selectedStop`   | `ComputedRef<ManagedGradientStop>` | The selected stop; falls back to the first stop.                 |
| `selectedColor`  | `WritableComputedRef<string>`    | The selected stop's color — bind it to a `ColorPickerRoot`.        |
| `css`            | `ComputedRef<string>`            | The serialized gradient — what `GradientPickerRoot` emits.         |
| `trackCSS`       | `ComputedRef<string>`            | Flat left-to-right strip of the stops, for tracks and previews.    |
| `stopsCSS`       | `ComputedRef<string>`            | Just the serialized stop list (`#… 0%, #… 100%`).                  |
| `canAddStop`     | `ComputedRef<boolean>`           | `stops.length < maxStops`                                          |
| `canRemoveStop`  | `ComputedRef<boolean>`           | `stops.length > minStops`                                          |
| `minStops` / `maxStops` | `number`                  | The resolved bounds.                                               |

### Actions

| Method                        | Description                                                                                     |
| ----------------------------- | ----------------------------------------------------------------------------------------------- |
| `select(id)`                  | Selects a stop by id; unknown ids are ignored.                                                  |
| `selectAt(index)`             | Selects by current index.                                                                       |
| `addStop(position?, color?)`  | No arguments: splits the selected segment at its midpoint. With a position: interpolates the color at that point unless one is given. Rejects invalid colors (dev-warn) and returns the new stop or `null`. |
| `removeStop(id?)`             | Removes the stop (selected by default) and reselects its left neighbour. Returns success.        |
| `moveStop(id, position)`      | Clamps to 0–100, moves, and re-sorts; the selection follows ids, not indices.                    |
| `setStopColor(id, color)`     | Normalizes to `#RRGGBBAA`; invalid colors are dropped with a dev warning.                       |
| `reverse()`                   | Mirrors positions and colors together.                                                          |
| `rotate(degrees = 90)`        | Adds to the angle with wrap-around.                                                             |
| `setFromCSS(css)`             | Parses and replaces the whole state; returns `false` (state untouched) for unsupported input. The parsed model is authoritative over the stop bounds. |


## Core functions

The framework-agnostic layer under the composable — importable without touching any component.

| Function                                | Description                                                                          |
| --------------------------------------- | ------------------------------------------------------------------------------------ |
| `parseGradient(input)`                  | Parses a supported gradient string into `{ type, angle?, stops }`, or `null`.        |
| `serializeGradient(gradient)`           | Emits exactly the grammar `parseGradient` accepts, so values round-trip.             |
| `parseGradientStops(list)`              | Parses a stop list with CSS position-defaulting rules; all-or-nothing, `null` on any bad segment. |
| `serializeGradientStops(stops)`         | `'#RRGGBBAA 0%, #RRGGBBAA 100%'`                                                     |
| `stopsToTrackCSS(stops, direction?)`    | Flat strip (`linear-gradient(to right, …)`) for tracks and previews.                 |
| `isGradient(input)`                     | Loose shape check for dispatching a color-or-gradient model; `parseGradient` stays the authority. |
| `normalizeHexa(raw)`                    | Canonicalizes 3/4/6/8-digit hex (optional `#`, whitespace-tolerant) to `#RRGGBBAA`, or `null`. Shares the picker's `parseHex` grammar. |
| `normalizeAngle(raw)`                   | Wraps any number or numeric string into 0–359, rounded.                              |
| `mixHexa(a, b, t?)`                     | Linear RGBA mix of two hexa colors (`t` defaults to 0.5).                            |
| `midpointStop(a, b)`                    | The stop halfway between two stops in both position and color.                       |
| `colorAt(stops, position)`              | Piecewise-linear color of a sorted stop list at any position.                        |
| `reverseStops(stops)`                   | Mirrored copy; extra properties (like editor ids) survive.                           |
| `clampPosition(position)`               | Rounds and clamps into 0–100.                                                        |
| `MIN_GRADIENT_STOPS` / `DEFAULT_MAX_STOPS` | The `2` / `8` constants behind the defaults.                                      |


## Types

```ts
import type {
  GradientType,          // 'linear' | 'radial' | 'conic'
  GradientStop,          // { color: string, position: number }
  ParsedGradient,        // { type: GradientType, angle?: number, stops: GradientStop[] }
  ManagedGradientStop,   // GradientStop & { id: number }
  UseGradientOptions,
  UseGradientReturn,
  GradientThemeSlots,
  GradientPickerRootProps,
  GradientPickerRootEmits,
  GradientPickerRootContext
} from '@vuelor/gradient'
```

`injectGradientPickerContext()` is also exported for building custom child components — it returns the full engine plus `uiSlots`, `disabled`, and `commitValue`, exactly what the built-in components consume.
