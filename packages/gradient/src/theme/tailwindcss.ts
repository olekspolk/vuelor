export default {
  root: {
    root: 'w-60 bg-vuelor-surface shadow-vuelor-card rounded-[13px] p-4 flex flex-col gap-3'
  },
  slider: {
    root: 'relative w-full flex items-center select-none touch-none data-[disabled]:pointer-events-none data-[disabled]:opacity-50',
    track: 'relative grow h-8 rounded-[5px] shadow-vuelor-inner',
    thumb: 'flex items-center justify-center w-6 h-6 -mt-8 drop-shadow-vuelor-thumb rounded-[5px] outline-none focus-visible:outline focus-visible:outline-2 focus-visible:outline-vuelor-primary relative after:content-[\'\'] after:absolute after:top-[100%] after:left-1/2 after:-translate-x-1/2 after:border-l-[6px] after:border-l-transparent after:border-r-[6px] after:border-r-transparent after:border-t-[6px] bg-vuelor-surface after:border-t-vuelor-surface data-[selected]:bg-vuelor-primary data-[selected]:after:border-t-vuelor-primary',
    thumbSwatch: 'relative overflow-hidden w-3.5 h-3.5 border border-vuelor-border rounded-sm'
  },
  input: {
    group: 'flex gap-[1px] rounded-[5px] hover:outline-1 outline-vuelor-border focus-within:outline-1 focus-within:outline-vuelor-primary data-[disabled]:pointer-events-none data-[disabled]:opacity-50 data-[disabled]:outline-none',
    item: 'flex flex-1 items-center px-1 gap-1 bg-vuelor-input rounded-[5px]',
    field: 'w-full min-w-5 h-6 text-[11px] focus:outline-none'
  },
  button: {
    root: 'rounded-[5px] enabled:hover:bg-vuelor-input disabled:opacity-50 focus:outline focus:outline-vuelor-primary'
  },
  preview: {
    root: 'h-8 w-full rounded-[5px] shadow-vuelor-inner'
  }
}
