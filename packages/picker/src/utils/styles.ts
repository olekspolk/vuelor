import { extendTailwindMerge } from 'tailwind-merge'

// tailwind-merge only knows the built-in shadow scale, so without this the
// theme's named shadows (shadow-vuelor-card etc.) would survive a consumer's
// shadow-none/shadow-lg override and stylesheet order would decide — e.g. a
// nested picker keeping its card shadow despite class="shadow-none".
const twMerge = extendTailwindMerge({
  extend: {
    classGroups: {
      shadow: [{ shadow: ['vuelor-card', 'vuelor-thumb', 'vuelor-inner'] }],
      'drop-shadow': [{ 'drop-shadow': ['vuelor-thumb'] }]
    }
  }
})

type ClassArg = string | undefined | null | false
type GroupsConfig = Record<string, Record<string, string>>
type PartialDeep<T> = { [K in keyof T]?: T[K] extends object ? PartialDeep<T[K]> : T[K] }

export type Styling = 'tailwindcss' | 'vanillacss' | 'unstyled'

// Maps a theme group/slot pair to a vanilla CSS class name. Sibling packages
// (e.g. @vuelor/gradient) pass their own mapper so their vanillacss mode gets
// its own class namespace instead of vuelor-picker-*.
export type VanillaClassFn = (group: string, slot: string) => string

function vanillaCssClass(group: string, slot: string): string {
  if (group === 'picker') return `vuelor-picker-${slot}`
  if (group === 'dropper' && slot === 'root') return 'vuelor-picker-eye-dropper'
  return `vuelor-picker-${group}-${slot}`
}

export function createUiSlots<T extends GroupsConfig>(config: T, global?: PartialDeep<T>, styling: Styling = 'tailwindcss', vanillaClass: VanillaClassFn = vanillaCssClass) {
  return <K extends keyof T>(...groups: K[]) => {
    const ui: Record<string, (...classes: ClassArg[]) => string> = {}

    for (const group of groups) {
      const groupMap = config[group]
      if (!groupMap) continue

      for (const [slotKey, themeValue] of Object.entries(groupMap)) {
        ui[slotKey] = (...classes: ClassArg[]) => {
          const g = global?.[group as string] as Record<string, string> | undefined
          const globalValue = g?.[slotKey]

          let baseClass: string
          if (styling === 'unstyled') {
            baseClass = ''
          } else if (styling === 'vanillacss') {
            baseClass = vanillaClass(group as string, slotKey)
          } else {
            baseClass = themeValue
          }

          return twMerge(
            baseClass,
            globalValue,
            ...(classes.filter(Boolean) as string[])
          )
        }
      }
    }

    type SlotsUnion = keyof ({ [P in K]: T[P] }[K])
    return ui as {
      [S in Extract<SlotsUnion, string>]: (...classes: ClassArg[]) => string
    }
  }
}

export type UiSliderSlots = {
  root: string
  track: string
  thumb: string
}

export type UiInputSlots = {
  group: string
  field: string
  item: string
  label: string
}
