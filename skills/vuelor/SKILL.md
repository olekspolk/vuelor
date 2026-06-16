---
name: vuelor
description: Add, compose, and style Vuelor color pickers (the @vuelor/picker headless library and its @vuelor shadcn-vue registry) in Vue and Nuxt apps. Use when the user wants a color picker, gradient picker, or eyedropper, mentions "@vuelor/picker" or "vuelor", or works in a project whose components.json lists an @vuelor registry.
user-invocable: false
allowed-tools: Bash(npx shadcn-vue@latest *), Bash(pnpm dlx shadcn-vue@latest *), Bash(bunx --bun shadcn-vue@latest *)
---

# Vuelor

Vuelor is a flexible, accessible, Tailwind-ready color picker for Vue 3, built on [Reka UI](https://reka-ui.com). It ships in two complementary forms:

- **`@vuelor/picker`** — a headless library of building-block components you compose yourself.
- **the `@vuelor` shadcn-vue registry** — ready-made example pickers you install with the shadcn-vue CLI and then own as editable source.

## When to use this skill

Adding or embedding a color/gradient picker in a Vue or Nuxt app; composing the picker parts; styling/theming a picker; or any project whose `components.json` lists an `@vuelor` registry.

## Project context

```json
!`npx shadcn-vue@latest info --json`
```

## Decide: install an example, or compose from scratch?

- **Install an example** (preferred for a working picker fast): choose the closest item from [examples.md](./examples.md) and run the matching `shadcn-vue add @vuelor/<name>` — the user gets editable source plus the right dependencies and theme tokens, wired automatically. See [install.md](./install.md).
- **Compose from `@vuelor/picker`** when a bespoke layout is needed: `pnpm add @vuelor/picker` and assemble the parts. See [rules/composition.md](./rules/composition.md).

## Workflow for installing an example

1. Confirm the project is shadcn-vue-initialized (a valid `components.json` exists). If not, the user must run `npx shadcn-vue@latest init` first — `add` cannot run without it.
2. Ensure `@vuelor` is in the `registries` map of `components.json`. If missing, add `"@vuelor": "https://vuelor.dev/r/{name}.json"`. (See [install.md](./install.md).)
3. Pick the item that matches intent — mini / sliders / popover / tabs / gradient — from [examples.md](./examples.md).
4. Run `npx shadcn-vue@latest add @vuelor/<name>`. This also installs `@vuelor/picker` (+ `reka-ui`, and `@vueuse/core`/`tailwind-merge` for the gradient editor) and adds the `vuelor-*` design tokens via the `color-picker-theme` dependency.
5. Import the copied component and bind it with `v-model`.

## Critical rules

- **Every picker part must live inside `<ColorPickerRoot>`.** The root manages color state and provides it via context; a part rendered outside the root will throw.
- **Bind the value with `v-model` on `ColorPickerRoot`.** The value type follows the `format` prop — `hexa` (an `#RRGGBBAA` string) by default; `object` returns a full color object (`{ hex, hexa, rgb, rgba, hsl, hsla, hsv, hsva }`).
- **Style through the `ui` prop or the `styling` prop — never fork the engine.** See [rules/styling.md](./rules/styling.md).
- **Installed examples need the `vuelor-*` Tailwind tokens.** With the CLI they arrive automatically via `@vuelor/color-picker-theme`. For manual installs, Tailwind v3, or non-Tailwind apps, see [theming.md](./theming.md).
- **Never hand-fetch component files from GitHub.** Always use the shadcn-vue CLI (or MCP) so dependencies, import aliases, and tokens are wired correctly.
- **Don't guess a registry.** If the user hasn't configured `@vuelor`, add the one-time `registries` line rather than inventing a URL.

## Reference files

- [install.md](./install.md) — registry setup, `add` commands, MCP configuration.
- [examples.md](./examples.md) — the catalog of installable pickers and what each composes.
- [theming.md](./theming.md) — the three styling modes and the token sets.
- [rules/composition.md](./rules/composition.md) — the component parts and how to assemble them.
- [rules/styling.md](./rules/styling.md) — the `ui` prop, theme slots, and override precedence.
