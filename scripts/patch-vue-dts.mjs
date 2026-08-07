// Rewrites `.vue` import specifiers inside emitted .d.ts files to `.vue.js`,
// so NodeNext/Node16 consumers resolve them (via TS's .js -> .d.ts extension
// substitution) to the adjacent `.vue.d.ts` files vue-tsc emits. Bundler-mode
// resolution applies the same substitution, so both consumer configs work.
// Usage: node ../../scripts/patch-vue-dts.mjs dist   (run from a package dir)
import { readdirSync, readFileSync, statSync, writeFileSync } from 'node:fs'
import { join } from 'node:path'

const root = process.argv[2] ?? 'dist'

function walk (dir) {
  for (const entry of readdirSync(dir)) {
    const path = join(dir, entry)
    if (statSync(path).isDirectory()) walk(path)
    else if (path.endsWith('.d.ts')) patch(path)
  }
}

function patch (file) {
  const source = readFileSync(file, 'utf8')
  const patched = source
    .replace(/(from\s*['"])([^'"]+\.vue)(['"])/g, '$1$2.js$3')
    .replace(/(import\(['"])([^'"]+\.vue)(['"]\))/g, '$1$2.js$3')
  if (patched !== source) writeFileSync(file, patched)
}

walk(root)
