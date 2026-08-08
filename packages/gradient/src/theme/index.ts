import tailwindcss from './tailwindcss.ts'

export default {
  tailwindcss
}

// Vanilla class names for styling="vanillacss": the root group maps to
// vuelor-gradient-<slot>, every other group to vuelor-gradient-<group>-<slot>,
// with camelCase slots kebab-cased (thumbSwatch → thumb-swatch).
export function gradientVanillaClass (group: string, slot: string): string {
  const kebab = slot.replace(/[A-Z]/g, (char) => `-${char.toLowerCase()}`)
  if (group === 'root') return `vuelor-gradient-${kebab}`
  return `vuelor-gradient-${group}-${kebab}`
}

export type GradientThemeSlots = Partial<{
  root: Partial<typeof tailwindcss.root>
  slider: Partial<typeof tailwindcss.slider>
  input: Partial<typeof tailwindcss.input>
  button: Partial<typeof tailwindcss.button>
  preview: Partial<typeof tailwindcss.preview>
}>
