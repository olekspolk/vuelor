// Generates the shadcn-vue registry (registry.json + registry/<style>/<item>/*.vue) from the
// canonical example components in docs/components. The examples are the SINGLE SOURCE OF TRUTH —
// they drive both the docs `::: demo` blocks and the registry, so the two can never drift.
//
// What this script does per example item:
//   1. Copies the example SFC into registry/<style>/<item>/, rewriting any `../common/X.vue`
//      helper import to the `@/registry/<style>/<item>/X.vue` alias and bundling the helper.
//   2. Auto-derives the npm `dependencies` by scanning the actual import specifiers (so an item can
//      never forget to declare e.g. @vueuse/core).
//   3. Emits a registry-item entry into registry.json.
//
// Run: `node scripts/build-registry.mjs` (wired as the first half of `pnpm registry:build`).

import { readFileSync, writeFileSync, mkdirSync, rmSync } from 'node:fs'
import { dirname, join, resolve } from 'node:path'
import { fileURLToPath } from 'node:url'
import {
  STYLE,
  NAMESPACE,
  PICKER_VERSION,
  AUTHOR,
  HOMEPAGE,
  EXAMPLE_ITEMS,
  THEME_VARS,
  DOCS_NOTE,
} from '../registry.config.mjs'

const __dirname = dirname(fileURLToPath(import.meta.url))
const DOCS = resolve(__dirname, '..')
const EXAMPLES = join(DOCS, 'components', 'examples')
const COMMON = join(DOCS, 'components', 'common')

const REGISTRY_DIR = join(DOCS, 'registry')
const STYLE_DIR = join(REGISTRY_DIR, STYLE)
const REGISTRY_JSON = join(DOCS, 'registry.json')

const THEME_ITEM = 'color-picker-theme'

/** Rewrite `../common/X.vue` imports to the @/registry alias; return the rewritten source + helper names. */
function rewriteHelperImports(src, itemName) {
  const helpers = new Set()
  const rewritten = src.replace(/(['"])\.\.\/common\/([A-Za-z0-9_]+)\.vue\1/g, (_m, q, name) => {
    helpers.add(name)
    return `${q}@/registry/${STYLE}/${itemName}/${name}.vue${q}`
  })
  return { rewritten, helpers: [...helpers] }
}

/** Collect bare npm import specifiers from a set of file contents (drops relative, @/ and vue). */
function deriveDependencies(contents) {
  const specs = new Set()
  const re = /\bfrom\s*(['"])([^'"]+)\1|\bimport\s*(['"])([^'"]+)\3/g
  for (const c of contents) {
    let m
    while ((m = re.exec(c)) !== null) {
      const spec = m[2] ?? m[4]
      if (!spec || spec.startsWith('.') || spec.startsWith('@/')) continue
      specs.add(spec)
    }
  }
  specs.delete('vue') // always present in a Vue project; not worth declaring
  return [...specs]
    .sort()
    .map((s) => (s === '@vuelor/picker' ? `@vuelor/picker@${PICKER_VERSION}` : s))
}

function buildExampleItem(entry) {
  const src = readFileSync(join(EXAMPLES, entry.file), 'utf8')
  const { rewritten, helpers } = rewriteHelperImports(src, entry.name)

  const itemDir = join(STYLE_DIR, entry.name)
  mkdirSync(itemDir, { recursive: true })

  const files = []
  const contents = []

  writeFileSync(join(itemDir, entry.file), rewritten)
  files.push({ path: `registry/${STYLE}/${entry.name}/${entry.file}`, type: 'registry:component' })
  contents.push(rewritten)

  for (const helper of helpers) {
    const helperSrc = readFileSync(join(COMMON, `${helper}.vue`), 'utf8')
    const { rewritten: helperRewritten } = rewriteHelperImports(helperSrc, entry.name)
    writeFileSync(join(itemDir, `${helper}.vue`), helperRewritten)
    files.push({ path: `registry/${STYLE}/${entry.name}/${helper}.vue`, type: 'registry:component' })
    contents.push(helperRewritten)
  }

  return {
    name: entry.name,
    type: 'registry:block',
    title: entry.title,
    description: entry.description,
    author: AUTHOR,
    dependencies: deriveDependencies(contents),
    registryDependencies: [`${NAMESPACE}/${THEME_ITEM}`],
    files,
    docs: DOCS_NOTE,
    categories: entry.categories,
    meta: { vuelorVersion: PICKER_VERSION, stylingMode: 'tailwindcss' },
  }
}

function themeItem() {
  return {
    name: THEME_ITEM,
    type: 'registry:theme',
    title: 'Vuelor Theme',
    description:
      'Tailwind v4 design tokens (colors + shadows) required by @vuelor/picker in its default tailwindcss styling mode.',
    cssVars: { theme: THEME_VARS },
  }
}

// --- main ---
rmSync(STYLE_DIR, { recursive: true, force: true })
mkdirSync(STYLE_DIR, { recursive: true })

const items = [themeItem(), ...EXAMPLE_ITEMS.map(buildExampleItem)]

const registry = {
  $schema: 'https://shadcn-vue.com/schema/registry.json',
  name: 'vuelor',
  homepage: HOMEPAGE,
  items,
}

writeFileSync(REGISTRY_JSON, JSON.stringify(registry, null, 2) + '\n')

console.log(`✔ Generated registry.json with ${items.length} items:`)
for (const item of items) {
  const deps = item.dependencies?.length ? ` deps=[${item.dependencies.join(', ')}]` : ''
  console.log(`  - ${item.name} (${item.type})${deps}`)
}
