export default {
  picker: {
    root: 'bg-white rounded-[13px] p-4 flex flex-col gap-2 shadow-[var(--elevation-card)]'
  },
  shared: {
    thumb: 'block w-4 h-4 rounded-full border-4 border-white shadow-[var(--elevation-thumb)] focus:outline-1 outline-[#0d99ff]'
  },
  canvas: {
    root: 'relative data-disabled:pointer-events-none data-disabled:opacity-50',
    area: 'rounded-[5px] outline-1 outline-solid -outline-offset-1 outline-[#0000001a]'
  },
  slider: {
    root: 'relative h-4 w-full data-[orientation=vertical]:h-auto data-[orientation=vertical]:w-4 flex items-center data-[orientation=vertical]:flex-col select-none touch-none data-disabled:pointer-events-none data-disabled:opacity-50',
    track: 'relative h-4 w-full data-[orientation=vertical]:h-full data-[orientation=vertical]:w-4 grow rounded-full shadow-[inset_0_0_0_1px_#0000001a]'
  },
  input: {
    group: 'w-full flex gap-[1px] rounded-[5px] hover:outline-1 outline-[#e6e6e6] focus-within:outline-1 focus-within:outline-[#0d99ff] data-[disabled]:pointer-events-none data-[disabled]:opacity-50',
    field: 'w-7 flex-1 bg-[#f5f5f5] first:rounded-l-[5px] last:rounded-r-[5px] px-2 h-6 focus:outline-none text-[11px]'
  }
}
