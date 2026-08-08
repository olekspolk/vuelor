import { describe, it, expect } from 'vitest'
import { createUiSlots } from '../src/utils/styles.ts'

const CONFIG = {
  picker: { root: 'p-4 shadow-vuelor-card' },
  dropper: { root: 'rounded-[5px]' },
  slider: { track: 'h-4 drop-shadow-vuelor-thumb', root: 'flex' }
}

describe('createUiSlots (tailwindcss mode)', () => {
  it('merges base, global and local classes with later wins', () => {
    const uiSlots = createUiSlots(CONFIG, { picker: { root: 'p-2' } })
    const ui = uiSlots('picker')
    expect(ui.root()).toBe('shadow-vuelor-card p-2')
    expect(ui.root('p-0')).toBe('shadow-vuelor-card p-0')
  })

  it('lets shadow-none displace the named vuelor shadows', () => {
    const ui = createUiSlots(CONFIG)('picker')
    expect(ui.root('shadow-none')).toBe('p-4 shadow-none')
  })

  it('lets drop-shadow overrides displace drop-shadow-vuelor-thumb', () => {
    const ui = createUiSlots(CONFIG)('slider')
    expect(ui.track('drop-shadow-none')).toBe('h-4 drop-shadow-none')
  })

  it('exposes every requested group and skips unknown ones', () => {
    const uiSlots = createUiSlots(CONFIG)
    expect(Object.keys(uiSlots('picker', 'slider')).sort()).toEqual(['root', 'track'])
    expect(Object.keys(uiSlots('nope' as never))).toEqual([])
  })

  it('ignores falsy class arguments', () => {
    const ui = createUiSlots(CONFIG)('picker')
    expect(ui.root(undefined, null, false, 'mt-1')).toBe('p-4 shadow-vuelor-card mt-1')
  })
})

describe('createUiSlots (vanillacss mode)', () => {
  it('maps groups to the picker class namespace with its special cases', () => {
    const uiSlots = createUiSlots(CONFIG, undefined, 'vanillacss')
    expect(uiSlots('picker').root()).toBe('vuelor-picker-root')
    expect(uiSlots('dropper').root()).toBe('vuelor-picker-eye-dropper')
    expect(uiSlots('slider').track()).toBe('vuelor-picker-slider-track')
  })

  it('still appends consumer classes after the vanilla class', () => {
    const ui = createUiSlots(CONFIG, undefined, 'vanillacss')('picker')
    expect(ui.root('custom')).toBe('vuelor-picker-root custom')
  })

  it('accepts a custom class mapper for sibling packages', () => {
    const uiSlots = createUiSlots(CONFIG, undefined, 'vanillacss', (group, slot) => `x-${group}-${slot}`)
    expect(uiSlots('picker').root()).toBe('x-picker-root')
  })
})

describe('createUiSlots (unstyled mode)', () => {
  it('strips base classes but keeps overrides', () => {
    const ui = createUiSlots(CONFIG, undefined, 'unstyled')('picker')
    expect(ui.root()).toBe('')
    expect(ui.root('p-2')).toBe('p-2')
  })
})
