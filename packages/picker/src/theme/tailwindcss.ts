export default {
  picker: {
    root: 'w-60 bg-white rounded-[13px] p-4 flex flex-col gap-2 shadow-vuelor-card'
  },
  dropper: {
    base: 'enabled:hover:bg-[#0000000d] disabled:opacity-50 rounded-[5px] focus-within:outline-1 focus-within:outline-[#0d99ff] p-1'
  },
  shared: {
    thumb: 'block w-4 h-4 rounded-full border-4 border-white shadow-vuelor-thumb focus:outline-1 outline-[#0d99ff]'
  },
  canvas: {
    root: 'relative touch-none data-[disabled]:pointer-events-none data-[disabled]:opacity-50',
    area: 'rounded-[5px] shadow-vuelor-inner'
  },
  slider: {
    root: 'relative h-4 w-full flex items-center select-none touch-none data-[orientation=vertical]:h-auto data-[orientation=vertical]:w-4 data-[orientation=vertical]:flex-col data-[disabled]:pointer-events-none data-[disabled]:opacity-50',
    track: 'relative h-4 w-full shadow-vuelor-inner grow rounded-full data-[orientation=vertical]:h-full data-[orientation=vertical]:w-4'
  },
  input: {
    group: 'w-full flex gap-[1px] rounded-[5px] enabled:hover:outline-1 outline-[#e6e6e6] focus-within:outline-1 focus-within:outline-[#0d99ff] data-[disabled]:pointer-events-none data-[disabled]:opacity-50',
    item: 'flex flex-1 data-[alpha-input]:grow-0 items-center px-1.5 gap-1 bg-[#f5f5f5] first:rounded-l-[5px] last:rounded-r-[5px]',
    label: 'select-none text-black text-[11px] opacity-40',
    field: 'w-full h-6 min-w-5 text-[11px] focus:outline-none'
  }
}
