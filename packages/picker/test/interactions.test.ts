// @vitest-environment jsdom
import { describe, it, expect, beforeAll, vi } from 'vitest'
import { h, nextTick } from 'vue'
import { mount } from '@vue/test-utils'
import { SliderRoot } from 'reka-ui'
import {
  ColorPickerRoot,
  ColorPickerCanvas,
  ColorPickerSliderHue,
  ColorPickerSliderAlpha,
  ColorPickerInputHex,
  ColorPickerInputRGB,
  ColorPickerSwatch
} from '../src'

beforeAll(() => {
  globalThis.ResizeObserver = class {
    observe () {}
    unobserve () {}
    disconnect () {}
  } as never
})

function mountPicker (props: Record<string, unknown> = {}, children: () => unknown) {
  return mount(ColorPickerRoot as never, {
    props: { modelValue: '#FF000080', ...props },
    slots: { default: children }
  })
}

const lastModel = (wrapper: ReturnType<typeof mountPicker>) => {
  const emitted = wrapper.emitted('update:modelValue')
  return emitted ? String(emitted[emitted.length - 1]![0]) : null
}

describe('ColorPickerInputHex (context mode)', () => {
  it('keeps the current alpha on a plain 6-digit edit', async () => {
    const wrapper = mountPicker({}, () => h(ColorPickerInputHex))
    const hex = wrapper.get('[aria-label="Hex"]')
    expect((hex.element as HTMLInputElement).value).toBe('FF0000')

    await hex.setValue('00ff00')
    await hex.trigger('blur')
    expect(lastModel(wrapper)).toBe('#00FF0080')
    expect(wrapper.emitted('valueCommit')).toHaveLength(1)
  })

  it('applies an explicitly typed 8-digit alpha', async () => {
    const wrapper = mountPicker({}, () => h(ColorPickerInputHex))
    const hex = wrapper.get('[aria-label="Hex"]')
    await hex.setValue('11223344')
    await hex.trigger('blur')
    expect(lastModel(wrapper)).toBe('#11223344')
  })

  it('restores the field on invalid input without emitting', async () => {
    const wrapper = mountPicker({}, () => h(ColorPickerInputHex))
    const hex = wrapper.get('[aria-label="Hex"]')
    await hex.setValue('zzz')
    await hex.trigger('blur')
    expect((hex.element as HTMLInputElement).value).toBe('FF0000')
    expect(wrapper.emitted('update:modelValue')).toBeUndefined()
  })

  it('edits alpha through the opacity field and treats same-percent blurs as no-ops', async () => {
    const wrapper = mountPicker({}, () => h(ColorPickerInputHex))
    const opacity = wrapper.get('[aria-label="Opacity"]')
    expect((opacity.element as HTMLInputElement).value).toBe('50')

    await opacity.setValue('25')
    await opacity.trigger('blur')
    expect(lastModel(wrapper)).toBe('#FF000040')

    // Tab-through with the same percent must not re-quantize the stored byte.
    await opacity.setValue('25')
    await opacity.trigger('blur')
    expect(wrapper.emitted('update:modelValue')).toHaveLength(1)

    await opacity.setValue('nope')
    await opacity.trigger('blur')
    expect((opacity.element as HTMLInputElement).value).toBe('25')
    expect(wrapper.emitted('update:modelValue')).toHaveLength(1)
  })
})

describe('ColorPickerInputHex (controlled mode)', () => {
  function mountControlled (modelValue: string, onUpdate: (v: string) => void) {
    return mountPicker({}, () => h(ColorPickerInputHex, { modelValue, 'onUpdate:modelValue': onUpdate }))
  }

  it('keeps a no-op blur bit-exact instead of re-quantizing alpha', async () => {
    const spy = vi.fn()
    const wrapper = mountControlled('#FF8D2825', spy)
    const hex = wrapper.get('[aria-label="Hex"]')
    await hex.setValue('FF8D28')
    await hex.trigger('blur')
    expect(spy).not.toHaveBeenCalled()
  })

  it('preserves the bound alpha byte through a color-only edit', async () => {
    const spy = vi.fn()
    const wrapper = mountControlled('#FF8D2825', spy)
    const hex = wrapper.get('[aria-label="Hex"]')
    await hex.setValue('aabbcc')
    await hex.trigger('blur')
    expect(spy).toHaveBeenCalledWith('#AABBCC25')
  })

  it('composes a changed opacity percent with the bound color', async () => {
    const spy = vi.fn()
    const wrapper = mountControlled('#FF8D2825', spy)
    const opacity = wrapper.get('[aria-label="Opacity"]')
    expect((opacity.element as HTMLInputElement).value).toBe('15')

    await opacity.setValue('15')
    await opacity.trigger('blur')
    expect(spy).not.toHaveBeenCalled()

    await opacity.setValue('100')
    await opacity.trigger('blur')
    expect(spy).toHaveBeenCalledWith('#FF8D28FF')
  })
})

describe('ColorPickerInputRGB channels', () => {
  it('commits changed channels and clamps out-of-range values', async () => {
    const wrapper = mountPicker({}, () => h(ColorPickerInputRGB))
    const inputs = wrapper.findAll('input')

    await inputs[0]!.setValue('128')
    await inputs[0]!.trigger('blur')
    expect(lastModel(wrapper)).toBe('#80000080')

    await inputs[2]!.setValue('999')
    await inputs[2]!.trigger('blur')
    expect(lastModel(wrapper)).toBe('#8000FF80')
    expect(wrapper.emitted('valueCommit')).toHaveLength(2)
  })

  it('restores the field on non-numeric input without committing', async () => {
    const wrapper = mountPicker({}, () => h(ColorPickerInputRGB))
    const green = wrapper.findAll('input')[1]!
    await green.setValue('abc')
    await green.trigger('blur')
    expect((green.element as HTMLInputElement).value).toBe('0')
    expect(wrapper.emitted('update:modelValue')).toBeUndefined()
  })
})

describe('sliders', () => {
  it('routes hue changes into the model, preserving alpha', async () => {
    const wrapper = mountPicker({}, () => h(ColorPickerSliderHue))
    wrapper.findComponent(SliderRoot).vm.$emit('update:modelValue', [180])
    await nextTick()
    expect(lastModel(wrapper)).toBe('#00FFFF80')
  })

  it('routes alpha percent changes into the model', async () => {
    const wrapper = mountPicker({}, () => h(ColorPickerSliderAlpha))
    const slider = wrapper.findComponent(SliderRoot)
    slider.vm.$emit('update:modelValue', [25])
    await nextTick()
    expect(lastModel(wrapper)).toBe('#FF000040')

    slider.vm.$emit('valueCommit', [25])
    expect(wrapper.emitted('valueCommit')).toHaveLength(1)
  })
})

describe('ColorPickerSwatch', () => {
  it('applies its color, commits and emits select', async () => {
    const wrapper = mountPicker({}, () => h(ColorPickerSwatch, { value: '#00FF00FF' }))
    await wrapper.get('button').trigger('click')
    expect(lastModel(wrapper)).toBe('#00FF00FF')
    expect(wrapper.emitted('valueCommit')).toHaveLength(1)
    expect(wrapper.findComponent(ColorPickerSwatch as never).emitted('select')).toEqual([['#00FF00FF']])
  })

  it('ignores clicks while the picker is disabled', async () => {
    const wrapper = mountPicker({ disabled: true }, () => h(ColorPickerSwatch, { value: '#00FF00FF' }))
    await wrapper.get('button').trigger('click')
    expect(wrapper.emitted('update:modelValue')).toBeUndefined()
    expect(wrapper.findComponent(ColorPickerSwatch as never).emitted('select')).toBeUndefined()
  })
})

describe('ColorPickerCanvas', () => {
  it('moves saturation/brightness with arrow keys and commits each step', async () => {
    const wrapper = mountPicker({ modelValue: '#808080FF' }, () => h(ColorPickerCanvas))
    const canvas = wrapper.get('[class*="canvas"], div[style*="linear-gradient"]')

    await canvas.trigger('keydown', { key: 'ArrowRight' })
    expect(wrapper.emitted('valueCommit')).toHaveLength(1)
    const afterRight = lastModel(wrapper)
    expect(afterRight).not.toBeNull()

    await canvas.trigger('keydown', { key: 'ArrowUp', shiftKey: true })
    expect(wrapper.emitted('valueCommit')).toHaveLength(2)
    expect(lastModel(wrapper)).not.toBe(afterRight)
  })

  it('picks a position from pointer coordinates and commits on release', async () => {
    const wrapper = mountPicker({ modelValue: '#808080FF' }, () => h(ColorPickerCanvas))
    const canvas = wrapper.get('div[style*="gradient"]')
    canvas.element.getBoundingClientRect = () =>
      ({ top: 0, left: 0, width: 100, height: 100, right: 100, bottom: 100, x: 0, y: 0, toJSON: () => ({}) }) as DOMRect

    canvas.element.dispatchEvent(new MouseEvent('pointerdown', { clientX: 100, clientY: 0, bubbles: false }))
    await nextTick()
    // Full right (s=1), top (v=1) of a gray canvas: pure red at full alpha.
    expect(lastModel(wrapper)).toBe('#FF0000FF')

    document.dispatchEvent(new Event('pointerup'))
    expect(wrapper.emitted('valueCommit')).toHaveLength(1)
  })

  it('adjusts hue with the wheel', async () => {
    const wrapper = mountPicker({ modelValue: '#FF0000FF' }, () => h(ColorPickerCanvas))
    const canvas = wrapper.get('div[style*="gradient"]')
    canvas.element.dispatchEvent(new WheelEvent('wheel', { deltaY: 600, bubbles: false }))
    await nextTick()
    // 600 * 0.1 = +60 degrees: red -> yellow.
    expect(lastModel(wrapper)).toBe('#FFFF00FF')
    await new Promise((resolve) => setTimeout(resolve, 200))
    expect(wrapper.emitted('valueCommit')).toHaveLength(1)
  })
})

describe('ColorPickerRoot', () => {
  it('warns and falls back to defaultValue on a format/type mismatch', () => {
    const warn = vi.spyOn(console, 'warn').mockImplementation(() => {})
    const wrapper = mountPicker(
      { modelValue: { rgb: { r: 1, g: 2, b: 3 } }, format: 'hexa', defaultValue: '#00FF00FF' },
      () => h(ColorPickerInputHex)
    )
    expect(warn).toHaveBeenCalledWith(expect.stringContaining('type mismatch'))
    expect((wrapper.get('[aria-label="Hex"]').element as HTMLInputElement).value).toBe('00FF00')
    warn.mockRestore()
  })

  it('exposes the color engine for programmatic writes', async () => {
    const wrapper = mountPicker({}, () => h(ColorPickerInputHex))
    const vm = wrapper.vm as never as { color: { hexa: { value: string } } }
    vm.color.hexa.value = '#123456FF'
    await nextTick()
    expect(lastModel(wrapper)).toBe('#123456FF')
  })
})
