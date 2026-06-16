# Vuelor × shadcn-vue Registry — Design & Implementation Plan

**Status:** Implemented (Phases 0–6) on branch `feat/shadcn-vue-registry` · pending review & commit
**Scope:** Distribute Vuelor's example pickers as shadcn-vue registry items installable via
`npx shadcn-vue add @vuelor/<example>`, plus an AI skill and DX / AI-readiness improvements.
**Branch:** `feat/shadcn-vue-registry`

> This document is the source of truth for the integration. It is intentionally kept at the repo
> root (not under `docs/content/**`, so it is **not** published to vuelor.dev). Move it if you'd
> rather it live elsewhere.

---

## 0. Ground truth (verified against source & live services)

- **Two layers.** `@vuelor/picker` (v1.0.1, ESM, on npm) is the headless primitive package
  (`ColorPickerRoot/Canvas/EyeDropper/Slider*/Input*/Swatch` + `HexaToRGBA`, `RGBAtoHexa`,
  `useVModel`, `injectColorPickerContext`). `package.json` `dependencies`: `reka-ui ^2.5.1`,
  `tailwind-merge ^3.3.1`, `vue ^3.2.0` (reka-ui + vue are **also** `peerDependencies`). The 11
  example SFCs in `docs/components/examples/` compose those primitives.
- **Examples** import (a) primitives from `@vuelor/picker`, (b) **raw reka-ui** primitives directly
  (`useForwardPropsEmits`, `Popover*`, `Tabs*`, `Slider*`, `Select*`) — *not* a local shadcn `ui/`
  folder, and for the gradient one (c) `@vueuse/core` + `tailwind-merge`, plus two shared helpers in
  `docs/components/common/` (`Select.vue`, `GradientStopInput.vue`).
- **Theming is split (the crux).** The picker's classes reference custom tokens (`bg-vuelor-*`,
  `shadow-vuelor-*`, `outline-vuelor-primary`) that the **consumer must define**. A freshly-`add`ed
  example renders unstyled unless those tokens travel with it. The two token sets differ:
  - **Tailwind mode:** `--color-vuelor-primary/-surface/-border/-input` + `--shadow-vuelor-card/-thumb/-inner`
    (`docs/tailwind.config.js`, README `@theme`).
  - **Vanilla mode** (`packages/picker/src/style/index.css`, scoped to `.vuelor-picker-root`): larger set —
    note `--color-vuelor-input-bg` (not `-input`), plus `--color-vuelor-shadow-inner`,
    `--color-vuelor-button-bg--hover`, `--opacity-vuelor-disabled`.
- **Hosting is free.** `docs/.vitepress/config.mts` sets `srcDir: 'content'` and **no `base`**, so the
  default public dir `content/public/` maps to the site root. Files at
  `docs/content/public/r/<name>.json` serve at `https://vuelor.dev/r/<name>.json`.

### Phase 0 verification results (all green)

| # | Question | Result |
|---|----------|--------|
| 1 | Does the published CLI expose `build`? | ✅ **Yes** on stable `shadcn-vue@2.7.4` — no `@canary` needed. `build [registry]` with `-o, --output` (default `./public/r`), `-c, --cwd`. |
| 2 | `add` input forms | ✅ `add` accepts "names, url **or local path**" + `--dry-run`, `--diff`, `--view` — local-path install enables verification without a server. |
| 3 | Is `registry:theme` valid? | ✅ **Yes.** Live schema `type` enum: `registry:lib, block, component, ui, hook, theme, page, file, style, base, font, item`. `cssVars` keys: `theme`, `light`, `dark`. |
| 4 | Does the live host serve `/r/*.json`? | ✅ `vuelor.dev/logo.png` & `llms.txt` return **200** to a normal UA, **`access-control-allow-origin: *`**, correct content-types, served by Cloudflare with **no SPA rewrite** over real files. `/r/ping.json` 404s only because it doesn't exist yet. (The WebFetch 403 was Cloudflare blocking that crawler UA; the Node CLI uses a normal UA. CORS is moot for the Node CLI anyway, and is permissive for browser/v0 flows.) |
| 5 | Namespace support | Mirrored from `ui.shadcn.com` (Vue `/docs/registry/namespace` 404s; same engine). Verify `@vuelor/{name}` resolution end-to-end in Phase 4; raw-URL `add` is the always-available fallback. |
| 6 | Tailwind v3 token purge | `cssVars` cannot patch a v3 `content` array → surfaced via each item's `docs` string. shadcn-vue is v4-first, so impact is limited. |

### Phase 1 verification results (built `color-picker-theme` + `color-picker-mini`, added into a scratch project)

A real `npx shadcn-vue add @vuelor/color-picker-mini` (registry served on localhost, scratch
`components.json` with `@vuelor` → that host) **succeeded end-to-end**: resolved both items via the
namespace, injected the `vuelor-*` tokens into the project CSS, installed `@vuelor/picker@^1.0.1` +
`reka-ui`, and wrote `src/components/color-picker-mini/ColorPickerMini.vue` **byte-identical** to
source. Two findings shaped the final design:

- **F1 — `registryDependencies` must be namespace-prefixed (`@vuelor/color-picker-theme`), not bare.**
  A **bare** `"color-picker-theme"` resolves against the *default* shadcn registry
  (`shadcn-vue.com/r/styles/new-york-v4/…` → 404) — even when the parent item was added via `@vuelor`.
  Bare names do **not** inherit the parent's namespace. (Absolute URLs also work and self-resolve for
  the raw-URL flow; the namespace form is used here since `@vuelor` config is already the documented
  prerequisite.)
- **F2 — Theme tokens go in `cssVars.theme`, *not* the `css` field.** `css: { "@theme": {…} }` makes
  the CLI's PostCSS parser throw (`Unknown word #0d99ff`). `cssVars.theme` works, but keys prefixed
  with `color-` get an extra, unused re-registration alias (`--color-color-vuelor-primary: var(…)`).
  Harmless (the picker's required `--color-vuelor-*` / `--shadow-vuelor-*` tokens are all emitted
  correctly), but cosmetic cleanup → **Phase 3** (options: bare key names, or a `registry:file` that
  ships a literal `vuelor-theme.css`).

Note: `shadcn-vue build` also emits an index `registry.json` alongside the per-item files, and needs
**no `components.json`** in the registry (publisher) project. The `--dry-run`/`--diff`/`--view` flags
are advertised in `add --help` but are **not yet implemented** (they error out).

---

## 1. Recommended architecture

**Primitives → npm dependency. Examples → copy-in registry items.**

Each example item declares `"dependencies": ["@vuelor/picker@^1.0.1", …]` and keeps its
`import { … } from '@vuelor/picker'` verbatim. The CLI installs the package and writes the editable
example into the user's tree. This is the canonical shadcn pattern (its own `utils` item ships
`clsx`/`tailwind-merge` as `dependencies`). **Do not inline the primitives** — the styling engine
(`createUiSlots`, 3 modes, context injection) is version-coupled; copying it forfeits the published
upgrade path. (Fully-ejectable copy-in primitives are a separate, larger effort — out of scope.)

```
 AUTHOR (docs workspace)                BUILD                 HOST                    CONSUME
┌────────────────────────┐   shadcn-vue build   ┌──────────────────┐        ┌──────────────────────────┐
│ docs/registry.json      │ ───────────────────▶ │ content/public/r/ │  GET   │ npx shadcn-vue add        │
│ docs/registry/default/  │  --output            │   color-picker-*  │ ◀───── │   @vuelor/color-picker    │
│   <Example>/*.vue       │  content/public/r    │   .json (static)  │        │ → installs @vuelor/picker │
│  (imports @/registry)   │                      └────────┬─────────┘        │   + writes the .vue file  │
└────────────────────────┘                       vuelor.dev/r/*.json         └──────────────────────────┘
        ▲ same files                                       │                         ▲ resolves via
        └── docs `::: demo` (single source of truth)       │ MCP/skills read ───────┘ components.json registries
                                                           ▼
                                        AI agent: shadcn-vue MCP (7 tools) over @vuelor namespace
                                                  + vuelor SKILL.md (vercel-labs skills CLI)
```

**Three things must travel with each example:**

1. **npm deps** — `@vuelor/picker` always; `reka-ui` for any item importing it directly (all but
   `GradientStopInput`); `@vueuse/core` + `tailwind-merge` only for the gradient item. (Because
   `@vuelor/picker` hard-declares `reka-ui`, it installs transitively regardless — declaring it is
   hygiene, not a safety net.)
2. **Shared helpers** — `Select.vue` / `GradientStopInput.vue`. **Recommendation: bundle** them as
   extra `files[]` in the items that use them; their relative `../common/*` imports are rewritten to
   the `@/registry` alias. Alternative: standalone items via `registryDependencies` — only if reuse grows.
3. **Design tokens** — a base **`color-picker-theme`** item (`type: registry:theme`) carrying
   `cssVars.theme` (the Tailwind-v4 path; the legacy `tailwind` object is deprecated). Every example
   lists `registryDependencies: ["@vuelor/color-picker-theme"]` — **namespace-prefixed, not bare**
   (see Phase 1 finding F1). Tailwind-v3 consumers also need
   `./node_modules/@vuelor/picker/dist/index.js` in their `content` glob — documented in each item's
   `docs`.

**Namespace `@vuelor`** is a key the *consumer* adds to `components.json`; nothing is registered
centrally. Install docs hand them:

```jsonc
// components.json
{ "registries": { "@vuelor": "https://vuelor.dev/r/{name}.json" } }
```

Then `npx shadcn-vue add @vuelor/color-picker-mini` works (public → string form, no auth). Raw-URL
`add https://vuelor.dev/r/color-picker-mini.json` works without registering. **Either way the
consumer must be `shadcn-vue init`'d** — `add` requires a valid `components.json`.

---

## 2. Item catalog (all 11 examples + theme + showcase)

`npm deps` excludes `@vuelor/picker` (always present); all examples `registryDependencies: ["@vuelor/color-picker-theme"]`.

| Item name | Source SFC | Extra npm deps | Bundled files | Notes |
|---|---|---|---|---|
| `color-picker-theme` | — | — | — | `cssVars.theme` tokens; base dep of all |
| `color-picker-mini` | ColorPickerMini.vue | `reka-ui` | — | canvas + hue |
| `color-picker-mini-styled` | ColorPickerMiniStyled.vue | `reka-ui` | — | teaches `ui` override prop |
| `color-picker-mini-vertical` | ColorPickerMiniVertical.vue | `reka-ui` | — | vertical sliders |
| `color-picker-mini-vertical-styled` | ColorPickerMiniVerticalStyled.vue | `reka-ui` | — | vertical + `ui` overrides |
| `color-picker-sliders-hsl` | ColorPickerSlidersHSL.vue | `reka-ui` | — | HSL channel sliders |
| `color-picker-sliders-rgb` | ColorPickerSlidersRGB.vue | `reka-ui` | — | RGB channel sliders |
| `color-picker` (flagship "Pro") | ColorPicker.vue | `reka-ui` | `Select.vue` | format switcher + eyedropper |
| `color-picker-popover` | ColorPickerPopover.vue | `reka-ui` | — | reka-ui Popover trigger |
| `color-picker-tabs` | ColorPickerWithTabs.vue | `reka-ui` | — | reka-ui Tabs |
| `color-picker-tabs-vertical` | ColorPickerWithTabsVerticalSliders.vue | `reka-ui` | — | Tabs + vertical |
| `color-picker-gradient` | ColorPickerWithGradient.vue | `reka-ui`, `@vueuse/core`, `tailwind-merge` | `Select.vue`, `GradientStopInput.vue` | multi-stop; uses manual `useVModel` (no `useForwardPropsEmits`); `GradientStopInput.vue` imports **no reka-ui** |
| `color-picker-showcase` *(optional)* | Showcase.vue | `reka-ui`, `@vueuse/core`, `tailwind-merge` | — | aggregator → `registryDependencies` on the **9** variants Showcase imports (excludes the two non-styled Mini variants) |

---

## 3. File / folder layout & build pipeline

Author inside the **`docs` workspace** (already depends on `@vuelor/picker` via `workspace:*` and is
what deploys to vuelor.dev):

```
docs/
├─ registry.json                          # catalog manifest
├─ registry/
│  └─ default/                            # STYLE segment (arbitrary; "default")
│     ├─ color-picker/
│     │  ├─ ColorPicker.vue               # imports use @/registry alias
│     │  └─ Select.vue                    # bundled helper
│     ├─ color-picker-gradient/
│     │  ├─ ColorPickerWithGradient.vue
│     │  ├─ Select.vue
│     │  └─ GradientStopInput.vue
│     ├─ color-picker-mini/ColorPickerMini.vue
│     └─ … (one folder per item)
├─ content/public/r/                      # BUILD OUTPUT → vuelor.dev/r/*.json
└─ package.json                           # + registry:build script
```

- **Internal imports must use `@/registry`** so the CLI rewrites them on install. Rewrite helpers'
  `../common/Select.vue` → `@/registry/default/color-picker/Select.vue`. `@vuelor/picker`, `reka-ui`,
  `@vueuse/core`, `tailwind-merge` imports stay untouched (npm deps).
- **Scripts** (`docs/package.json`):
  ```jsonc
  { "scripts": {
    "registry:build": "shadcn-vue build --output content/public/r",
    "docs:build": "pnpm registry:build && vitepress build"
  } }
  ```
  Add `shadcn-vue` as a devDep; add `./registry/**/*.{js,ts,vue}` to the docs Tailwind content glob.
- **Single source of truth (top maintenance risk):** the `::: demo` container currently reads from
  `docs/components/examples/`. Point demos at `docs/registry/default/*` (or generate `registry/` from
  `examples/` in a prebuild) so demos can't drift from what `add` installs.

---

## 4. Sample `registry.json` + a full item

```jsonc
// docs/registry.json
{
  "$schema": "https://shadcn-vue.com/schema/registry.json",
  "name": "vuelor",
  "homepage": "https://vuelor.dev",
  "items": [
    {
      "name": "color-picker-theme",
      "type": "registry:theme",
      "title": "Vuelor Theme",
      "description": "Tailwind v4 tokens required by @vuelor/picker in tailwindcss mode.",
      "cssVars": {
        "theme": {
          "color-vuelor-primary": "#0d99ff",
          "color-vuelor-surface": "#ffffff",
          "color-vuelor-border":  "#e6e6e6",
          "color-vuelor-input":   "#f5f5f5",
          "shadow-vuelor-card":  "0 2px 5px 0 #00000026, 0 10px 16px 0 #0000001f, 0 0 .5px 0 #0000001f",
          "shadow-vuelor-thumb": "0px 0px .5px #0000002e, 0px 3px 8px #0000001a, 0px 1px 3px #0000001a",
          "shadow-vuelor-inner": "inset 0 0 0 1px #0000001a"
        }
      }
    },
    {
      "name": "color-picker-mini",
      "type": "registry:block",
      "title": "Color Picker (Mini)",
      "description": "Canvas + hue-slider picker on @vuelor/picker.",
      "dependencies": ["@vuelor/picker@^1.0.1", "reka-ui"],
      "registryDependencies": ["@vuelor/color-picker-theme"],
      "files": [
        { "path": "registry/default/color-picker-mini/ColorPickerMini.vue", "type": "registry:component" }
      ]
    }
    // … the other 10 items
  ]
}
```

Emitted item (`vuelor.dev/r/color-picker.json`) — pinned dep, bundled helper, v3 caveat in `docs`:

```jsonc
{
  "$schema": "https://shadcn-vue.com/schema/registry-item.json",
  "name": "color-picker",
  "type": "registry:block",
  "title": "Color Picker",
  "description": "Full picker: eyedropper, hue/alpha sliders, switchable HEX/RGB/HSL/HSB inputs.",
  "author": "Vuelor <https://vuelor.dev>",
  "dependencies": ["@vuelor/picker@^1.0.1", "reka-ui"],
  "registryDependencies": ["color-picker-theme"],
  "files": [
    { "path": "registry/default/color-picker/ColorPicker.vue", "type": "registry:component", "content": "<…inlined; @/registry import for Select.vue…>" },
    { "path": "registry/default/color-picker/Select.vue",      "type": "registry:component", "content": "<…inlined Select.vue…>" }
  ],
  "docs": "Tailwind v4: tokens come from the color-picker-theme dependency. Tailwind v3 ONLY: add './node_modules/@vuelor/picker/dist/index.js' to your tailwind.config content array or the vuelor-* classes get purged. Non-Tailwind: set styling=\"vanillacss\" and import '@vuelor/picker/style.css'.",
  "categories": ["color-picker", "form", "input"],
  "meta": { "vuelorVersion": "^1.0.1", "stylingMode": "tailwindcss" }
}
```

`target` is omitted (required only for `registry:page`/`registry:file`).

---

## 5. Roadmap (phased)

- **Phase 0 — De-risk. ✅ DONE** (results in §0): `build` on stable CLI, `registry:theme` valid,
  host serves `/r/*.json` with permissive CORS, `add` supports local path.
- **Phase 1 — Skeleton. ✅ DONE** (results above): `registry.json` with `color-picker-theme` +
  `color-picker-mini`; `registry:build` script wired into `docs/package.json`; built to
  `content/public/r/`; verified a clean namespaced `add` into a scratch project.
- **Phase 2 — Port all 11. ✅ DONE.** A generator (`docs/scripts/build-registry.mjs` + shared
  `docs/registry.config.mjs`) derives the whole registry from the canonical
  `docs/components/examples/*` — **the single source of truth that already drives the docs demos**.
  It rewrites `../common/*` helper imports to `@/registry`, bundles the helpers into `color-picker` +
  `color-picker-gradient`, and **auto-derives npm `dependencies` from the actual imports** (so the
  gradient item correctly picks up `@vueuse/core` + `tailwind-merge` and nothing can be forgotten).
  Verified: real namespaced `add` of `color-picker` + `color-picker-gradient` wrote all 5 files with
  the bundled-helper imports correctly rewritten to the consumer's `@/components/...` alias.
  *(Decision: the `showcase` item was dropped — `Showcase.vue` is coupled to VitePress CSS vars/markup
  and shouldn't ship to consumers.)*
- **Phase 3 — Theming hardening. ✅ DONE.** F2 fixed: color keys are now written **without** the
  `color-` prefix so shadcn emits a clean `--color-vuelor-primary: var(--vuelor-primary)` (no
  `--color-color-*` duplication). Added `--drop-shadow-vuelor-thumb` for the gradient thumbs. v3 +
  vanilla notes are emitted into every item's `docs`. (Live pixel QA in a real app is left as a
  manual step; file/import/token/dep correctness is verified end-to-end.)
- **Phase 4 — Consumer docs. ✅ DONE.** New `docs/content/guide/cli.md` (registry setup + per-item
  `add` table + MCP), added to the sidebar; a copy-paste `add @vuelor/<item>` command now renders
  under **every** `::: demo` (one change in `ComponentDemo.vue`, mapped via the shared manifest); the
  package `README.md` leads with the CLI path. The CLI page flows into `llms.txt`/`llms-full.txt`.
- **Phase 5 — AI skill + MCP. ✅ DONE.** `skills/vuelor/` ships `SKILL.md` + `install.md` +
  `examples.md` + `theming.md` + `rules/composition.md` + `rules/styling.md`, with the verified
  frontmatter, `info --json` project-context injection, and accurate composition/styling rules. MCP
  config is documented in both the skill and the CLI guide.
- **Phase 6 — CI coupling. ✅ DONE.** `.github/workflows/registry.yml` installs, runs
  `pnpm --filter docs registry:build`, **fails on drift** (`git diff --exit-code` over the generated
  registry — enforces single-source-of-truth), and validates every emitted item has `name`/`type` and
  inlined file `content`. Dep-superset checking is now inherent because deps are auto-derived.

---

## 6. AI skills — overview & research

A skill is a `SKILL.md` directory (YAML frontmatter + Markdown), distributed via the agent-agnostic
**`skills` CLI** (vercel-labs, skills.sh) — `pnpm dlx skills add <owner>/<repo>` symlinks it into each
agent's skills dir (70+ agents). It is **independent of the shadcn-vue registry** (`shadcn-vue add`
does not install skills; there is no `registry:skill` type).

**Proposed `vuelor` skill** (shipped in-repo, listed on skills.sh):

```
skills/vuelor/
├─ SKILL.md         # frontmatter + when-to-use + workflow + rules
├─ install.md       # @vuelor registries line; add commands; init prereq
├─ examples.md      # machine-readable catalog (the §2 table) — the heart of AI reuse
├─ theming.md       # 3 modes; tailwind token set vs the LARGER vanilla set; v3 purge caveat
└─ rules/
   ├─ composition.md  # everything lives inside ColorPickerRoot; useForwardPropsEmits forwarding (gradient uses manual useVModel)
   └─ styling.md      # ui-prop slot overrides (3-level priority via twMerge); per-instance CSS vars on .vuelor-picker-root in vanilla mode
```

`SKILL.md` frontmatter (mirrors shadcn-vue's):

```yaml
---
name: vuelor
description: Add, compose, and style Vuelor color pickers (@vuelor/picker) in Vue/Nuxt apps. Triggers on "color picker", "gradient picker", "@vuelor", or a components.json with the @vuelor registry.
user-invocable: false
allowed-tools: Bash(npx shadcn-vue@latest *), Bash(pnpm dlx shadcn-vue@latest *)
---
```

Agent workflow it encodes: detect `components.json` → ensure `@vuelor` in `registries` (else add it) →
pick the item by intent (mini vs popover vs gradient) from `examples.md` → emit
`npx shadcn-vue@latest add @vuelor/<name>` → enforce composition/styling rules.

**MCP — near-zero extra work.** The shadcn-vue MCP server (`npx shadcn-vue@latest mcp`; init
`mcp init --client claude|cursor|vscode|codex|opencode`) exposes 7 tools (`get_project_registries`,
`list/search/view_items_in_registries`, `get_item_examples_from_registries`,
`get_add_command_for_items`, `get_audit_checklist`) that operate over whatever namespaces are in the
project's `components.json`. Once a consumer configures `@vuelor`, an agent can search/view/install
our items with no Vuelor-specific MCP work. (Config caveat: VS Code uses `mcpServers` in shadcn-vue
docs vs `servers` upstream — note both.)

---

## 7. Broader DX & AI-readiness wins

1. **Single source of truth** for example code (docs demo == registry file) — the #1 long-term risk.
2. **Lead README/docs with the CLI path** alongside `pnpm add @vuelor/picker`.
3. **Schema-validate in CI** + assert declared deps ⊇ actual imports.
4. **Version-pin + regenerate** the registry on each picker release. ✅ Done — `release.yml`'s
   `sync-registry` job re-pins `PICKER_VERSION` to the published version, regenerates, and commits
   back to `main` (which triggers the Deploy workflow).
5. **Extend existing AI assets:** append the registry catalog (item names + `add` commands) to
   `llms.txt`/`llms-full.txt` and/or publish `vuelor.dev/r/index.json`; add `robots.txt`/`sitemap.xml`
   covering `/r/*`.
6. **Repo slug.** ✅ Resolved — the canonical slug is `olekspolk/vuelor` (the deprecated
   `vue-coolor-picker` remote has been updated). The skill's `skills add olekspolk/vuelor` command
   and all GitHub references use it.
7. **Optional showcase item** for one-command scaffolding — keep its dependency graph shallow.

---

## 8. References

- shadcn-vue registry / CLI / components.json / skills docs (`shadcn-vue.com`), namespace + MCP
  mirrored from `ui.shadcn.com`.
- Live schemas: `https://shadcn-vue.com/schema/registry.json`, `…/registry-item.json`.
- Skills framework: `skills.sh`, `github.com/vercel-labs/skills`; reference skill `unovue/shadcn-vue`.
