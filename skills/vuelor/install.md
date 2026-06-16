# Installing Vuelor pickers

## Prerequisite

The project must be shadcn-vue-initialized — a valid `components.json` with path aliases and the `cn`
utility. If it's missing, run `npx shadcn-vue@latest init`. The CLI `add` command cannot run without
`components.json`; the only init-free path is manual copy-paste.

## Register the `@vuelor` registry (one-time)

Add the namespace to the `registries` map in `components.json`:

```json
{
  "registries": {
    "@vuelor": "https://vuelor.dev/r/{name}.json"
  }
}
```

`{name}` is substituted from `@vuelor/<item>` at install time.

## Add items

```bash
# one item
npx shadcn-vue@latest add @vuelor/color-picker

# several at once
npx shadcn-vue@latest add @vuelor/color-picker-mini @vuelor/color-picker-gradient

# by raw URL — no registries entry needed
npx shadcn-vue@latest add https://vuelor.dev/r/color-picker.json
```

Each `add`:

- copies the example SFC (and any bundled helper such as `Select.vue`) into the components directory, rewriting `@/registry/...` imports to the project's alias;
- installs npm dependencies (`@vuelor/picker`, `reka-ui`, plus `@vueuse/core` + `tailwind-merge` for the gradient editor);
- adds the `vuelor-*` design tokens via the `@vuelor/color-picker-theme` dependency.

> Note: `registryDependencies` inside Vuelor items are namespace-prefixed (`@vuelor/color-picker-theme`).
> A bare name would resolve against the default shadcn registry, not Vuelor. This is why the `@vuelor`
> registries entry (or the raw-URL form) is required.

## MCP (AI agents)

The standard [shadcn-vue MCP server](https://www.shadcn-vue.com/docs/mcp) exposes the `@vuelor`
registry to agents once it's configured in `components.json`. Configure it:

```bash
npx shadcn-vue@latest mcp init --client claude   # also: cursor | vscode | codex | opencode
```

```jsonc
// .mcp.json (Claude Code / Cursor)
{ "mcpServers": { "shadcn": { "command": "npx", "args": ["shadcn-vue@latest", "mcp"] } } }
```

> VS Code's `mcp.json` may use the key `servers` instead of `mcpServers` depending on version — try
> both if one doesn't load.

MCP tools available to the agent: `get_project_registries`, `list_items_in_registries`,
`search_items_in_registries`, `view_items_in_registries`, `get_item_examples_from_registries`,
`get_add_command_for_items`, `get_audit_checklist`.

## Installing this skill

```bash
npx skills add olekspolk/vuelor
```
