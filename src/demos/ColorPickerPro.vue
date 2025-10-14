<script lang="ts" setup>
import { ref, inject } from 'vue'
import {
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
import {
  ColorPickerRoot,
  ColorPickerCanvas,
  ColorPickerSliderHue,
  ColorPickerSliderAlpha,
  ColorPickerInputHEX
} from '../core'

const color = inject('color') as string

const format = ref('Hex')
const options = ['Hex', 'RGB', 'CSS', 'HSL', 'HSB']
</script>

<template>
  <ColorPickerRoot v-model="color">
    <ColorPickerCanvas />
    <div class="flex items-center gap-3">
      <button class="hover:bg-[#0000000d] rounded-[5px] focus:outline-1 outline-[#0d99ff]">
        <svg width="24" height="24" fill="none" viewBox="0 0 24 24"><path fill="#000" fill-rule="evenodd" d="M17.52 6.471a1.62 1.62 0 0 0-2.295.003l-1.87 1.88-.354.355-.355-.354-.01-.01a.9.9 0 0 0-1.272 0l-.02.02a.9.9 0 0 0 0 1.273l.51.51 2 2 .51.51a.9.9 0 0 0 1.272 0l.02-.02a.9.9 0 0 0 0-1.273l-.01-.01-.352-.353.351-.353 1.879-1.888a1.62 1.62 0 0 0-.003-2.29m-3.004-.702a2.621 2.621 0 1 1 3.717 3.697l-1.57 1.579a1.9 1.9 0 0 1-.3 2.3l-.02.02a1.9 1.9 0 0 1-2.687 0l-.156-.157-5.647 5.642a.5.5 0 0 1-.353.147H5.504a.5.5 0 0 1-.5-.5L5 16.503a.5.5 0 0 1 .146-.354l5.647-5.647-.157-.156a1.9 1.9 0 0 1 0-2.687l.02-.02a1.9 1.9 0 0 1 2.299-.3zm-3.016 5.44 1.293 1.292-5.5 5.496h-1.29L6 16.707z" clip-rule="evenodd"></path></svg>
      </button>
      <div class="flex flex-col flex-1 gap-2">
        <ColorPickerSliderHue />
        <ColorPickerSliderAlpha />
      </div>
    </div>
    <div class="flex items-center gap-2">
      <SelectRoot v-model="format">
        <SelectTrigger
          class="inline-flex w-[56px] h-6 pl-[7px] items-center justify-between rounded-[5px] text-[11px] leading-none gap-[5px] border border-[#e6e6e6] focus:outline-1 outline-[#0d99ff]"
          aria-label="Color format"
        >
          <SelectValue placeholder="Format" />
          <svg width="24" height="24" fill="none" viewBox="0 0 24 24"><path fill="black" fill-rule="evenodd" d="M9.646 11.146a.5.5 0 0 1 .708 0L12 12.793l1.646-1.647a.5.5 0 0 1 .708.708l-2 2a.5.5 0 0 1-.708 0l-2-2a.5.5 0 0 1 0-.708" clip-rule="evenodd"></path></svg>
        </SelectTrigger>

        <SelectPortal>
          <SelectContent
            class="w-[96px] px-2 bg-[#1e1e1e] rounded-[13px] shadow-sm will-change-[opacity,transform] data-[side=top]:animate-slideDownAndFade data-[side=right]:animate-slideLeftAndFade data-[side=bottom]:animate-slideUpAndFade data-[side=left]:animate-slideRightAndFade z-[100]"
            :side-offset="5"
          >
            <SelectViewport class="py-2">
              <SelectItem
                v-for="(option, index) in options"
                :key="index"
                class="text-xs leading-none text-white rounded-[5px] flex items-center h-[25px] pl-6 pr-2 relative select-none data-[disabled]:text-mauve8 data-[disabled]:pointer-events-none data-[highlighted]:outline-none data-[highlighted]:bg-[#0d99ff]"
                :value="option"
              >
                <SelectItemIndicator class="absolute left-1 inline-flex items-center justify-center">
                  <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 16 16"><path fill="#fff" fill-opacity="1" fill-rule="nonzero" stroke="none" d="M13.207 5.207 7 11.414 3.292 7.707l1.415-1.414L7 8.586l4.793-4.793z"></path></svg>
                </SelectItemIndicator>
                <SelectItemText>
                  {{ option }}
                </SelectItemText>
              </SelectItem>
            </SelectViewport>
          </SelectContent>
        </SelectPortal>
      </SelectRoot>
      <ColorPickerInputHEX class="w-[144px]" />
    </div>
  </ColorPickerRoot>
</template>
