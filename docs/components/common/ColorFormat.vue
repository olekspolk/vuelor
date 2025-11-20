<script lang="ts" setup>
import {
  AcceptableValue,
  SelectContent,
  SelectItem,
  SelectItemIndicator,
  SelectItemText,
  SelectPortal,
  SelectRoot,
  SelectTrigger,
  SelectValue,
  SelectViewport,
} from 'reka-ui'

const props = defineProps<{
  disabled?: boolean,
  options?: string[],
  modelValue?: string
}>()

const emit = defineEmits<{
  (e: 'update:modelValue', value: AcceptableValue): any
}>()
</script>

<template>
  <SelectRoot
    :disabled="props.disabled"
    :modelValue="props.modelValue"
    @update:modelValue="(value: AcceptableValue) => emit('update:modelValue', value)"
  >
    <SelectTrigger
      aria-label="Color format"
      class="inline-flex w-[56px] h-6 pl-[7px] items-center justify-between rounded-[5px] text-[11px] leading-none gap-[5px] border border-[#e6e6e6] focus:outline-none focus:border-[#0d99ff]"
    >
      <SelectValue placeholder="Format" />
      <svg width="24" height="24" fill="none" viewBox="0 0 24 24">
        <path
          fill="black"
          fill-rule="evenodd"
          clip-rule="evenodd"
          d="M9.646 11.146a.5.5 0 0 1 .708 0L12 12.793l1.646-1.647a.5.5 0 0 1 .708.708l-2 2a.5.5 0 0 1-.708 0l-2-2a.5.5 0 0 1 0-.708"
        />
      </svg>
    </SelectTrigger>

    <SelectPortal>
      <SelectContent
        class="w-[96px] px-2 bg-[#1e1e1e] rounded-[13px] shadow-sm will-change-[opacity,transform] data-[side=top]:animate-slideDownAndFade data-[side=right]:animate-slideLeftAndFade data-[side=bottom]:animate-slideUpAndFade data-[side=left]:animate-slideRightAndFade z-[100]"
        :side-offset="5"
      >
        <SelectViewport class="py-2">
          <SelectItem
            v-for="(option, index) in props.options"
            :key="index"
            :value="option"
            class="text-xs leading-none text-white rounded-[5px] flex items-center h-[25px] pl-6 pr-2 relative select-none data-[disabled]:text-mauve8 data-[disabled]:pointer-events-none data-[highlighted]:outline-none data-[highlighted]:bg-[#0d99ff]"
          >
            <SelectItemIndicator class="absolute left-1 inline-flex items-center justify-center">
              <svg
                xmlns="http://www.w3.org/2000/svg"
                width="16"
                height="16"
                viewBox="0 0 16 16"
              >
                <path
                  fill="#fff"
                  fill-opacity="1"
                  fill-rule="nonzero"
                  stroke="none"
                  d="M13.207 5.207 7 11.414 3.292 7.707l1.415-1.414L7 8.586l4.793-4.793z"
                />
              </svg>
            </SelectItemIndicator>
            <SelectItemText>
              {{ option }}
            </SelectItemText>
          </SelectItem>
        </SelectViewport>
      </SelectContent>
    </SelectPortal>
  </SelectRoot>
</template>
