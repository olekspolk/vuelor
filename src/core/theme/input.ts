export default {
  slots: {
    group: 'w-full flex gap-[1px] rounded-[5px] hover:outline-1 outline-[#e6e6e6] focus-within:outline-1 focus-within:outline-[#0d99ff]',
    field: 'w-7 flex-1 bg-[#f5f5f5] first:rounded-l-[5px] last:rounded-r-[5px] px-2 h-6 focus:outline-none text-[11px]'
  },
  variants: {
    disabled: {
      true: {
        group: 'pointer-events-none opacity-50'
      }
    }
  }
}
