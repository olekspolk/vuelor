import { injectColorPickerContext } from '../components/ColorPickerRoot.vue'
import { clamp } from '../utils/helpers.ts'

export function useChannelInput<T extends Record<string, number>>(
  getValue: () => T,
  setValue: (value: T) => void,
  options: { hueChannel?: keyof T & string, defaultMax?: number } = {}
) {
  const rootContext = injectColorPickerContext()
  const { hueChannel, defaultMax = 100 } = options

  type Channel = keyof T & string

  // Channels other than the hue channel are stored as 0–1 fractions internally
  // but displayed and edited as 0–100 integers.
  function isScaled(channel: Channel): boolean {
    return hueChannel !== undefined && channel !== hueChannel
  }

  function toDisplay(channel: Channel, value: number): number {
    return Math.round(isScaled(channel) ? value * 100 : value)
  }

  function parseChannelValue(e: Event, channel: Channel, max: number = defaultMax) {
    const target = e.target as HTMLInputElement
    const intValue = parseInt(target.value, 10)
    const current = toDisplay(channel, getValue()[channel])
    const next = isNaN(intValue) ? current : clamp(intValue, 0, max)
    if (current !== next) {
      setValue({ ...getValue(), [channel]: isScaled(channel) ? next / 100 : next } as T)
      rootContext.commitValue()
    } else {
      target.value = current.toString()
    }
  }

  function handleAlphaInput(e: Event) {
    const target = e.target as HTMLInputElement
    const intValue = parseInt(target.value, 10)
    const next = isNaN(intValue) ? rootContext.alpha.value : clamp(intValue, 0, 100)
    if (rootContext.alpha.value !== next) {
      rootContext.alpha.value = next
      rootContext.commitValue()
    } else {
      target.value = next.toString()
    }
  }

  return { parseChannelValue, handleAlphaInput, toDisplay }
}
