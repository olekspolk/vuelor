export default {
  slots: {
    root: 'relative flex items-center select-none touch-none',
    track: 'relative grow rounded-full shadow-[inset_0_0_0_1px_#0000001a]',
    thumb: 'block w-4 h-4 rounded-full border-4 border-white shadow-[var(--elevation-thumb)] focus:outline-1 outline-[#0d99ff]'
  },
  variants: {
    orientation: {
      horizontal: {
        root: 'h-4 w-full',
        track: 'h-4 w-full',
      },
      vertical: {
        root: 'h-auto w-4 flex-col',
        track: 'h-48 w-4'
      }
    }
  }
}
