export default {
  picker: {
    root: 'w-60 bg-vuelor-surface shadow-vuelor-card rounded-[13px] p-4 flex flex-col gap-2'
  },
  dropper: {
    base: 'enabled:hover:bg-black/5 disabled:opacity-50 rounded-[5px] focus-within:outline-1 focus-within:outline-vuelor-primary p-1'
  },
  shared: {
    thumb: 'block w-4 h-4 rounded-full border-4 border-white shadow-vuelor-thumb focus:outline-1 outline-vuelor-primary'
  },
  canvas: {
    root: 'touch-none data-[disabled]:pointer-events-none data-[disabled]:opacity-50',
    area: 'rounded-[5px] outline-1 outline-solid -outline-offset-1 outline-black/10'
  },
  slider: {
    root: 'relative h-4 w-full flex items-center select-none touch-none data-[orientation=vertical]:h-auto data-[orientation=vertical]:w-4 data-[orientation=vertical]:flex-col data-[disabled]:pointer-events-none data-[disabled]:opacity-50',
    track: 'relative h-4 w-full shadow-vuelor-inner grow rounded-full data-[orientation=vertical]:h-full data-[orientation=vertical]:w-4'
  },
  input: {
    group: 'w-full flex gap-[1px] rounded-[5px] hover:outline-1 outline-vuelor-border focus-within:outline-1 focus-within:outline-vuelor-primary data-[disabled]:pointer-events-none data-[disabled]:opacity-50 data-[disabled]:outline-none',
    item: 'flex flex-1 data-[before]:grow-0 data-[alpha-input]:grow-0 items-center px-1 gap-1 bg-vuelor-input first:rounded-l-[5px] last:rounded-r-[5px]',
    label: 'select-none text-black text-[11px] opacity-40 data-[alpha-label]:block',
    field: 'w-full min-w-5 h-6 text-[11px] focus:outline-none'
  },
  swatch: {
    base: 'relative grow-0 h-4 w-4 rounded-[20%] overflow-hidden focus-within:outline-1 focus-within:outline-vuelor-primary disabled:opacity-50',
    alpha: 'absolute top-0 right-0 h-full w-1/2'
  }
}
