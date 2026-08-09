# Vuelor registry catalog

Install any of these with `npx shadcn-vue@latest add @vuelor/<name>`. All examples depend on
`@vuelor/color-picker-theme` (added automatically) and on `@vuelor/picker` (plus `reka-ui` where the
example composes Reka primitives directly); the gradient items also install `@vuelor/gradient`.

| `@vuelor/<name>` | Best for | Composes | Extra npm deps |
| ---------------- | -------- | -------- | -------------- |
| `color-picker` | A complete, general-purpose picker | Canvas, eyedropper, hue + alpha sliders, switchable HEX/RGB/HSL/HSB inputs (+ a `ColorPickerSelect`) | — |
| `color-picker-mini` | The smallest usable picker | Canvas + hue slider | — |
| `color-picker-mini-styled` | Showing `ui`-prop style overrides | Canvas + hue slider with custom slot classes | — |
| `color-picker-mini-vertical` | Compact vertical layout | Canvas with vertical hue + alpha sliders | — |
| `color-picker-mini-vertical-styled` | Vertical + custom styling | as above, restyled via `ui` | — |
| `color-picker-sliders-hsl` | HSL channel editing | Hue / saturation / lightness / alpha sliders + HSL input | — |
| `color-picker-sliders-rgb` | RGB channel editing | Red / green / blue / alpha sliders + RGB input | — |
| `color-picker-popover` | A trigger that opens a picker | Hex input + Reka UI Popover wrapping canvas, eyedropper, sliders | — |
| `color-picker-tabs` | Format switching via tabs | Reka UI Tabs over HEX/RGB/HSL/HSB inputs | — |
| `color-picker-tabs-vertical` | Tabs + vertical sliders | Tabs with a vertical slider layout | — |
| `color-picker-gradient` | Solid color + gradient in one panel | Tabs switching a full color picker and a multi-stop linear/radial/conic editor built on `@vuelor/gradient`, with swatches and a stop-color popover | `@vuelor/gradient`, `@vueuse/core` |
| `gradient-picker` | A standalone gradient editor | `GradientPickerRoot` + stops slider, angle/position inputs, add/remove/reverse/rotate, live preview, and a nested color picker for the selected stop | `@vuelor/gradient` |
| `color-picker-theme` | Tokens only | The Tailwind v4 `vuelor-*` color + shadow tokens | — |

## Picking the right one

- "a color picker" / unsure → `color-picker`.
- "small" / "compact" / "inline" → `color-picker-mini` (or the `-vertical` variants).
- "a button/swatch that opens a picker" → `color-picker-popover`.
- "RGB sliders" / "HSL sliders" / "per-channel" → `color-picker-sliders-rgb` / `color-picker-sliders-hsl`.
- "gradient" / "multi-stop" / "linear/radial/conic" → `gradient-picker` for a gradient-only editor; `color-picker-gradient` when solid colors and gradients share one panel (Figma-style tabs).
- "tabs to switch formats" → `color-picker-tabs` (or `-vertical`).

After installing, mount the component and bind `v-model`. See [rules/composition.md](./rules/composition.md).
