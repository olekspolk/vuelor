export default {
  slots: {
    root: 'relative flex items-center select-none touch-none',
    track: 'relative grow rounded-full',
    thumb: 'block w-4 h-4 rounded-full border-2 border-white shadow-[var(--elevation-thumb)] focus:outline-1 outline-[#0d99ff]'
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
