import tailwindcss from '../theme/tailwindcss'

export default {
  tailwindcss
}

export type ThemeSlots = Partial<{
  picker: Partial<typeof tailwindcss.picker>
  dropper: Partial<typeof tailwindcss.dropper>
  shared: Partial<typeof tailwindcss.shared>
  canvas: Partial<typeof tailwindcss.canvas>
  slider: Partial<typeof tailwindcss.slider>
  input: Partial<typeof tailwindcss.input>
  swatch: Partial<typeof tailwindcss.swatch>
}>
