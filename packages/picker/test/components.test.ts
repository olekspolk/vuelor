import { describe, it, expect } from 'vitest'
import { createSSRApp, h } from 'vue'
import { renderToString } from 'vue/server-renderer'
import {
  ColorPickerRoot,
  ColorPickerCanvas,
  ColorPickerEyeDropper,
  ColorPickerSliderHue,
  ColorPickerSliderAlpha,
  ColorPickerInputHex,
  ColorPickerInputRGB,
  ColorPickerSwatch
} from '../src'

function render (props: Record<string, unknown> = {}, children?: () => unknown) {
  const app = createSSRApp({
    render: () => h(ColorPickerRoot as never, { modelValue: '#FF0000FF', ...props }, {
      default: children ?? (() => [
        h(ColorPickerCanvas),
        h(ColorPickerEyeDropper, null, { default: () => 'EYEDROPPER' }),
        h(ColorPickerSliderHue),
        h(ColorPickerSliderAlpha),
        h(ColorPickerInputHex),
        h(ColorPickerInputRGB),
        h(ColorPickerSwatch, { value: '#00FF00FF' })
      ])
    })
  })
  return renderToString(app)
}

describe('picker components (SSR smoke)', () => {
  it('renders the composed picker from a modelValue', async () => {
    const html = await render()
    expect(html).toContain('aria-label="Hue"')
    expect(html).toContain('aria-label="Opacity"')
    expect(html).toContain('value="FF0000"')
    // RGB channel fields carry the parsed components.
    expect(html).toContain('value="255"')
    expect(html).toContain('background-color:rgb(0, 255, 0)')
  })

  it('does not render the eyedropper without the browser API', async () => {
    const html = await render()
    expect(html).not.toContain('EYEDROPPER')
  })

  it('renders vanillacss class names in vanillacss mode', async () => {
    const html = await render({ styling: 'vanillacss' })
    expect(html).toContain('vuelor-picker-root')
    expect(html).toContain('vuelor-picker-canvas-root')
    expect(html).toContain('vuelor-picker-input-field')
    expect(html).toContain('vuelor-picker-swatch-root')
  })

  it('propagates the disabled state', async () => {
    const html = await render({ disabled: true })
    expect(html).toContain('data-disabled')
  })

  it('falls back to defaultValue on a format/type mismatch', async () => {
    const originalEnv = process.env.NODE_ENV
    process.env.NODE_ENV = 'production' // silence the expected dev warning
    const html = await render({ modelValue: { rgb: { r: 1, g: 2, b: 3 } }, format: 'hexa', defaultValue: '#00FF00FF' })
    process.env.NODE_ENV = originalEnv
    expect(html).toContain('value="00FF00"')
  })
})
