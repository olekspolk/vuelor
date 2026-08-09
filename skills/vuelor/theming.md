# Theming Vuelor

`ColorPickerRoot` and `GradientPickerRoot` share a `styling` prop with three modes (default `tailwindcss`):

| `styling` | How it's styled | What the consumer must provide |
| --------- | --------------- | ------------------------------ |
| `tailwindcss` (default) | Tailwind utility classes that reference `vuelor-*` design tokens | the `vuelor-*` tokens (see below) |
| `vanillacss` | Plain CSS scoped to `.vuelor-picker-root` / `.vuelor-gradient-root` | `import '@vuelor/picker/style.css'` (and `'@vuelor/gradient/style.css'` for the gradient editor) once |
| `unstyled` | No built-in classes at all | your own styles |

## Tailwind mode tokens

The picker's utility classes (`bg-vuelor-primary`, `bg-vuelor-surface`, `bg-vuelor-input`,
`border-vuelor-border`, `outline-vuelor-primary`, `shadow-vuelor-card`, `shadow-vuelor-thumb`,
`shadow-vuelor-inner`, `drop-shadow-vuelor-thumb`) resolve from these Tailwind v4 `@theme` tokens:

```css
@theme {
  --color-vuelor-primary: #0d99ff;
  --color-vuelor-surface: #ffffff;
  --color-vuelor-border: #e6e6e6;
  --color-vuelor-input: #f5f5f5;
  --shadow-vuelor-card: 0 2px 5px 0 #00000026, 0 10px 16px 0 #0000001f, 0 0 .5px 0 #0000001f;
  --shadow-vuelor-thumb: 0px 0px .5px #0000002e, 0px 3px 8px #0000001a, 0px 1px 3px #0000001a;
  --shadow-vuelor-inner: inset 0 0 0 1px #0000001a;
  --drop-shadow-vuelor-thumb: 0px 0px .5px #00000054, 0px 1px 3px #00000026;
}
```

- **Installed via the CLI?** These are added automatically through the `@vuelor/color-picker-theme`
  registry dependency — but Tailwind still needs to scan the packages: add
  `@source "../node_modules/@vuelor/picker";` (and `@vuelor/gradient` when used) to the global CSS
  in v4 setups.
- **Tailwind v3** (manual setup): define the same tokens under `theme.extend.colors` /
  `theme.extend.boxShadow` (and `dropShadow`), AND add `'./node_modules/@vuelor/picker/dist/index.js'`
  (plus `'./node_modules/@vuelor/gradient/dist/index.js'` when used) to your `content` array so the
  `vuelor-*` classes are not purged.

## Vanilla mode variables (different, larger set)

The design tokens are single-sourced in `@vuelor/picker` and compiled into both packages'
stylesheets, declared on `:where(.vuelor-picker-root, .vuelor-gradient-root)` — note
`--color-vuelor-input-bg` (not `-input`) and the extra entries that have no Tailwind equivalent:

```
--color-vuelor-primary, --color-vuelor-surface, --color-vuelor-border,
--color-vuelor-input-bg, --color-vuelor-shadow-inner, --color-vuelor-button-bg--hover,
--opacity-vuelor-disabled,
--shadow-vuelor-card, --shadow-vuelor-thumb, --shadow-vuelor-inner,
--filter-vuelor-drop-thumb   (gradient slider thumbs)
```

Override them on those root selectors (or per instance on a wrapper) — one override rethemes
picker and gradient panels together.

## Per-component overrides

Independent of the mode, restyle individual slots through the `ui` prop. See
[rules/styling.md](./rules/styling.md).
