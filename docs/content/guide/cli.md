# shadcn-vue CLI

Every Vuelor example is published as a [shadcn-vue registry](https://www.shadcn-vue.com/docs/registry)
item, so you can drop a ready-made picker straight into your project with the shadcn-vue CLI. Unlike a
black-box component, the example source is **copied into your codebase** — you own it and can edit it
freely. The headless engine stays a small, upgradable dependency (`@vuelor/picker`).

## Prerequisites

Your project must already be initialized for shadcn-vue (it needs a valid `components.json`, the `cn`
utility and a Tailwind setup). If it isn't, run:

```bash
npx shadcn-vue@latest init
```

See the [shadcn-vue installation guide](https://www.shadcn-vue.com/docs/installation) for the Vite,
Nuxt, Astro and Laravel walkthroughs. Vuelor targets the Tailwind v4 setup that `init` produces by
default.

## 1. Register the `@vuelor` registry

Add the `@vuelor` namespace to the `registries` map in your `components.json`. This is a one-time
step:

```json
{
  "registries": {
    "@vuelor": "https://vuelor.dev/r/{name}.json"
  }
}
```

## 2. Add a picker

```bash
npx shadcn-vue@latest add @vuelor/color-picker
```

That single command:

- copies the example component (and any helpers it uses, e.g. a `Select`) into your `components` directory;
- installs the npm dependencies it needs (`@vuelor/picker`, `reka-ui`, and for the gradient editor `@vueuse/core` + `tailwind-merge`);
- adds the required `vuelor-*` design tokens to your CSS via the `color-picker-theme` dependency.

You can add several at once: `npx shadcn-vue@latest add @vuelor/color-picker @vuelor/color-picker-gradient`.

### Without registering the namespace

You can also install any item by its full URL — no `components.json` change required:

```bash
npx shadcn-vue@latest add https://vuelor.dev/r/color-picker.json
```

## Available items

| Command | Description |
| ------- | ----------- |
| `add @vuelor/color-picker` | Full picker: eyedropper, hue + alpha sliders, switchable HEX/RGB/HSL/HSB inputs |
| `add @vuelor/color-picker-mini` | Minimal canvas + hue slider |
| `add @vuelor/color-picker-mini-styled` | Mini picker showing `ui`-prop style overrides |
| `add @vuelor/color-picker-mini-vertical` | Mini picker with vertical sliders |
| `add @vuelor/color-picker-mini-vertical-styled` | Vertical mini picker with custom styling |
| `add @vuelor/color-picker-sliders-hsl` | Individual H/S/L + alpha sliders |
| `add @vuelor/color-picker-sliders-rgb` | Individual R/G/B + alpha sliders |
| `add @vuelor/color-picker-popover` | Hex input that opens a popover picker |
| `add @vuelor/color-picker-tabs` | Inputs organized behind tabs |
| `add @vuelor/color-picker-tabs-vertical` | Tabbed picker with vertical sliders |
| `add @vuelor/color-picker-gradient` | Multi-stop linear/radial/conic gradient editor |
| `add @vuelor/color-picker-theme` | Just the Tailwind v4 design tokens (added automatically by every picker above) |

## Theming notes

- **Tailwind v4** (the shadcn-vue default): the `vuelor-*` color and shadow tokens are added to your
  global stylesheet automatically through the `color-picker-theme` dependency. You also need to let
  Tailwind scan the package — Tailwind v4 ignores `node_modules`, so add this to your CSS entry file
  (adjust the relative path to where it lives), or the canvas and sliders get purged:

  ```css
  @source "../node_modules/@vuelor/picker";
  ```
- **Tailwind v3**: instead add the package to your `content` globs so the utility classes aren't purged —
  `'./node_modules/@vuelor/picker/dist/index.js'`.
- **No Tailwind**: set `styling="vanillacss"` on `ColorPickerRoot` and import `@vuelor/picker/style.css`.
  See [Customization](/guide/customization).

## Using it with AI assistants (MCP)

Because Vuelor ships a standard registry, the
[shadcn-vue MCP server](https://www.shadcn-vue.com/docs/mcp) lets AI coding agents discover and install
Vuelor pickers with zero extra setup — once `@vuelor` is in your `components.json`. Configure it for
your agent (Claude Code shown):

```jsonc
// .mcp.json
{
  "mcpServers": {
    "shadcn": { "command": "npx", "args": ["shadcn-vue@latest", "mcp"] }
  }
}
```

Or run `npx shadcn-vue@latest mcp init --client claude` (also supports `cursor`, `vscode`, `codex`,
`opencode`). The agent can then search the registry, view items and run the correct `add` command for
you. For deeper, rules-aware help composing the picker, install the Vuelor skill:

```bash
npx skills add olekspolk/vuelor
```
