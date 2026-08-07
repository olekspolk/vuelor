import './style/index.css'
export * from './core/types.ts'
export * from './core/parse.ts'
export * from './core/serialize.ts'
export * from './core/stops.ts'

export { useGradient, DEFAULT_MAX_STOPS } from './composables/useGradient.ts'
export type { UseGradientOptions, UseGradientReturn, ManagedGradientStop } from './composables/useGradient.ts'

export { injectGradientPickerContext } from './components/GradientPickerRoot.vue'

export { default as GradientPickerRoot } from './components/GradientPickerRoot.vue'
export { default as GradientPickerSlider } from './components/GradientPickerSlider.vue'
export { default as GradientPickerPositionInput } from './components/GradientPickerPositionInput.vue'
export { default as GradientPickerAngleInput } from './components/GradientPickerAngleInput.vue'
export { default as GradientPickerAddStop } from './components/GradientPickerAddStop.vue'
export { default as GradientPickerRemoveStop } from './components/GradientPickerRemoveStop.vue'
export { default as GradientPickerReverse } from './components/GradientPickerReverse.vue'
export { default as GradientPickerRotate } from './components/GradientPickerRotate.vue'
export { default as GradientPickerPreview } from './components/GradientPickerPreview.vue'

export type { GradientPickerRootProps, GradientPickerRootEmits, GradientPickerRootContext } from './components/GradientPickerRoot.vue'
export type { GradientThemeSlots } from './theme/index.ts'
