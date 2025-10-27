import type { Ref, CSSProperties } from 'vue'
import { ref, computed, onMounted, onUnmounted } from 'vue'
import { clamp } from '../utils/helpers.ts'
import { RGBAtoCSS } from '../utils/color.ts'
import { injectColorPickerContext } from '../components/ColorPickerRoot.vue'

export function useThumb(canvasRef: Ref<HTMLCanvasElement | null>) {
  const rootContext = injectColorPickerContext()

  const bounding = ref({
    top: 1,
    left: 1,
    width: 1,
    height: 1
  })

  const thumbStyles = computed<CSSProperties>(() => {
    const X = rootContext.hsv.value.s * bounding.value.width
    const Y = (1 - rootContext.hsv.value.v) * bounding.value.height
    return {
      top: 0,
      left: 0,
      position: 'absolute',
      backgroundColor: RGBAtoCSS({ ...rootContext.rgba.value, a: 1 }),
      transform: `translate3d(calc(-50% + ${X}px), calc(-50% + ${Y}px), 0px)`
    }
  })

  onMounted(() => {
    updateBounding()
    window.addEventListener('resize', updateBounding)
    canvasRef.value?.addEventListener('pointerdown', handlePointerDown)
  })

  onUnmounted(() => {
    window.removeEventListener('resize', updateBounding)
    canvasRef.value?.removeEventListener('pointerdown', handlePointerDown)
  })

  function updateBounding() {
    const canvas = canvasRef.value
    if (!canvas) return
    bounding.value = canvas.getBoundingClientRect()
  }

  function handlePointerDown(event: PointerEvent) {
    document.addEventListener('pointermove', handlePointerMove)
    document.addEventListener('pointerup', handlePointerUp)
    updateBounding()
    handlePointerMove(event)
  }

  function handlePointerMove(event: PointerEvent) {
    event.preventDefault()
    const shiftY = event.clientY - bounding.value.top
    const shiftX = event.clientX - bounding.value.left
    rootContext.hsv.value = {
      ...rootContext.hsv.value,
      s: clamp(shiftX, 0, bounding.value.width) / bounding.value.width,
      v: (1 - clamp(shiftY, 0, bounding.value.height) / bounding.value.height),
    }
  }

  function handlePointerUp() {
    document.removeEventListener('pointermove', handlePointerMove)
    document.removeEventListener('pointerup', handlePointerUp)
    rootContext.emitUpdateEnd()
  }

  function handleKeyDown(event: KeyboardEvent) {
    const step = event.shiftKey ? 0.1 : 0.01
    switch (event.key) {
      case 'ArrowUp':
        event.preventDefault()
        rootContext.hsv.value = {
          ...rootContext.hsv.value,
          v: Math.min(rootContext.hsv.value.v + step, 1)
        }
        rootContext.emitUpdateEnd()
        break
      case 'ArrowDown':
        event.preventDefault()
        rootContext.hsv.value = {
          ...rootContext.hsv.value,
          v: Math.max(rootContext.hsv.value.v - step, 0)
        }
        rootContext.emitUpdateEnd()
        break
      case 'ArrowLeft':
        event.preventDefault()
        rootContext.hsv.value = {
          ...rootContext.hsv.value,
          s: Math.max(rootContext.hsv.value.s - step, 0)
        }
        rootContext.emitUpdateEnd()
        break
      case 'ArrowRight':
        event.preventDefault()
        rootContext.hsv.value = {
          ...rootContext.hsv.value,
          s: Math.min(rootContext.hsv.value.s + step, 1)
        }
        rootContext.emitUpdateEnd()
        break
    }
  }

  return {
    thumbStyles,
    handleKeyDown
  }
}
