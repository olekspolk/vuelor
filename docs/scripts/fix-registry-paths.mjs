// Post-processes the `shadcn-vue build` output. The build keeps each file's source path
// (registry/<style>/<item>/<file>) as the install path, which makes the shadcn-vue CLI leak the
// style segment for single-file items (e.g. they land in components/default/<item>/ instead of
// components/<item>/). Stripping the `registry/<style>/` prefix from the emitted file paths makes
// the CLI install every item consistently to components/<item>/<file>. The inlined `@/registry/...`
// import aliases are rewritten by the CLI independently of these paths, so helper imports still
// resolve. Run after `shadcn-vue build`.

import { readdirSync, readFileSync, writeFileSync } from 'node:fs'
import { dirname, join, resolve } from 'node:path'
import { fileURLToPath } from 'node:url'

const __dirname = dirname(fileURLToPath(import.meta.url))
const OUT = resolve(__dirname, '..', 'content', 'public', 'r')

function stripPath(p) {
  const parts = (p || '').split('/')
  // registry/<style>/<item>/<file...> -> <item>/<file...>
  return parts[0] === 'registry' && parts.length > 2 ? parts.slice(2).join('/') : p
}

let fixed = 0
for (const file of readdirSync(OUT)) {
  if (!file.endsWith('.json')) continue
  const full = join(OUT, file)
  const json = JSON.parse(readFileSync(full, 'utf8'))
  // Handle both a single item ({ files }) and the index ({ items: [{ files }] }).
  const items = Array.isArray(json.items) ? json.items : [json]
  let changed = false
  for (const item of items) {
    for (const f of item.files ?? []) {
      const next = stripPath(f.path)
      if (next !== f.path) {
        f.path = next
        changed = true
      }
    }
  }
  if (changed) {
    writeFileSync(full, JSON.stringify(json, null, 2) + '\n')
    fixed++
  }
}

console.log(`✔ Normalized install paths in ${fixed} registry JSON files`)
