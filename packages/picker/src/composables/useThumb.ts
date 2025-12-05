import type { Ref, CSSProperties } from 'vue'
import { ref, computed, onMounted, onUnmounted } from 'vue'
import { clamp } from '../utils/helpers.ts'
import { RGBAtoCSS } from '../utils/color.ts'
import { injectColorPickerContext } from '../components/ColorPickerRoot.vue'

export function useThumb(canvasRef: Ref<HTMLCanvasElement | null>, type: Ref<'HSV' | 'HSL'>) {
  const rootContext = injectColorPickerContext()

  const bounding = ref({
    top: 1,
    left: 1,
    width: 1,
    height: 1
  })

  const { hsl, hsv } = rootContext

  const top = computed({
    get: () => type.value === 'HSV' ? (1 - hsv.value.v) : (1 - hsl.value.l),
    set: (val: number) => {
      if (type.value === 'HSV') {
        hsv.value = { ...hsv.value, v: clamp(1 - val, 0, 1)}
      } else {
        hsl.value = { ...hsl.value, l: clamp(1 - val, 0, 1)}
      }
    }
  })

  const left = computed({
    get: () => type.value === 'HSV' ? hsv.value.s : hsl.value.s,
    set: (val: number) => {
      if (type.value === 'HSV') {
        hsv.value = { ...hsv.value, s: clamp(val, 0, 1)}
      } else {
        hsl.value = { ...hsl.value, s: clamp(val, 0, 1)}
      }
    }
  })

  const isVisible = ref(false)

  const thumbStyles = computed<CSSProperties>(() => {
    const thumbX = left.value * bounding.value.width
    const thumbY = top.value * bounding.value.height
    return {
      top: 0,
      left: 0,
      position: 'absolute',
      display: isVisible.value ? undefined : 'none',
      backgroundColor: RGBAtoCSS({ ...rootContext.rgba.value, a: 1 }),
      transform: `translate3d(calc(-50% + ${thumbX}px), calc(-50% + ${thumbY}px), 0px)`
    }
  })

  onMounted(() => {
    updateBounding()
    isVisible.value = true
    window.addEventListener('resize', updateBounding)
  })

  onUnmounted(() => {
    window.removeEventListener('resize', updateBounding)
  })

  function updateBounding() {
    const canvas = canvasRef.value
    if (!canvas) return
    bounding.value = canvas.getBoundingClientRect()
  }

  function handlePointerDown(event: PointerEvent) {
    if (rootContext.disabled.value) return

    document.addEventListener('pointermove', handlePointerMove)
    document.addEventListener('pointerup', handlePointerUp)
    updateBounding()
    handlePointerMove(event)
  }

  function handlePointerMove(event: PointerEvent) {
    event.preventDefault()
    const canvasY = event.clientY - bounding.value.top
    const canvasX = event.clientX - bounding.value.left
    left.value = clamp(canvasX, 0, bounding.value.width) / bounding.value.width
    top.value = clamp(canvasY, 0, bounding.value.height) / bounding.value.height
  }

  function handlePointerUp() {
    document.removeEventListener('pointermove', handlePointerMove)
    document.removeEventListener('pointerup', handlePointerUp)
    rootContext.commitValue()
  }

  function handleKeyDown(event: KeyboardEvent) {
    if (rootContext.disabled.value) return

    const step = event.shiftKey ? 0.1 : 0.01
    switch (event.key) {
      case 'ArrowUp':
        event.preventDefault()
        top.value -= step
        rootContext.commitValue()
        break
      case 'ArrowDown':
        event.preventDefault()
        top.value += step
        rootContext.commitValue()
        break
      case 'ArrowLeft':
        event.preventDefault()
        left.value -= step
        rootContext.commitValue()
        break
      case 'ArrowRight':
        event.preventDefault()
        left.value += step
        rootContext.commitValue()
        break
    }
  }

  function handleWheel(event: WheelEvent) {
    if (rootContext.disabled.value) return

    const step = event.deltaY * 0.1
    const hue = (rootContext.hsv.value.h + step) % 360
    event.preventDefault()
    rootContext.hsv.value = {
      ...rootContext.hsv.value,
      h: hue < 0 ? 360 : hue
    }
  }

  return {
    thumbStyles,
    handleWheel,
    handleKeyDown,
    handlePointerDown
  }
}
