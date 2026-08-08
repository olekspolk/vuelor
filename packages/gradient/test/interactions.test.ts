// @vitest-environment jsdom
import { describe, it, expect, beforeAll, vi } from 'vitest'
import { h, nextTick } from 'vue'
import { mount } from '@vue/test-utils'
import { SliderRoot } from 'reka-ui'
import {
  GradientPickerRoot,
  GradientPickerSlider,
  GradientPickerPositionInput,
  GradientPickerAngleInput,
  GradientPickerAddStop,
  GradientPickerRemoveStop,
  GradientPickerReverse,
  GradientPickerRotate,
  GradientPickerPreview
} from '../src'

// reka's thumbs measure themselves with ResizeObserver on mount.
beforeAll(() => {
  globalThis.ResizeObserver = class {
    observe () {}
    unobserve () {}
    disconnect () {}
  } as never
})

const FOUR_STOPS = 'linear-gradient(90deg, #FF0000FF 0%, #00FF00FF 33%, #0000FFFF 66%, #FFFF00FF 100%)'

function mountEditor (props: Record<string, unknown> = {}, slot?: (scope: never) => unknown) {
  return mount(GradientPickerRoot as never, {
    props: { modelValue: FOUR_STOPS, ...props },
    slots: {
      default: slot ?? (() => [
        h(GradientPickerSlider),
        h(GradientPickerAngleInput),
        h(GradientPickerPositionInput),
        h(GradientPickerAddStop),
        h(GradientPickerRemoveStop),
        h(GradientPickerReverse),
        h(GradientPickerRotate),
        h(GradientPickerPreview),
        h(GradientPickerPreview, { track: true })
      ])
    }
  })
}

const lastModel = (wrapper: ReturnType<typeof mountEditor>) => {
  const emitted = wrapper.emitted('update:modelValue')
  return emitted ? String(emitted[emitted.length - 1]![0]) : null
}

describe('GradientPickerRoot', () => {
  it('parses the bound model into editor state and exposes the engine', () => {
    const wrapper = mountEditor()
    const vm = wrapper.vm as never as { gradient: { stops: { value: unknown[] } } }
    expect(vm.gradient.stops.value).toHaveLength(4)
    expect(wrapper.findAll('[aria-label^="Gradient stop"]')).toHaveLength(4)
  })

  it('applies defaultValue for a null model', () => {
    const wrapper = mountEditor({ modelValue: null })
    expect(wrapper.findAll('[aria-label^="Gradient stop"]')).toHaveLength(2)
  })

  it('warns and keeps state for an unsupported model write', async () => {
    const warn = vi.spyOn(console, 'warn').mockImplementation(() => {})
    const wrapper = mountEditor()
    await wrapper.setProps({ modelValue: 'linear-gradient(to right, #f00, #00f)' })
    expect(warn).toHaveBeenCalledWith(expect.stringContaining('Unsupported modelValue'))
    expect(wrapper.findAll('[aria-label^="Gradient stop"]')).toHaveLength(4)
    warn.mockRestore()
  })

  it('warns about an unparseable defaultValue', () => {
    const warn = vi.spyOn(console, 'warn').mockImplementation(() => {})
    mountEditor({ modelValue: null, defaultValue: 'nope' })
    expect(warn).toHaveBeenCalledWith(expect.stringContaining('Unsupported defaultValue'))
    warn.mockRestore()
  })

  it('dedupes slot-driven commits against the last committed value', async () => {
    const wrapper = mountEditor({}, (scope: never) => {
      const { commitValue } = scope as { commitValue: () => void }
      return [
        h('button', { id: 'custom-commit', onClick: commitValue }),
        h(GradientPickerAddStop)
      ]
    })

    await wrapper.get('#custom-commit').trigger('click')
    await wrapper.get('#custom-commit').trigger('click')
    // Nothing changed since mount, so both commits are swallowed.
    expect(wrapper.emitted('valueCommit')).toBeUndefined()

    await wrapper.get('[aria-label="Add gradient stop"]').trigger('click')
    expect(wrapper.emitted('valueCommit')).toHaveLength(1)

    // Identical follow-up commit is deduped again.
    await wrapper.get('#custom-commit').trigger('click')
    expect(wrapper.emitted('valueCommit')).toHaveLength(1)
  })
})

describe('action buttons', () => {
  it('adds a midpoint stop and commits', async () => {
    const wrapper = mountEditor()
    await wrapper.get('[aria-label="Add gradient stop"]').trigger('click')
    expect(wrapper.findAll('[aria-label^="Gradient stop"]')).toHaveLength(5)
    expect(wrapper.emitted('valueCommit')).toHaveLength(1)
    expect(lastModel(wrapper)).toContain('#808000FF 17%')
  })

  it('removes the selected stop and commits, and disables at the floor', async () => {
    const wrapper = mountEditor({ modelValue: 'linear-gradient(90deg, #FF0000FF 0%, #0000FFFF 100%)' })
    const remove = wrapper.get('[aria-label="Remove gradient stop"]')
    expect(remove.attributes('disabled')).toBeDefined()

    await wrapper.get('[aria-label="Add gradient stop"]').trigger('click')
    expect(remove.attributes('disabled')).toBeUndefined()
    await remove.trigger('click')
    expect(wrapper.findAll('[aria-label^="Gradient stop"]')).toHaveLength(2)
    expect(wrapper.emitted('valueCommit')).toHaveLength(2)
  })

  it('reverses stops and commits', async () => {
    const wrapper = mountEditor()
    await wrapper.get('[aria-label="Reverse gradient"]').trigger('click')
    expect(lastModel(wrapper)).toBe(
      'linear-gradient(90deg, #FFFF00FF 0%, #0000FFFF 34%, #00FF00FF 67%, #FF0000FF 100%)'
    )
    expect(wrapper.emitted('valueCommit')).toHaveLength(1)
  })

  it('rotates the angle with wrap-around and commits', async () => {
    const wrapper = mountEditor()
    const rotate = wrapper.get('[aria-label="Rotate gradient 90 degrees"]')
    await rotate.trigger('click')
    expect(lastModel(wrapper)).toContain('linear-gradient(180deg')
    await rotate.trigger('click')
    await rotate.trigger('click')
    await rotate.trigger('click')
    expect(lastModel(wrapper)).toContain('linear-gradient(90deg')
    expect(wrapper.emitted('valueCommit')).toHaveLength(4)
  })

  it('disables rotate and the angle input for radial gradients', () => {
    const wrapper = mountEditor({ modelValue: 'radial-gradient(circle at center, #FF0000FF 0%, #0000FFFF 100%)' })
    expect(wrapper.get('[aria-label="Rotate gradient 90 degrees"]').attributes('disabled')).toBeDefined()
    expect(wrapper.get('[aria-label="Gradient angle"]').attributes('disabled')).toBeDefined()
  })
})

describe('GradientPickerAngleInput', () => {
  it('commits a changed angle once for Enter followed by blur', async () => {
    const wrapper = mountEditor()
    const input = wrapper.get('[aria-label="Gradient angle"]')
    await input.setValue('120')
    await input.trigger('keydown', { key: 'Enter' })
    expect(lastModel(wrapper)).toContain('linear-gradient(120deg')
    await input.trigger('blur')
    expect(wrapper.emitted('valueCommit')).toHaveLength(1)
  })

  it('does not commit an unchanged field on blur', async () => {
    const wrapper = mountEditor()
    await wrapper.get('[aria-label="Gradient angle"]').trigger('blur')
    expect(wrapper.emitted('valueCommit')).toBeUndefined()
  })

  it('resets invalid text without committing', async () => {
    const wrapper = mountEditor()
    const input = wrapper.get('[aria-label="Gradient angle"]')
    await input.setValue('abc')
    await input.trigger('blur')
    expect((input.element as HTMLInputElement).value).toBe('90°')
    expect(wrapper.emitted('valueCommit')).toBeUndefined()
  })

  it('accepts deg-suffixed and negative values, normalized', async () => {
    const wrapper = mountEditor()
    const input = wrapper.get('[aria-label="Gradient angle"]')
    await input.setValue('-90deg')
    await input.trigger('blur')
    expect((input.element as HTMLInputElement).value).toBe('270°')
    expect(lastModel(wrapper)).toContain('linear-gradient(270deg')
  })
})

describe('GradientPickerPositionInput', () => {
  it('moves the selected stop, re-sorting, and commits once', async () => {
    const wrapper = mountEditor()
    const input = wrapper.get('[aria-label="Stop position"]')
    await input.setValue('50')
    await input.trigger('keydown', { key: 'Enter' })
    await input.trigger('blur')
    expect(wrapper.emitted('valueCommit')).toHaveLength(1)
    expect(lastModel(wrapper)).toContain('#FF0000FF 50%')
  })

  it('clamps out-of-range positions', async () => {
    const wrapper = mountEditor()
    const input = wrapper.get('[aria-label="Stop position"]')
    await input.setValue('150')
    await input.trigger('blur')
    expect((input.element as HTMLInputElement).value).toBe('100%')
  })

  it('resets invalid text without committing', async () => {
    const wrapper = mountEditor()
    const input = wrapper.get('[aria-label="Stop position"]')
    await input.setValue('abc')
    await input.trigger('blur')
    expect((input.element as HTMLInputElement).value).toBe('0%')
    expect(wrapper.emitted('valueCommit')).toBeUndefined()
  })

  it('renders inert for a stale stop-id and ignores commits', async () => {
    const wrapper = mountEditor({}, () => [
      h(GradientPickerPositionInput, { stopId: 999, label: 'Stale' })
    ])
    const input = wrapper.get('[aria-label="Stale"]')
    expect(input.attributes('disabled')).toBeDefined()
    expect((input.element as HTMLInputElement).value).toBe('')
    await input.trigger('blur')
    expect(wrapper.emitted('valueCommit')).toBeUndefined()
  })
})

describe('GradientPickerSlider', () => {
  it('applies a moved position to the right stop and emits the model', async () => {
    const wrapper = mountEditor()
    wrapper.findComponent(SliderRoot).vm.$emit('update:modelValue', [0, 40, 66, 100])
    await nextTick()
    expect(lastModel(wrapper)).toBe(
      'linear-gradient(90deg, #FF0000FF 0%, #00FF00FF 40%, #0000FFFF 66%, #FFFF00FF 100%)'
    )
  })

  it('ignores emissions whose length does not match the stops', async () => {
    const wrapper = mountEditor()
    wrapper.findComponent(SliderRoot).vm.$emit('update:modelValue', [0, 40, 100])
    await nextTick()
    expect(wrapper.emitted('update:modelValue')).toBeUndefined()
  })

  it('keeps the dragged stop identified across a crossing onto a stacked position', async () => {
    const wrapper = mountEditor()
    const thumbs = wrapper.findAll('[aria-label^="Gradient stop"]')
    // pointerdown marks the green stop (index 1) as actively moved; bubbles:false
    // keeps reka's own pointer handling (and jsdom's missing pointer capture) out.
    thumbs[1]!.element.dispatchEvent(new Event('pointerdown', { bubbles: false }))

    const slider = wrapper.findComponent(SliderRoot)
    slider.vm.$emit('update:modelValue', [0, 66, 66, 100])
    await nextTick()
    slider.vm.$emit('update:modelValue', [0, 66, 70, 100])
    await nextTick()

    // Green (the active stop) crossed and moved on to 70; blue stayed at 66.
    expect(lastModel(wrapper)).toBe(
      'linear-gradient(90deg, #FF0000FF 0%, #0000FFFF 66%, #00FF00FF 70%, #FFFF00FF 100%)'
    )
  })

  it('selects on genuine focus but not while a move is live', async () => {
    const wrapper = mountEditor()
    const thumbs = wrapper.findAll('[aria-label^="Gradient stop"]')
    const position = wrapper.get('[aria-label="Stop position"]')

    thumbs[2]!.element.dispatchEvent(new FocusEvent('focus'))
    await nextTick()
    expect((position.element as HTMLInputElement).value).toBe('66%')

    // An armed keyboard move suppresses focus-driven selection...
    thumbs[2]!.element.dispatchEvent(new KeyboardEvent('keydown', { key: 'ArrowRight' }))
    thumbs[0]!.element.dispatchEvent(new FocusEvent('focus'))
    await nextTick()
    expect((position.element as HTMLInputElement).value).toBe('66%')

    // ...a non-slider key does not arm it, and keyup disarms.
    thumbs[2]!.element.dispatchEvent(new KeyboardEvent('keyup', { key: 'ArrowRight' }))
    thumbs[2]!.element.dispatchEvent(new KeyboardEvent('keydown', { key: 'a' }))
    thumbs[0]!.element.dispatchEvent(new FocusEvent('focus'))
    await nextTick()
    expect((position.element as HTMLInputElement).value).toBe('0%')
  })

  it('clears the active move on pointercancel', async () => {
    const wrapper = mountEditor()
    const thumbs = wrapper.findAll('[aria-label^="Gradient stop"]')
    const position = wrapper.get('[aria-label="Stop position"]')

    thumbs[1]!.element.dispatchEvent(new Event('pointerdown', { bubbles: false }))
    thumbs[1]!.element.dispatchEvent(new Event('pointercancel', { bubbles: false }))
    thumbs[3]!.element.dispatchEvent(new FocusEvent('focus'))
    await nextTick()
    expect((position.element as HTMLInputElement).value).toBe('100%')
  })

  it('defers reka valueCommit one tick so the payload is fresh', async () => {
    const wrapper = mountEditor()
    const slider = wrapper.findComponent(SliderRoot)
    slider.vm.$emit('update:modelValue', [0, 40, 66, 100])
    slider.vm.$emit('valueCommit', [0, 40, 66, 100])
    expect(wrapper.emitted('valueCommit')).toBeUndefined()
    await nextTick()
    const commits = wrapper.emitted('valueCommit')
    expect(commits).toHaveLength(1)
    expect(String(commits![0]![0])).toContain('#00FF00FF 40%')
  })
})

describe('GradientPickerPreview', () => {
  it('renders the gradient, or the flat strip with track', () => {
    const wrapper = mountEditor()
    const styles = wrapper.findAll('div').map((d) => d.attributes('style')).filter(Boolean)
    expect(styles.some((s) => s!.includes('linear-gradient(90deg'))).toBe(true)
    expect(styles.some((s) => s!.includes('linear-gradient(to right'))).toBe(true)
  })
})

describe('disabled root', () => {
  it('disables buttons, inputs and slider interaction', async () => {
    const wrapper = mountEditor({ disabled: true })
    expect(wrapper.get('[aria-label="Add gradient stop"]').attributes('disabled')).toBeDefined()
    expect(wrapper.get('[aria-label="Gradient angle"]').attributes('disabled')).toBeDefined()
    expect(wrapper.get('[aria-label="Stop position"]').attributes('disabled')).toBeDefined()

    wrapper.findComponent(SliderRoot).vm.$emit('update:modelValue', [0, 40, 66, 100])
    await nextTick()
    expect(wrapper.emitted('update:modelValue')).toBeUndefined()
  })
})
