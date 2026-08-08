import { describe, it, expect, vi } from 'vitest'
import { reactive, nextTick } from 'vue'
import { useVModel } from '../src/composables/useVModel.ts'

function setup (initial: string | null = 'a') {
  const props = reactive({ modelValue: initial })
  const emitted: (string | null)[] = []
  const onUpdate = vi.fn()
  const emit = (_e: 'update:modelValue', value: string | null) => { emitted.push(value) }
  const model = useVModel<string | null>(props, emit as never, onUpdate)
  return { props, emitted, onUpdate, model }
}

describe('useVModel', () => {
  it('parses the initial value immediately', () => {
    const { onUpdate } = setup('a')
    expect(onUpdate).toHaveBeenCalledTimes(1)
    expect(onUpdate).toHaveBeenCalledWith('a')
  })

  it('forwards genuine parent writes to onUpdate', async () => {
    const { props, onUpdate } = setup('a')
    props.modelValue = 'b'
    await nextTick()
    expect(onUpdate).toHaveBeenCalledWith('b')
    expect(onUpdate).toHaveBeenCalledTimes(2)
  })

  it('emits through the setter and swallows the parent echo', async () => {
    const { props, emitted, onUpdate, model } = setup('a')
    model.value = 'c'
    expect(emitted).toEqual(['c'])

    // The parent writing back the value we just emitted must not re-parse.
    props.modelValue = 'c'
    await nextTick()
    expect(onUpdate).toHaveBeenCalledTimes(1)

    // But a subsequent different parent value does.
    props.modelValue = 'd'
    await nextTick()
    expect(onUpdate).toHaveBeenCalledTimes(2)
    expect(onUpdate).toHaveBeenLastCalledWith('d')
  })

  it('reads the live prop through the getter', () => {
    const { props, model } = setup('a')
    props.modelValue = 'z'
    expect(model.value).toBe('z')
  })
})
