// Shared registry manifest — the single list of distributable example items.
// Consumed by:
//   - scripts/build-registry.mjs   (generates registry.json + registry/<style>/*)
//   - components/ComponentDemo.vue (shows the matching `shadcn-vue add` command under each demo)
// Keeping the list here means the docs demos and the registry can never disagree about item names.

export const STYLE = 'default'
export const NAMESPACE = '@vuelor'
export const PICKER_VERSION = '^1.0.1'
export const AUTHOR = 'Vuelor <https://vuelor.dev>'
export const HOMEPAGE = 'https://vuelor.dev'

const FORM = ['color-picker', 'form', 'input']

// item name -> source SFC (in components/examples) + metadata. Order = order in registry.json.
export const EXAMPLE_ITEMS = [
  { name: 'color-picker-mini', file: 'ColorPickerMini.vue', title: 'Color Picker (Mini)', categories: FORM,
    description: 'Minimal color picker — a saturation/brightness canvas with a hue slider.' },
  { name: 'color-picker-mini-styled', file: 'ColorPickerMiniStyled.vue', title: 'Color Picker (Mini, Styled)', categories: FORM,
    description: 'Mini color picker with a rounded canvas and custom slider thumb styling applied through the ui prop.' },
  { name: 'color-picker-mini-vertical', file: 'ColorPickerMiniVertical.vue', title: 'Color Picker (Mini, Vertical)', categories: FORM,
    description: 'Mini color picker with the hue and alpha sliders arranged vertically beside the canvas.' },
  { name: 'color-picker-mini-vertical-styled', file: 'ColorPickerMiniVerticalStyled.vue', title: 'Color Picker (Mini, Vertical, Styled)', categories: FORM,
    description: 'Vertical mini color picker with custom ui-prop styling overrides.' },
  { name: 'color-picker-sliders-hsl', file: 'ColorPickerSlidersHSL.vue', title: 'Color Picker (HSL Sliders)', categories: FORM,
    description: 'HSL color picker built from individual hue, saturation, lightness and alpha sliders.' },
  { name: 'color-picker-sliders-rgb', file: 'ColorPickerSlidersRGB.vue', title: 'Color Picker (RGB Sliders)', categories: FORM,
    description: 'RGB color picker built from individual red, green, blue and alpha sliders.' },
  { name: 'color-picker', file: 'ColorPicker.vue', title: 'Color Picker', categories: FORM,
    description: 'Full color picker with an eyedropper, hue + alpha sliders and switchable HEX / RGB / HSL / HSB inputs.' },
  { name: 'color-picker-popover', file: 'ColorPickerPopover.vue', title: 'Color Picker (Popover)', categories: FORM,
    description: 'Hex input that opens a Reka UI popover containing a canvas, eyedropper and sliders.' },
  { name: 'color-picker-tabs', file: 'ColorPickerWithTabs.vue', title: 'Color Picker (Tabs)', categories: FORM,
    description: 'Color picker whose HEX / RGB / HSL / HSB inputs are organized behind Reka UI tabs.' },
  { name: 'color-picker-tabs-vertical', file: 'ColorPickerWithTabsVerticalSliders.vue', title: 'Color Picker (Tabs, Vertical)', categories: FORM,
    description: 'Tabbed color picker with a vertical slider layout.' },
  { name: 'color-picker-gradient', file: 'ColorPickerWithGradient.vue', title: 'Color Picker (Gradient)', categories: ['color-picker', 'gradient'],
    description: 'Multi-stop gradient editor (linear / radial / conic) built on @vuelor/picker.' },
]

// Tailwind v4 design tokens the picker's `tailwindcss` styling mode depends on. Shipped once via the
// color-picker-theme item; every example depends on it. Color keys are intentionally written WITHOUT
// the `color-` prefix: shadcn registers a `--color-<key>` token for every color-valued entry, so
// `vuelor-primary` -> `--color-vuelor-primary` (what `bg-vuelor-primary` needs) cleanly.
export const THEME_VARS = {
  'vuelor-primary': '#0d99ff',
  'vuelor-surface': '#ffffff',
  'vuelor-border': '#e6e6e6',
  'vuelor-input': '#f5f5f5',
  'shadow-vuelor-card': '0 2px 5px 0 #00000026, 0 10px 16px 0 #0000001f, 0 0 .5px 0 #0000001f',
  'shadow-vuelor-thumb': '0px 0px .5px #0000002e, 0px 3px 8px #0000001a, 0px 1px 3px #0000001a',
  'shadow-vuelor-inner': 'inset 0 0 0 1px #0000001a',
  'drop-shadow-vuelor-thumb': '0px 0px .5px #00000054, 0px 1px 3px #00000026',
}

export const DOCS_NOTE =
  'Tailwind v4 (shadcn-vue default): the vuelor-* tokens are installed automatically via the ' +
  'color-picker-theme dependency, but you must ALSO add ' +
  '`@source "../node_modules/@vuelor/picker";` to your global CSS (adjust the relative path to ' +
  "where your CSS entry file lives) so Tailwind scans the picker's classes — without it the canvas " +
  'and sliders get purged. Tailwind v3: instead add ' +
  "'./node_modules/@vuelor/picker/dist/index.js' to your tailwind.config content array. " +
  'Non-Tailwind projects: set styling="vanillacss" on ColorPickerRoot and import ' +
  "'@vuelor/picker/style.css'."

/** Map an example .vue filename to its registry item name ("ColorPickerMini.vue" -> "color-picker-mini"). */
export function itemNameForFile(file) {
  return EXAMPLE_ITEMS.find((item) => item.file === file)?.name ?? null
}
