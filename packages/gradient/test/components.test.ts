import { describe, it, expect } from 'vitest'
import { createSSRApp, h } from 'vue'
import { renderToString } from 'vue/server-renderer'
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

// Server-renders the full composed editor: exercises context provide/inject,
// every component's setup and template, and modelValue parsing — no DOM needed.
describe('components (SSR smoke)', () => {
  it('renders the composed editor from a modelValue', async () => {
    const app = createSSRApp({
      render: () => h(
        GradientPickerRoot,
        { modelValue: 'linear-gradient(45deg, #FF0000FF 0%, #0000FFFF 100%)' },
        {
          default: () => [
            h(GradientPickerSlider),
            h(GradientPickerAngleInput),
            h(GradientPickerPositionInput),
            h(GradientPickerAddStop),
            h(GradientPickerRemoveStop),
            h(GradientPickerReverse),
            h(GradientPickerRotate),
            h(GradientPickerPreview)
          ]
        }
      )
    })

    const html = await renderToString(app)

    // The parsed model reached every consumer of the context.
    expect(html).toContain('aria-label="Gradient stop 1 of 2"')
    expect(html).toContain('aria-label="Gradient stop 2 of 2"')
    expect(html).toContain('data-selected')
    expect(html).toContain('linear-gradient(to right, #FF0000FF 0%, #0000FFFF 100%)')
    expect(html).toContain('linear-gradient(45deg, #FF0000FF 0%, #0000FFFF 100%)')
    expect(html).toContain('45°')
    expect(html).toContain('0%')
    expect(html).toContain('aria-label="Add gradient stop"')
    expect(html).toContain('aria-label="Remove gradient stop"')
    expect(html).toContain('aria-label="Reverse gradient"')
    expect(html).toContain('aria-label="Rotate gradient 90 degrees"')
  })

  it('renders an inert position input for a stale stop-id', async () => {
    const app = createSSRApp({
      render: () => h(
        GradientPickerRoot,
        {},
        { default: () => h(GradientPickerPositionInput, { stopId: 999, label: 'Stale stop' }) }
      )
    })

    const html = await renderToString(app)

    // A provided-but-unresolved id must not fall back to the selected stop:
    // the input renders disabled and empty instead.
    expect(html).toContain('aria-label="Stale stop"')
    expect(html).toMatch(/aria-label="Stale stop"[^>]*disabled/)
    expect(html).not.toMatch(/aria-label="Stale stop"[^>]*value="0%"/)
  })

  it('renders vanillacss class names in vanillacss mode', async () => {
    const app = createSSRApp({
      render: () => h(
        GradientPickerRoot,
        { styling: 'vanillacss' },
        { default: () => [h(GradientPickerSlider), h(GradientPickerPreview)] }
      )
    })

    const html = await renderToString(app)

    expect(html).toContain('vuelor-gradient-root')
    expect(html).toContain('vuelor-gradient-slider-track')
    expect(html).toContain('vuelor-gradient-slider-thumb-swatch')
    expect(html).toContain('vuelor-gradient-preview-root')
  })
})
