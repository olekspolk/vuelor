// Normalizes import specifiers inside emitted .d.ts files to the standard
// ESM `.js` form every resolver understands:
//   - `./x.ts`   -> `./x.js`      (vue-tsc copies allowImportingTsExtensions
//                                  specifiers verbatim; NodeNext consumers and
//                                  @vue/compiler-sfc's type resolver need the
//                                  .js form to substitute to x.d.ts)
//   - `./X.vue`  -> `./X.vue.js`  (resolves to the adjacent X.vue.d.ts)
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

function rewrite (specifier) {
  if (specifier.endsWith('.vue')) return `${specifier}.js`
  if (specifier.endsWith('.ts') && !specifier.endsWith('.d.ts')) {
    return `${specifier.slice(0, -3)}.js`
  }
  return specifier
}

function patch (file) {
  const source = readFileSync(file, 'utf8')
  const patched = source
    .replace(/(from\s*['"])([^'"]+)(['"])/g, (_, pre, spec, post) => pre + rewrite(spec) + post)
    .replace(/(import\(['"])([^'"]+)(['"]\))/g, (_, pre, spec, post) => pre + rewrite(spec) + post)
  if (patched !== source) writeFileSync(file, patched)
}

walk(root)
