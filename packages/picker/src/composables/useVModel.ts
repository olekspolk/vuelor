import { ref, computed, watch } from 'vue'

export function useVModel<T>(
  props: { modelValue: T },
  emit: { (e: 'update:modelValue', value: T): void },
  onUpdate: (value: T) => void
) {
  const lastEmittedValue = ref<T | null>(null)

  watch(
    () => props.modelValue,
    (value) => {
      if (value !== lastEmittedValue.value) {
        onUpdate(value)
      }
    },
    { immediate: true }
  )

  return computed<T>({
    get: () => props.modelValue,
    set: (value: T) => {
      lastEmittedValue.value = value
      emit('update:modelValue', value)
    }
  })
}
