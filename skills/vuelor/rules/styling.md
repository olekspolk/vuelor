# Styling Vuelor with the `ui` prop

Restyle any part without forking it by passing class overrides through the `ui` prop. `ui` is a
partial map of **theme slots**; each slot has named sub-parts:

| Slot | Sub-parts (class targets) |
| ---- | ------------------------- |
| `picker` | `root` |
| `dropper` | `root` |
| `shared` | `thumb` (all slider thumbs) |
| `canvas` | `root` |
| `slider` | `root`, `track` |
| `input` | `group`, `item`, `label`, `field` |
| `swatch` | `root`, `alpha` |

```vue
<ColorPickerRoot
  v-model="color"
  :ui="{
    canvas: { root: 'rounded-lg' },
    shared: { thumb: 'h-6 w-6 border' },
    slider: { track: 'h-3' },
    input: { label: 'hidden', field: 'max-w-16' }
  }"
>
  …
</ColorPickerRoot>
```

You can also set `ui` on an individual child to scope an override to just that part, e.g.
`<ColorPickerCanvas :ui="{ root: 'rounded-lg', thumb: 'h-6 w-6 border' }" />`.

## Precedence

Classes are merged with `tailwind-merge`, so later layers win on conflicting utilities:

1. the built-in theme defaults, then
2. the `ui` passed to `ColorPickerRoot`, then
3. the `ui` passed to the individual child component, then
4. a plain `class` on the element.

This means you can nudge one utility (e.g. `rounded-lg`) without restating the whole class string.

## Choosing a styling mode

- Keep the default `styling="tailwindcss"` in Tailwind projects (and provide the `vuelor-*` tokens — see [theming.md](../theming.md)).
- Use `styling="vanillacss"` + `import '@vuelor/picker/style.css'` when the project has no Tailwind; override the `.vuelor-picker-root` CSS variables to retheme.
- Use `styling="unstyled"` to drop all built-in classes and start from scratch (then style via `ui`/`class`).

## Don'ts

- Don't edit `node_modules/@vuelor/picker` or copy the engine source to restyle — use `ui`/`styling`.
- Don't hardcode raw hex where a token exists; prefer the `vuelor-*` utilities so themes stay consistent.
