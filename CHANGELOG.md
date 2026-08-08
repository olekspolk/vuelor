# Changelog

## Unreleased

✨ New
- `@vuelor/gradient` 0.1.0 — new package extracting the gradient editor from the ultra example: a framework-agnostic core (`parseGradient`, `serializeGradient`, `parseGradientStops` with CSS position defaulting, `isGradient`, stop math), a `useGradient` composable owning the sorted-stops/selection invariants, and headless components (`GradientPickerRoot`, `GradientPickerSlider` with the reka-ui crossing-selection logic built in, position/angle inputs, add/remove/reverse/rotate buttons, preview) with the same `tailwindcss`/`vanillacss`/`unstyled` styling modes as the picker
- Gradient stop lists are now split on top-level commas, so the grammar can grow to `rgb()`/`hsl()`/`var()` stops without an API break (stops remain hex-only for now)
- ColorPicker Ultra rebuilt on `@vuelor/gradient` — the example drops from ~780 to ~430 lines (parsing, stop state and the slider crossing logic now come from the package); the `color-picker-gradient` registry item installs `@vuelor/gradient@^0.1.0`, no longer ships `GradientStopInput.vue`, and its docs note covers the extra Tailwind `@source`/content line for the new package

🐞 Pre-release review fixes
- Types — emitted declarations now resolve under `moduleResolution: NodeNext/Node16`: all relative specifiers carry explicit extensions and a post-build step rewrites `.vue` imports in `.d.ts` files to `.vue.js` (both packages; verified with a NodeNext consumer compile)
- Gradient slider — `activeStopId` is now cleared on `pointercancel` and on window-level `keyup`/`blur`, so an interrupted drag or a key released off-thumb no longer suppresses Tab-focus selection
- Gradient slider — `valueCommit` is deferred one tick, so keyboard steps commit the post-keystroke gradient instead of a value stale by one step
- Dev warnings — `import.meta.env.DEV` guards replaced with `process.env.NODE_ENV !== 'production'` in both roots, so the unsupported-value warnings survive the library build and reach consumers' dev builds
- Theming — the gradient root's `ui` group renamed from `picker` to `root` (`:ui="{ root: { root } }"`) before the key freezes into the published API; `exports` maps now list `types` first
- Position input — a provided `stop-id` that no longer resolves now renders the input inert instead of silently retargeting edits to the selected stop
- `valueCommit` contract — commits deduplicate against the last committed value (parent writes reset the baseline), the inputs only move/commit on genuine changes (no more Enter+blur doubles or no-edit blur commits), the default slot exposes `commitValue`, and the ultra example commits type switches and stop-color edits through it
- Validation — `addStop` rejects an invalid color (dev-warn) instead of inserting an opaque-black stop, invalid initial stops fall back to the default gradient with a warning, `setStopColor` dev-warns on dropped input, and an unsupported `defaultValue` now warns like `modelValue`
- Bounds — documented (and regression-tested) that a parsed model is authoritative: `minStops`/`maxStops` bound only the add/remove interactions
- Inputs — the field width moved from a hardcoded component class into the theme and the vanilla stylesheet, so `styling="vanillacss"` inputs no longer collapse and `unstyled` mode is truly blank
- Shared hex grammar — `@vuelor/picker` exports `parseHex`, and the gradient's `normalizeHexa` delegates to it, so both packages agree on valid hex (including whitespace tolerance) and can't drift
- Shared design tokens — the vanillacss tokens are single-sourced in `packages/picker/src/style/tokens.css` (scoped to both root classes, with a new `--filter-vuelor-drop-thumb`) and compiled into each package's stylesheet
- Tests — the left-split, SSR position-input and zero-width `colorAt` assertions are now load-bearing (they fail on the regressions they claim to guard)

🧹 Housekeeping (`@vuelor/picker` 1.1.0)
- Export `createUiSlots` (with a new optional vanilla-class mapper argument), the `Styling`/`VanillaClassFn`/`UiSliderSlots`/`UiInputSlots` types, and `SVG_MOSAIC_URL`, so sibling packages reuse the theming machinery instead of copying it

## 1.0.2

🐞 Bug Fixes
- Hex input alpha — blurring the hex field reset opacity to 100%; a plain edit now keeps the current alpha (standalone and `v-model`)
- Alpha precision — alpha was quantized to whole percents, so `#FF8D2825` drifted to `#FF8D2826`; it's now a 0–1 float and round-trips exactly
- Opacity field — in `v-model` mode it edited the surrounding picker's color instead of the bound value
- Gradient stops — dragging or arrowing a stop past a neighbor swapped colors and lost the selection; stops now keep their color and stay selected
- `modelValue` — an uncontrolled `<ColorPickerRoot />` warned about a missing required prop; the prop is now optional

✨ Improvements
- Accessibility — keyed swatch grids, plus `type="button"` and aria-labels on swatches and eyedroppers
- Theming — hardcoded `bg-white` swapped for the `vuelor-surface` token, so custom/dark themes apply
- Gradient parser — accepts 3/4/6/8-digit hex, decimal positions, and fills in missing stop positions

🧹 Housekeeping
- Renamed the bundled `Select` helper to `ColorPickerSelect` (avoids colliding with shadcn-vue's `select`)
- Dropped the unused `tailwind-merge` dependency from the gradient editor
- Registry items now strip docs-only attributes and require `@vuelor/picker@^1.0.2`
